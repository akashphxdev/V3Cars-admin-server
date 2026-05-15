// src/brands/types/brand.types.ts

export interface BrandName {
  brandId: number;
  brandName: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}