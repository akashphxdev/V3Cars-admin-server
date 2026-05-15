// src/modules/models/model.controller.ts

import { Request, Response } from 'express';
import { getModelsByBrandId } from './model.service';

export const getModelsByBrand = async (req: Request, res: Response): Promise<void> => {
  try {
    const brandId = parseInt(req.params.brandId as string, 10);

    if (isNaN(brandId) || brandId <= 0) {
      res.status(400).json({ success: false, message: 'Invalid brand ID' });
      return;
    }

    const models = await getModelsByBrandId(brandId);

    res.status(200).json({
      success: true,
      message: models.length > 0 ? 'Models fetched successfully' : 'No models found for this brand',
      data: models,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message ?? 'Something went wrong' });
  }
};