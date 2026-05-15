// src/brands/controllers/brand.controller.ts

import { Request, Response } from "express";
import { brandService } from "./brands.service";
import { ApiResponse, BrandName } from "./brands.types";

export const brandController = {
  async getAllBrandNames(req: Request, res: Response): Promise<void> {
    try {
      const brands = await brandService.getAllBrandNames();
      const response: ApiResponse<BrandName[]> = { success: true, data: brands };
      res.status(200).json(response);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error?.message });
    }
  },
};