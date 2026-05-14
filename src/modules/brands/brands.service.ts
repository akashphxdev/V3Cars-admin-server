import prisma from '../../config/db';
import { GetBrandsQuery, CreateBrandPayload, UpdateBrandPayload } from './brands.types';

const brandSelect = {
  brandId:              true,
  brandName:            true,
  brandSlug:            true,
  displayName:          true,
  brandTitle:           true,
  brandType:            true,
  brandStatus:          true,
  logoPath:             true,
  iconPath:             true,
  bannerImage:          true,
  bannerImageAltTag:    true,
  brandDescription:     true,
  introContent:         true,
  parentOrganization:   true,
  brandOrganizationName:true,
  websiteName:          true,
  websiteUrl:           true,
  emailAddress:         true,
  founderName:          true,
  brandKeyPeople:       true,
  products:             true,
  customerService:      true,
  roadsideAssistance:   true,
  serviceNetwork:       true,
  stateId:              true,
  cityId:               true,
  isFasttag:            true,
  similarBrand:         true,
  popularity:           true,
  unquieViews:          true,
};

// ─── Get All Brands ───────────────────────────────────────────────────────────

export const getAllBrands = async (query: GetBrandsQuery) => {
  const page  = Number(query.page)  || 1;
  const limit = Number(query.limit) || 10;
  const skip  = (page - 1) * limit;

  const where: any = {};

  if (query.brandStatus !== undefined) {
    where.brandStatus = Number(query.brandStatus);
  }

  if (query.brandType !== undefined) {
    where.brandType = Number(query.brandType);
  }

  if (query.search) {
    where.OR = [
      { brandName:    { contains: query.search } },
      { displayName:  { contains: query.search } },
      { brandSlug:    { contains: query.search } },
    ];
  }

  const [brands, total] = await Promise.all([
    prisma.tblbrands.findMany({
      where,
      select: brandSelect,
      skip,
      take: limit,
      orderBy: { brandId: 'desc' },
    }),
    prisma.tblbrands.count({ where }),
  ]);

  return {
    data: brands,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── Get Single Brand ─────────────────────────────────────────────────────────

export const getBrandById = async (brandId: number) => {
  return prisma.tblbrands.findUnique({
    where: { brandId },
    select: brandSelect,
  });
};

// ─── Create Brand ─────────────────────────────────────────────────────────────

export const createBrand = async (payload: CreateBrandPayload) => {
  // Check duplicate brandName
  const existingName = await prisma.tblbrands.findFirst({
    where: { brandName: payload.brandName },
  });
  if (existingName) return { duplicate: true, field: 'brandName' };

  // Check duplicate brandSlug if provided
  if (payload.brandSlug) {
    const existingSlug = await prisma.tblbrands.findFirst({
      where: { brandSlug: payload.brandSlug },
    });
    if (existingSlug) return { duplicate: true, field: 'brandSlug' };
  }

  const brand = await prisma.tblbrands.create({
    data: { ...payload },
    select: brandSelect,
  });

  return { duplicate: false, data: brand };
};

// ─── Update Brand ─────────────────────────────────────────────────────────────

export const updateBrand = async (brandId: number, payload: UpdateBrandPayload) => {
  const existing = await prisma.tblbrands.findUnique({ where: { brandId } });
  if (!existing) return null;

  // Check duplicate brandName if changing
  if (payload.brandName && payload.brandName !== existing.brandName) {
    const nameTaken = await prisma.tblbrands.findFirst({
      where: { brandName: payload.brandName },
    });
    if (nameTaken) return { duplicate: true, field: 'brandName' };
  }

  // Check duplicate brandSlug if changing
  if (payload.brandSlug && payload.brandSlug !== existing.brandSlug) {
    const slugTaken = await prisma.tblbrands.findFirst({
      where: { brandSlug: payload.brandSlug },
    });
    if (slugTaken) return { duplicate: true, field: 'brandSlug' };
  }

  const updated = await prisma.tblbrands.update({
    where: { brandId },
    data: { ...payload },
    select: brandSelect,
  });

  return { duplicate: false, data: updated };
};

// ─── Toggle Brand Status ──────────────────────────────────────────────────────

export const toggleBrandStatus = async (brandId: number) => {
  const brand = await prisma.tblbrands.findUnique({ where: { brandId } });
  if (!brand) return null;

  const updated = await prisma.tblbrands.update({
    where: { brandId },
    data: { brandStatus: brand.brandStatus === 1 ? 0 : 1 },
    select: brandSelect,
  });

  return updated;
};

// ─── Delete Brand ─────────────────────────────────────────────────────────────

export const deleteBrand = async (brandId: number) => {
  const brand = await prisma.tblbrands.findUnique({ where: { brandId } });
  if (!brand) return null;

  await prisma.tblbrands.delete({ where: { brandId } });
  return true;
};