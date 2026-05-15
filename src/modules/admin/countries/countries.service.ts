import prisma from '@/config/db';
import { GetCountriesQuery, CreateCountryPayload, UpdateCountryPayload } from './countries.types';

const countrySelect = {
  countryId:            true,
  countryName:          true,
  pincodeLength:        true,
  countryCurrency:      true,
  currencySymbol:       true,
  distanceCalcOption:   true,
  currencyRate:         true,
  fuelUnitOption:       true,
  isActive:             true,
  exchangeCurrencyRate: true,
  countryCode:          true,
};

// ─── Get All Countries ────────────────────────────────────────────────────────

export const getAllCountries = async (query: GetCountriesQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};

  if (query.isActive !== undefined) {
    where.isActive = Number(query.isActive);
  }

  if (query.search) {
    where.OR = [
      { countryName:    { contains: query.search } },
      { countryCode:    { contains: query.search } },
      { countryCurrency:{ contains: query.search } },
    ];
  }

  const [countries, total] = await Promise.all([
    prisma.tblcountries.findMany({
      where,
      select: countrySelect,
      skip,
      take: limit,
      orderBy: { countryId: 'asc' },
    }),
    prisma.tblcountries.count({ where }),
  ]);

  return {
    data: countries,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single Country ───────────────────────────────────────────────────────

export const getCountryById = async (countryId: number) => {
  return prisma.tblcountries.findUnique({
    where: { countryId },
    select: countrySelect,
  });
};

// ─── Create Country ───────────────────────────────────────────────────────────

export const createCountry = async (payload: CreateCountryPayload) => {
  // Check duplicate countryName
  const existing = await prisma.tblcountries.findFirst({
    where: { countryName: payload.countryName },
  });
  if (existing) return { duplicate: true, field: 'countryName' };

  const country = await prisma.tblcountries.create({
    data: { ...payload },
    select: countrySelect,
  });

  return { duplicate: false, data: country };
};

// ─── Update Country ───────────────────────────────────────────────────────────

export const updateCountry = async (countryId: number, payload: UpdateCountryPayload) => {
  const existing = await prisma.tblcountries.findUnique({ where: { countryId } });
  if (!existing) return null;

  // Check duplicate countryName if changing
  if (payload.countryName && payload.countryName !== existing.countryName) {
    const nameTaken = await prisma.tblcountries.findFirst({
      where: { countryName: payload.countryName },
    });
    if (nameTaken) return { duplicate: true, field: 'countryName' };
  }

  const updated = await prisma.tblcountries.update({
    where: { countryId },
    data: { ...payload },
    select: countrySelect,
  });

  return { duplicate: false, data: updated };
};

// ─── Toggle Active Status ─────────────────────────────────────────────────────

export const toggleCountryStatus = async (countryId: number) => {
  const country = await prisma.tblcountries.findUnique({ where: { countryId } });
  if (!country) return null;

  const updated = await prisma.tblcountries.update({
    where: { countryId },
    data: { isActive: country.isActive === 1 ? 0 : 1 },
    select: countrySelect,
  });

  return updated;
};

// ─── Delete Country ───────────────────────────────────────────────────────────

export const deleteCountry = async (countryId: number) => {
  const country = await prisma.tblcountries.findUnique({ where: { countryId } });
  if (!country) return null;

  await prisma.tblcountries.delete({ where: { countryId } });
  return true;
};