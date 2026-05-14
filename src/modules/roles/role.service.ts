// src/modules/roles/role.service.ts

import prisma from '../../config/db';
import { GetRolesQuery, CreateRolePayload, UpdateRolePayload } from './role.types';

const SUPER_ADMIN_ID = 1; // tblroles mein id=1 SuperAdmin — kabhi edit/delete nahi hoga

// ─── Get All Roles (paginated) ────────────────────────────────────────────────

export const getAllRoles = async (query: GetRolesQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (query.search) {
    where.role = { contains: query.search };
  }

  const [roles, total] = await Promise.all([
    prisma.tblroles.findMany({
      where,
      skip,
      take: limit,
      orderBy: { id: 'asc' },
    }),
    prisma.tblroles.count({ where }),
  ]);

  return {
    data: roles,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ─── Get All Roles (flat list for dropdowns) ─────────────────────────────────

export const getAllRolesFlat = async () => {
  return prisma.tblroles.findMany({ orderBy: { id: 'asc' } });
};

// ─── Get Single Role ──────────────────────────────────────────────────────────

export const getRoleById = async (id: number) => {
  return prisma.tblroles.findUnique({ where: { id } });
};

// ─── Create Role ──────────────────────────────────────────────────────────────

export const createRole = async (payload: CreateRolePayload) => {
  const existing = await prisma.tblroles.findFirst({ where: { role: payload.role } });
  if (existing) return { duplicate: true };

  const role = await prisma.tblroles.create({
    data: {
      role:          payload.role,
      parent_role:   payload.parent_role ?? null,
      permissionIds: payload.permissionIds,
    } as any,
  });

  return { duplicate: false, data: role };
};

// ─── Update Role ──────────────────────────────────────────────────────────────

export const updateRole = async (id: number, payload: UpdateRolePayload) => {
  if (id === SUPER_ADMIN_ID) return { protected: true };

  const existing = await prisma.tblroles.findUnique({ where: { id } });
  if (!existing) return null;

  if (payload.role && payload.role !== existing.role) {
    const taken = await prisma.tblroles.findFirst({ where: { role: payload.role } });
    if (taken) return { duplicate: true };
  }

  const updated = await prisma.tblroles.update({
    where: { id },
    data: {
      ...(payload.role          !== undefined ? { role:          payload.role          } : {}),
      ...(payload.parent_role   !== undefined ? { parent_role:   payload.parent_role   } : {}),
      ...(payload.permissionIds !== undefined ? { permissionIds: payload.permissionIds } : {}),
    } as any,
  });

  return { duplicate: false, data: updated };
};

// ─── Delete Role ──────────────────────────────────────────────────────────────

export const deleteRole = async (id: number) => {
  if (id === SUPER_ADMIN_ID) return { protected: true };

  const existing = await prisma.tblroles.findUnique({ where: { id } });
  if (!existing) return null;

  // is role ke sub-roles ka parent_role null kar do
  await prisma.tblroles.updateMany({
    where: { parent_role: String(id) } as any,
    data:  { parent_role: null }       as any,
  });

  await prisma.tblroles.delete({ where: { id } });
  return { deleted: true };
};