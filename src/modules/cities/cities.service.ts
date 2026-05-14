import prisma from '../../config/db';
import { GetCitiesQuery, CreateCityPayload, UpdateCityPayload } from './cities.types';

const citySelect = {
  cityId:             true,
  cityName:           true,
  stateId:            true,
  countryId:          true,
  status:             true,
  isDefault:          true,
  isPopularCity:      true,
  isTopCity:          true,
  ismajorCityPetrol:  true,
  ismajorCityDiesel:  true,
  ismajorCityCNG:     true,
  isCurrentCity:      true,
  isImage:            true,
};

// ─── Get All Cities ───────────────────────────────────────────────────────────

export const getAllCities = async (query: GetCitiesQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};

  if (query.status !== undefined)      where.status      = Number(query.status);
  if (query.stateId !== undefined)     where.stateId     = Number(query.stateId);
  if (query.countryId !== undefined)   where.countryId   = Number(query.countryId);
  if (query.isPopularCity !== undefined) where.isPopularCity = Number(query.isPopularCity);
  if (query.isTopCity !== undefined)   where.isTopCity   = Number(query.isTopCity);

  if (query.search) {
    where.OR = [
      { cityName: { contains: query.search } },
    ];
  }

  const [cities, total] = await Promise.all([
    prisma.tblcities.findMany({
      where,
      select: citySelect,
      skip,
      take: limit,
      orderBy: { cityId: 'asc' },
    }),
    prisma.tblcities.count({ where }),
  ]);

  return {
    data: cities,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single City ──────────────────────────────────────────────────────────

export const getCityById = async (cityId: number) => {
  return prisma.tblcities.findUnique({
    where: { cityId },
    select: citySelect,
  });
};

// ─── Create City ──────────────────────────────────────────────────────────────

export const createCity = async (payload: CreateCityPayload) => {
  const existing = await prisma.tblcities.findFirst({
    where: {
      cityName: payload.cityName,
      stateId:  payload.stateId,
    },
  });
  if (existing) return { duplicate: true };

  const city = await prisma.tblcities.create({
    data: { ...payload },
    select: citySelect,
  });

  return { duplicate: false, data: city };
};

// ─── Update City ──────────────────────────────────────────────────────────────

export const updateCity = async (cityId: number, payload: UpdateCityPayload) => {
  const existing = await prisma.tblcities.findUnique({ where: { cityId } });
  if (!existing) return null;

  // Duplicate check only if cityName + stateId both changing
  if (payload.cityName) {
    const stateId = payload.stateId ?? existing.stateId;
    const nameTaken = await prisma.tblcities.findFirst({
      where: {
        cityName: payload.cityName,
        stateId:  stateId ?? undefined,
        NOT: { cityId },
      },
    });
    if (nameTaken) return { duplicate: true };
  }

  const updated = await prisma.tblcities.update({
    where: { cityId },
    data: { ...payload },
    select: citySelect,
  });

  return { duplicate: false, data: updated };
};

// ─── Toggle Status ────────────────────────────────────────────────────────────

export const toggleCityStatus = async (cityId: number) => {
  const city = await prisma.tblcities.findUnique({ where: { cityId } });
  if (!city) return null;

  return prisma.tblcities.update({
    where: { cityId },
    data: { status: city.status === 1 ? 0 : 1 },
    select: citySelect,
  });
};

// ─── Delete City ──────────────────────────────────────────────────────────────

export const deleteCity = async (cityId: number) => {
  const city = await prisma.tblcities.findUnique({ where: { cityId } });
  if (!city) return null;

  await prisma.tblcities.delete({ where: { cityId } });
  return true;
};