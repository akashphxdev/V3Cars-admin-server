// src/modules/admin/apiManagement/apiManagement.service.ts

import prisma                                            from '@/config/db';
import { GetApisQuery, CreateApiPayload, UpdateApiPayload } from '@/modules/admin/apiManagement/apiManagement.types';


const apiSelect = {
  apiId:           true,
  apiName:         true,
  apiDesc:         true,
  apiStatus:       true,
  createdBy:       true,
  createdDateTime: true,
  brandId:         true,
  modelIds:        true,
  lmsApiUrl:       true,
};

// ─── Get All APIs ─────────────────────────────────────────────────────────────

export const getAllApis = async (query: GetApisQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};

  if (query.apiStatus !== undefined) {
    where.apiStatus = Number(query.apiStatus);
  }

  if (query.brandId !== undefined) {
    where.brandId = Number(query.brandId);
  }

  if (query.search) {
    where.OR = [
      { apiName: { contains: query.search } },
      { apiDesc: { contains: query.search } },
    ];
  }

  const [apis, total] = await Promise.all([
    prisma.tblclientapi.findMany({
      where,
      select:  apiSelect,
      skip,
      take:    limit,
      orderBy: { apiId: 'desc' },
    }),
    prisma.tblclientapi.count({ where }),
  ]);

  // ── Enrich with brandName ──────────────────────────────────────────────────
  const brandIds = [...new Set(apis.map(a => a.brandId).filter(Boolean))] as number[];

  const brands = brandIds.length > 0
    ? await prisma.tblbrands.findMany({
        where:  { brandId: { in: brandIds } },
        select: { brandId: true, brandName: true },
      })
    : [];

  const brandMap = new Map(brands.map(b => [b.brandId, b.brandName]));

  return {
    data: apis.map(api => ({
      ...api,
      brandName: api.brandId ? (brandMap.get(api.brandId) ?? null) : null,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single API ───────────────────────────────────────────────────────────

export const getApiById = async (apiId: number) => {
  const api = await prisma.tblclientapi.findUnique({
    where:  { apiId },
    select: apiSelect,
  });

  if (!api) return null;

  // ── Enrich with brandName ──────────────────────────────────────────────────
  let brandName = null;
  if (api.brandId) {
    const brand = await prisma.tblbrands.findUnique({
      where:  { brandId: api.brandId },
      select: { brandName: true },
    });
    brandName = brand?.brandName ?? null;
  }

  // ── Enrich with modelNames ─────────────────────────────────────────────────
  let modelNames: { modelId: number; modelName: string | null }[] = [];
  if (api.modelIds) {
    const ids = api.modelIds.split(',').map(Number).filter(Boolean);
    if (ids.length > 0) {
      const models = await prisma.tblmodels.findMany({
        where:  { modelId: { in: ids } },
        select: { modelId: true, modelName: true },
      });
      modelNames = models;
    }
  }

  return { ...api, brandName, modelNames };
};

// ─── Create API ───────────────────────────────────────────────────────────────

export const createApi = async (payload: CreateApiPayload) => {
  const {
    apiName,
    apiDesc,
    apiStatus = 0,
    brandId,
    modelIds,
    lmsApiUrl,
    createdBy,
  } = payload;

  return prisma.tblclientapi.create({
    data: {
      apiName,
      apiDesc,
      apiStatus,
      brandId:         brandId   ?? null,
      modelIds:        modelIds  ?? null,
      lmsApiUrl:       lmsApiUrl ?? null,
      createdBy:       createdBy ? String(createdBy) : null,
      createdDateTime: new Date(),
    },
    select: apiSelect,
  });
};

// ─── Update API ───────────────────────────────────────────────────────────────

export const updateApi = async (apiId: number, payload: UpdateApiPayload) => {
  const existing = await prisma.tblclientapi.findUnique({ where: { apiId } });
  if (!existing) return null;

  return prisma.tblclientapi.update({
    where: { apiId },
    data: {
      ...(payload.apiName   !== undefined ? { apiName:   payload.apiName                } : {}),
      ...(payload.apiDesc   !== undefined ? { apiDesc:   payload.apiDesc                } : {}),
      ...(payload.apiStatus !== undefined ? { apiStatus: Number(payload.apiStatus)       } : {}),
      ...(payload.brandId   !== undefined ? { brandId:   payload.brandId                } : {}),
      ...(payload.modelIds  !== undefined ? { modelIds:  payload.modelIds               } : {}),
      ...(payload.lmsApiUrl !== undefined ? { lmsApiUrl: payload.lmsApiUrl              } : {}),
    },
    select: apiSelect,
  });
};

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const toggleApiStatus = async (apiId: number) => {
  const existing = await prisma.tblclientapi.findUnique({ where: { apiId } });
  if (!existing) return null;

  return prisma.tblclientapi.update({
    where:  { apiId },
    data:   { apiStatus: existing.apiStatus === 1 ? 0 : 1 },
    select: apiSelect,
  });
};