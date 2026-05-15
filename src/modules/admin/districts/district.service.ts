// src/modules/districts/district.service.ts

import prisma from '@/config/db';
import { GetDistrictsQuery, UpdateDistrictPayload } from './district.types';

// ─── Audit Log Helper ─────────────────────────────────────────────────────────

const writeLog = async (action: string, ip: string) => {
  try {
    await (prisma as any).tblauditlogs.create({
      data: { action, ip },
    });
  } catch (err) {
    console.error('[Districts] Audit log error:', err);
  }
};

// ─── Get All Districts (paginated + filters) ──────────────────────────────────

export const getAllDistricts = async (query: GetDistrictsQuery) => {
  const page  = Math.max(Number(query.page)  || 1, 1);
  const limit = Math.min(Number(query.limit) || 10, 100);
  const skip  = (page - 1) * limit;

  const where: any = {};

  // Search by district name
  if (query.search) {
    where.districtName = { contains: query.search };
  }

  // Filter by stateId
  if (query.stateId) {
    where.stateId = Number(query.stateId);
  }

  // Filter by specific districtId
  if (query.districtId) {
    where.id = Number(query.districtId);
  }

  // ─── Step 1: Districts fetch karo ─────────────────────────────────────────
  const [districts, total] = await Promise.all([
    prisma.tbldistricts.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { districtName: 'asc' },
    }),
    prisma.tbldistricts.count({ where }),
  ]);

  if (districts.length === 0) {
    return {
      data:       [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };
  }

  // ─── Step 2: State names fetch karo ───────────────────────────────────────
  const stateIds = [...new Set(districts.map((d) => d.stateId).filter(Boolean))] as number[];

  const states = stateIds.length > 0
    ? await prisma.tblstates.findMany({
        where:  { stateId: { in: stateIds } },
        select: { stateId: true, stateName: true },
      })
    : [];

  const stateMap = new Map(states.map((s) => [s.stateId, s.stateName]));

  // ─── Step 3: Enrich karo ──────────────────────────────────────────────────
  const enriched = districts.map((district) => ({
    ...district,
    stateName: district.stateId ? (stateMap.get(district.stateId) ?? null) : null,
  }));

  return {
    data:       enriched,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

// ─── Update District ──────────────────────────────────────────────────────────

export const updateDistrict = async (id: number, payload: UpdateDistrictPayload) => {
  const existing = await prisma.tbldistricts.findUnique({ where: { id } });
  if (!existing) return null;

  // Sirf jo fields aaye woh update karo
  const data: any = {};
  if (payload.ismajorCityPetrol !== undefined) data.ismajorCityPetrol = payload.ismajorCityPetrol;
  if (payload.ismajorCityDiesel !== undefined) data.ismajorCityDiesel = payload.ismajorCityDiesel;
  if (payload.ismajorCityCNG    !== undefined) data.ismajorCityCNG    = payload.ismajorCityCNG;
  if (payload.isPopularCity     !== undefined) data.isPopularCity     = payload.isPopularCity;

  const updated = await prisma.tbldistricts.update({
    where: { id },
    data,
  });

  await writeLog(`Updated district "${existing.districtName ?? `ID ${id}`}"`, payload.ip);

  return { data: updated };
};