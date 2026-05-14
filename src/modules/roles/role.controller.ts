// src/modules/roles/role.controller.ts

import { Request, Response } from 'express';
import {
  getAllRoles,
  getAllRolesFlat,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from './role.service';

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

// ─── GET /api/roles/all ───────────────────────────────────────────────────────
// Dropdown ke liye flat list

export const getRolesFlat = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRolesFlat();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Roles] getRolesFlat error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/roles/:id ───────────────────────────────────────────────────────

export const getRole = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid role ID' });
      return;
    }
    const role = await getRoleById(id);
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
    const { role, parent_role, permissionIds } = req.body;

    if (!role || !role.trim()) {
      res.status(400).json({ success: false, message: 'Role name is required' });
      return;
    }
    if (!permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
      res.status(400).json({ success: false, message: 'At least one permission is required' });
      return;
    }

    const result = await createRole({
      role:          role.trim(),
      parent_role:   parent_role ? String(parent_role) : null,
      permissionIds: permissionIds.join(','),
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
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid role ID' });
      return;
    }

    const { role, parent_role, permissionIds } = req.body;

    const payload: any = {};
    if (role          !== undefined) payload.role          = role.trim();
    if (parent_role   !== undefined) payload.parent_role   = parent_role ? String(parent_role) : null;
    if (permissionIds !== undefined) {
      if (!Array.isArray(permissionIds) || permissionIds.length === 0) {
        res.status(400).json({ success: false, message: 'At least one permission is required' });
        return;
      }
      payload.permissionIds = permissionIds.join(',');
    }

    const result = await updateRole(id, payload);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    if ((result as any).protected) {
      res.status(403).json({ success: false, message: 'SuperAdmin role cannot be modified' });
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
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ success: false, message: 'Invalid role ID' });
      return;
    }

    const result = await deleteRole(id);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Role not found' });
      return;
    }
    if ((result as any).protected) {
      res.status(403).json({ success: false, message: 'SuperAdmin role cannot be deleted' });
      return;
    }

    res.json({ success: true, message: 'Role deleted successfully' });
  } catch (error) {
    console.error('[Roles] removeRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};