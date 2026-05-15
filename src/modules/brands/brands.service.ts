// src/brands/services/brand.service.ts

import { PrismaClient } from "@prisma/client";
import { BrandName } from "./brands.types";

const prisma = new PrismaClient();

export const brandService = {
  async getAllBrandNames(): Promise<BrandName[]> {
    const brands = await prisma.tblbrands.findMany({
      where: { brandStatus: 1 },
      select: {
        brandId: true,
        brandName: true,
      },
      orderBy: { brandName: "asc" },
    });
    return brands;
  },
};