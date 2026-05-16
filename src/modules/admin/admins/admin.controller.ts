// src/modules/admin/admin.controller.ts

import { Request, Response } from 'express';
import {
  getAllAdmins,
  getAdminById,
  createAdmin,
  updateAdmin,
  toggleAdminLock,
  getAllPermissions,
  getAllRoles,
  getSubRolesByParent,
  getPermissionsByRole,
  createCustomRole,
} from './admin.service';
import {
  validateIdParam,
  validateGetAdmins,
  validateCreateAdmin,
  validateUpdateAdmin,
  validateCreateCustomRole,
} from './admin.validation';

// ─── GET /admins ──────────────────────────────────────────────────────────────

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const validation = validateGetAdmins(req.query);
    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const result = await getAllAdmins(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] getAdmins error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admins/:id ──────────────────────────────────────────────────────────

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const admin = await getAdminById(Number(req.params.id));
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({ success: true, data: admin });
  } catch (error) {
    console.error('[Admin] getAdmin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /admins ─────────────────────────────────────────────────────────────

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const validation = validateCreateAdmin(req.body);
    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const {
      adminUserName, adminPassword, adminName, adminEmailId,
      adminType, adminSubType, status, accessBrands,
      accessStartDate, accessEndDate, maxRows,
    } = req.body;

    const result = await createAdmin({
      adminUserName, adminPassword, adminName, adminEmailId,
      adminType, adminSubType, status, accessBrands,
      accessStartDate, accessEndDate, maxRows,
      addedBy: (req as any).admin?.adminId,
    });

    if (result.duplicate) {
      res.status(409).json({
        success: false,
        message: `${result.field === 'email' ? 'Email' : 'Username'} already exists`,
      });
      return;
    }

    res.status(201).json({ success: true, message: 'Admin created successfully', data: result.data });
  } catch (error) {
    console.error('[Admin] addAdmin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /admins/:id ──────────────────────────────────────────────────────────

export const editAdmin = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const bodyValidation = validateUpdateAdmin(req.body);
    if (!bodyValidation.valid) {
      res.status(400).json({ success: false, message: bodyValidation.message });
      return;
    }

    const result = await updateAdmin(Number(req.params.id), req.body);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }
    if ((result as any).duplicate) {
      res.status(409).json({
        success: false,
        message: `${(result as any).field === 'email' ? 'Email' : 'Username'} already exists`,
      });
      return;
    }

    res.json({ success: true, message: 'Admin updated successfully', data: (result as any).data });
  } catch (error) {
    console.error('[Admin] editAdmin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PATCH /admins/:id/toggle-lock ───────────────────────────────────────────

export const lockUnlockAdmin = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const admin = await toggleAdminLock(Number(req.params.id));
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' });
      return;
    }

    res.json({
      success: true,
      message: `Admin ${admin.isLock === 1 ? 'locked' : 'unlocked'} successfully`,
      data: admin,
    });
  } catch (error) {
    console.error('[Admin] lockUnlockAdmin error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admins/permissions ──────────────────────────────────────────────────

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('[Admin] getPermissions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admins/roles ────────────────────────────────────────────────────────

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Admin] getRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admins/sub-roles/:parentId ─────────────────────────────────────────

export const getSubRoles = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.parentId);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: `parentId: ${idValidation.message}` });
      return;
    }

    const roles = await getSubRolesByParent(Number(req.params.parentId));
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Admin] getSubRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admins/role-permissions/:roleId ────────────────────────────────────

export const getRolePerms = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.roleId);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: `roleId: ${idValidation.message}` });
      return;
    }

    const permissions = await getPermissionsByRole(Number(req.params.roleId));
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('[Admin] getRolePerms error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /admins/custom-role ─────────────────────────────────────────────────

export const createCustomRoleController = async (req: Request, res: Response) => {
  try {
    const validation = validateCreateCustomRole(req.body);
    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const { adminUserName, permissionIds } = req.body;
    const role = await createCustomRole(adminUserName, permissionIds);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    console.error('[Admin] createCustomRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};