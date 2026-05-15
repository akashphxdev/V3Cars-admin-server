// src/modules/roles/role.service.ts

import prisma from '../../config/db';
import { GetRolesQuery, CreateRolePayload, UpdateRolePayload, DeleteRolePayload } from './role.types';

// ─── Protected Role IDs ───────────────────────────────────────────────────────
const PROTECTED_IDS = [1, 2]; // 1 = SuperAdmin, 2 = Admin

// ─── Audit Log Helper ─────────────────────────────────────────────────────────

const writeLog = async (action: string, ip: string) => {
  try {
    await (prisma as any).tblauditlogs.create({
      data: { action, ip },
    });
  } catch (err) {
    console.error('[Roles] Audit log error:', err);
  }
};

// ─── Get All Roles (paginated) ────────────────────────────────────────────────

export const getAllRoles = async (query: GetRolesQuery) => {
  const page  = Math.max(Number(query.page)  || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  const where: any = {};
  if (query.search) {
    where.role = { contains: query.search };
  }

  // ─── Step 1: Paginated roles fetch karo ───────────────────────────────────
  const [roles, total] = await Promise.all([
    prisma.tblroles.findMany({ where, skip, take: limit, orderBy: { id: 'desc' } }),
    prisma.tblroles.count({ where }),
  ]);

  if (roles.length === 0) {
    return {
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };
  }

  // ─── Step 2: Saare related role IDs collect karo ─────────────────────────
  const currentIds    = roles.map((r) => r.id);
  const parentIdStrs  = roles.map((r) => r.parent_role).filter(Boolean) as string[];
  const parentIds     = parentIdStrs.map(Number).filter(Boolean);

  // ─── Step 3: Parents + sub-roles ek saath fetch karo ─────────────────────
  const relatedRoles = await prisma.tblroles.findMany({
    where: {
      OR: [
        { id: { in: parentIds } },                          // parents
        { parent_role: { in: currentIds.map(String) } },   // sub-roles
      ],
    } as any,
    select: { id: true, role: true, parent_role: true },
  });

  const relatedMap = new Map(relatedRoles.map((r) => [r.id, r]));

  // ─── Step 4: Permissions fetch karo ──────────────────────────────────────
  const allPermIds = roles.flatMap((r) =>
    r.permissionIds ? r.permissionIds.split(',').map(Number).filter(Boolean) : []
  );
  const uniquePermIds = [...new Set(allPermIds)];

  const permissions = uniquePermIds.length > 0
    ? await (prisma as any).tblpermissions.findMany({
        where:  { id: { in: uniquePermIds } },
        select: { id: true, title: true },
      })
    : [];

  const permMap = new Map(permissions.map((p: any) => [p.id, p.title]));

  // ─── Step 5: Enrich karo ──────────────────────────────────────────────────
  const enriched = roles.map((role) => {
    const parentId   = role.parent_role ? Number(role.parent_role) : null;
    const parentRole = parentId ? relatedMap.get(parentId) ?? null : null;

    const subRoles = relatedRoles
      .filter((r) => r.parent_role === String(role.id))
      .map((r) => ({ id: r.id, role: r.role }));

    const permIds    = role.permissionIds ? role.permissionIds.split(',').map(Number).filter(Boolean) : [];
    const permissionNames = permIds.map((id) => ({
      id,
      title: permMap.get(id) ?? null,
    }));

    return {
      ...role,
      parentRole:       parentRole ? { id: parentRole.id, role: parentRole.role } : null,
      subRoles,
      permissionNames,
    };
  });

  return {
    data: enriched,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};
// ─── Get Only Top-Level Roles (parent dropdown ke liye) ───────────────────────

export const getTopLevelRoles = async () => {
  return prisma.tblroles.findMany({
    where:   { parent_role: null } as any,
    orderBy: { id: 'asc' },
  });
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

  await writeLog(`Created a new role "${payload.role}"`, payload.ip);

  return { duplicate: false, data: role };
};

// ─── Update Role ──────────────────────────────────────────────────────────────

export const updateRole = async (id: number, payload: UpdateRolePayload) => {
  if (PROTECTED_IDS.includes(id)) return { protected: true };

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

  const roleName = payload.role ?? existing.role ?? `ID ${id}`;
  await writeLog(`Updated role "${roleName}"`, payload.ip);

  return { duplicate: false, data: updated };
};

// ─── Delete Role ──────────────────────────────────────────────────────────────

export const deleteRole = async (id: number, payload: DeleteRolePayload) => {
  if (PROTECTED_IDS.includes(id)) return { protected: true };

  const existing = await prisma.tblroles.findUnique({ where: { id } });
  if (!existing) return null;

  await prisma.tblroles.updateMany({
    where: { parent_role: String(id) } as any,
    data:  { parent_role: null }       as any,
  });

  await prisma.tblroles.delete({ where: { id } });

  await writeLog(`Deleted role "${existing.role ?? `ID ${id}`}"`, payload.ip);

  return { deleted: true };
};