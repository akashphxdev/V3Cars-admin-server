// src/modules/roles/role.controller.ts

import { Request, Response } from 'express';
import {
  getAllRoles,
  getTopLevelRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from './role.service';
import {
  validateCreateRole,
  validateUpdateRole,
  validateIdParam,
} from './role.validation';

// ─── IP Helper ────────────────────────────────────────────────────────────────

const getIP = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

// ─── GET /api/roles ───────────────────────────────────────────────────────────

export const getRoles = async (req: Request, res: Response) => {
  try {
    const result = await getAllRoles(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Roles] getRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/roles/parents ───────────────────────────────────────────────────

export const getParentRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getTopLevelRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Roles] getParentRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/roles/:id ───────────────────────────────────────────────────────

export const getRole = async (req: Request, res: Response) => {
  try {
    const { valid, message } = validateIdParam(req.params.id);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const role = await getRoleById(Number(req.params.id));
    if (!role) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    res.json({ success: true, data: role });
  } catch (error) {
    console.error('[Roles] getRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/roles ──────────────────────────────────────────────────────────

export const addRole = async (req: Request, res: Response) => {
  try {
    const { valid, message } = validateCreateRole(req.body);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const { role, parent_role, permissionIds } = req.body;

    const result = await createRole({
      role:          role.trim(),
      parent_role:   parent_role ? String(parent_role) : null,
      permissionIds: permissionIds.join(','),
      ip:            getIP(req),
    });

    if (result.duplicate) {
      res.status(409).json({ success: false, message: 'Role name already exists' });
      return;
    }

    res.status(201).json({ success: true, message: 'Role created successfully', data: result.data });
  } catch (error) {
    console.error('[Roles] addRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /api/roles/:id ───────────────────────────────────────────────────────

export const editRole = async (req: Request, res: Response) => {
  try {
    const idCheck = validateIdParam(req.params.id);
    if (!idCheck.valid) {
      res.status(400).json({ success: false, message: idCheck.message });
      return;
    }

    const bodyCheck = validateUpdateRole(req.body);
    if (!bodyCheck.valid) {
      res.status(400).json({ success: false, message: bodyCheck.message });
      return;
    }

    const id = Number(req.params.id);
    const { role, parent_role, permissionIds } = req.body;

    const payload: any = { ip: getIP(req) };
    if (role          !== undefined) payload.role          = role.trim();
    if (parent_role   !== undefined) payload.parent_role   = parent_role ? String(parent_role) : null;
    if (permissionIds !== undefined) payload.permissionIds = permissionIds.join(',');

    const result = await updateRole(id, payload);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    if ((result as any).protected) {
      res.status(403).json({ success: false, message: 'This role cannot be modified' });
      return;
    }
    if ((result as any).duplicate) {
      res.status(409).json({ success: false, message: 'Role name already exists' });
      return;
    }

    res.json({ success: true, message: 'Role updated successfully', data: (result as any).data });
  } catch (error) {
    console.error('[Roles] editRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── DELETE /api/roles/:id ────────────────────────────────────────────────────

export const removeRole = async (req: Request, res: Response) => {
  try {
    const { valid, message } = validateIdParam(req.params.id);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const id = Number(req.params.id);
    const result = await deleteRole(id, { ip: getIP(req) });

    if (result === null) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    if ((result as any).protected) {
      res.status(403).json({ success: false, message: 'This role cannot be deleted' });
      return;
    }

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('[Roles] removeRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};