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

// ─── GET /api/admin/admins ───────────────────────────────────────────────────

export const getAdmins = async (req: Request, res: Response) => {
  try {
    const result = await getAllAdmins(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Admin] getAdmins error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/admin/admins/:id ────────────────────────────────────────────────

export const getAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);
    if (isNaN(adminId)) {
      res.status(400).json({ success: false, message: 'Invalid admin ID' });
      return;
    }
    const admin = await getAdminById(adminId);
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

// ─── POST /api/admin/admins ───────────────────────────────────────────────────

export const addAdmin = async (req: Request, res: Response) => {
  try {
    const {
      adminUserName, adminPassword, adminName, adminEmailId,
      adminType, adminSubType, status, accessBrands,
      accessStartDate, accessEndDate, maxRows,
    } = req.body;

    if (!adminUserName || !adminPassword || !adminName || !adminEmailId || adminType === undefined) {
      res.status(400).json({
        success: false,
        message: 'adminUserName, adminPassword, adminName, adminEmailId and adminType are required',
      });
      return;
    }

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

// ─── PUT /api/admin/admins/:id ────────────────────────────────────────────────

export const editAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);
    if (isNaN(adminId)) {
      res.status(400).json({ success: false, message: 'Invalid admin ID' });
      return;
    }

    const result = await updateAdmin(adminId, req.body);
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

// ─── PATCH /api/admin/admins/:id/toggle-lock ──────────────────────────────────

export const lockUnlockAdmin = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);
    if (isNaN(adminId)) {
      res.status(400).json({ success: false, message: 'Invalid admin ID' });
      return;
    }
    const admin = await toggleAdminLock(adminId);
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

// ─── GET /api/admin/admins/permissions ───────────────────────────────────────

export const getPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('[Admin] getPermissions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/admin/admins/roles ─────────────────────────────────────────────

export const getRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Admin] getRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/admin/admins/sub-roles/:parentId ───────────────────────────────

export const getSubRoles = async (req: Request, res: Response) => {
  try {
    const parentId = Number(req.params.parentId);
    if (isNaN(parentId)) {
      res.status(400).json({ success: false, message: 'Invalid parent ID' });
      return;
    }
    const roles = await getSubRolesByParent(parentId);
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('[Admin] getSubRoles error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/admin/admins/role-permissions/:roleId ──────────────────────────

export const getRolePerms = async (req: Request, res: Response) => {
  try {
    const roleId = Number(req.params.roleId);
    if (isNaN(roleId)) {
      res.status(400).json({ success: false, message: 'Invalid role ID' });
      return;
    }
    const permissions = await getPermissionsByRole(roleId);
    res.json({ success: true, data: permissions });
  } catch (error) {
    console.error('[Admin] getRolePerms error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/admin/admins/custom-role ──────────────────────────────────────

export const createCustomRoleController = async (req: Request, res: Response) => {
  try {
    const { adminUserName, permissionIds } = req.body;

    if (!adminUserName || !permissionIds || !Array.isArray(permissionIds) || permissionIds.length === 0) {
      res.status(400).json({
        success: false,
        message: 'adminUserName and permissionIds (non-empty array) are required',
      });
      return;
    }

    const role = await createCustomRole(adminUserName, permissionIds);
    res.status(201).json({ success: true, data: role });
  } catch (error) {
    console.error('[Admin] createCustomRole error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};