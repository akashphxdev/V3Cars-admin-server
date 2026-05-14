// src/modules/admin/admin.service.ts

import prisma from '../../config/db';
import { GetAdminsQuery, CreateAdminPayload, UpdateAdminPayload } from './admin.types';
import crypto from 'crypto';

const hashPassword = (password: string): string =>
  crypto.createHash('md5').update(password).digest('hex');

const adminSelect = {
  adminId:            true,
  adminUserName:      true,
  adminName:          true,
  adminEmailId:       true,
  adminType:          true,
  adminSubType:       true,
  status:             true,
  accessBrands:       true,
  accessStartDate:    true,
  accessEndDate:      true,
  lastLoginDateTime:  true,
  lastLoginIPAddress: true,
  maxRows:            true,
  isLock:             true,
  addedDateTime:      true,
  addedBy:            true,
};

// ─── Get All Admins ───────────────────────────────────────────────────────────

export const getAllAdmins = async (query: GetAdminsQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (query.status) where.status = query.status;
  if (query.search) {
    where.OR = [
      { adminName:     { contains: query.search } },
      { adminEmailId:  { contains: query.search } },
      { adminUserName: { contains: query.search } },
    ];
  }

  const [admins, total] = await Promise.all([
    prisma.tbladmins.findMany({
      where,
      select: adminSelect,
      skip,
      take: limit,
      orderBy: { adminId: 'desc' },
    }),
    prisma.tbladmins.count({ where }),
  ]);

  return {
    data: admins,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ─── Get Single Admin ─────────────────────────────────────────────────────────

export const getAdminById = async (adminId: number) => {
  return prisma.tbladmins.findUnique({
    where: { adminId },
    select: adminSelect,
  });
};

// ─── Create Admin ─────────────────────────────────────────────────────────────

export const createAdmin = async (payload: CreateAdminPayload) => {
  const {
    adminUserName,
    adminPassword,
    adminName,
    adminEmailId,
    adminType,
    adminSubType,
    status = 'Active',
    accessBrands,
    accessStartDate,
    accessEndDate,
    maxRows = 10,
    addedBy,
  } = payload;

  const existingEmail = await prisma.tbladmins.findFirst({ where: { adminEmailId } });
  if (existingEmail) return { duplicate: true, field: 'email' };

  const existingUsername = await prisma.tbladmins.findFirst({ where: { adminUserName } });
  if (existingUsername) return { duplicate: true, field: 'username' };

  const admin = await prisma.tbladmins.create({
    data: {
      adminUserName,
      adminPassword: hashPassword(adminPassword),
      adminName,
      adminEmailId,
      adminType,
      adminSubType,
      status,
      accessBrands,
      accessStartDate: accessStartDate ? new Date(accessStartDate) : null,
      accessEndDate:   accessEndDate   ? new Date(accessEndDate)   : null,
      maxRows,
      addedBy,
      addedDateTime: new Date(),
    },
    select: adminSelect,
  });

  return { duplicate: false, data: admin };
};

// ─── Update Admin ─────────────────────────────────────────────────────────────

export const updateAdmin = async (adminId: number, payload: UpdateAdminPayload) => {
  const existing = await prisma.tbladmins.findUnique({ where: { adminId } });
  if (!existing) return null;

  if (payload.adminEmailId && payload.adminEmailId !== existing.adminEmailId) {
    const emailTaken = await prisma.tbladmins.findFirst({ where: { adminEmailId: payload.adminEmailId } });
    if (emailTaken) return { duplicate: true, field: 'email' };
  }

  if (payload.adminUserName && payload.adminUserName !== existing.adminUserName) {
    const usernameTaken = await prisma.tbladmins.findFirst({ where: { adminUserName: payload.adminUserName } });
    if (usernameTaken) return { duplicate: true, field: 'username' };
  }

  const { adminPassword, ...rest } = payload;

  const updated = await prisma.tbladmins.update({
    where: { adminId },
    data: {
      ...rest,
      ...(adminPassword ? { adminPassword: hashPassword(adminPassword) } : {}),
      accessStartDate: rest.accessStartDate ? new Date(rest.accessStartDate) : undefined,
      accessEndDate:   rest.accessEndDate   ? new Date(rest.accessEndDate)   : undefined,
    },
    select: adminSelect,
  });

  return { duplicate: false, data: updated };
};

// ─── Toggle Lock ──────────────────────────────────────────────────────────────

export const toggleAdminLock = async (adminId: number) => {
  const admin = await prisma.tbladmins.findUnique({ where: { adminId } });
  if (!admin) return null;

  return prisma.tbladmins.update({
    where: { adminId },
    data: { isLock: admin.isLock === 1 ? 0 : 1 },
    select: adminSelect,
  });
};

// ─── Get All Permissions ──────────────────────────────────────────────────────

export const getAllPermissions = async () => {
  return prisma.tblpermissions.findMany({ orderBy: { id: 'asc' } });
};

// ─── Get All Roles ────────────────────────────────────────────────────────────

export const getAllRoles = async () => {
  return prisma.tblroles.findMany({ orderBy: { id: 'asc' } });
};

// ─── Get Sub Roles by Parent ──────────────────────────────────────────────────
// parent_role column mein parent ka id (as string) store hai

export const getSubRolesByParent = async (parentId: number) => {
  return prisma.tblroles.findMany({
  where: { parent_role: String(parentId) } as any,
  orderBy: { id: 'asc' },
});
};

// ─── Get Permissions by Role ID ───────────────────────────────────────────────

export const getPermissionsByRole = async (roleId: number) => {
  const role = await prisma.tblroles.findUnique({ where: { id: roleId } });
  if (!role || !role.permissionIds) return [];

  const ids = role.permissionIds.split(',').map(Number).filter(Boolean);
  return prisma.tblpermissions.findMany({
    where: { id: { in: ids } },
    orderBy: { id: 'asc' },
  });
};

// ─── Create Custom Role ───────────────────────────────────────────────────────
// adminUserName_custom format

export const createCustomRole = async (adminUserName: string, permissionIds: number[]) => {
  const roleName = `${adminUserName}_custom`;
  const permissionIdsStr = permissionIds.join(',');

  const existing = await prisma.tblroles.findFirst({ where: { role: roleName } });

  if (existing) {
    return prisma.tblroles.update({
      where: { id: existing.id },
      data: { permissionIds: permissionIdsStr },
    });
  }

  return prisma.tblroles.create({
    data: { role: roleName, permissionIds: permissionIdsStr },
  });
};