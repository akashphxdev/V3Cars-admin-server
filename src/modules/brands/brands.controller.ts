import { Request, Response } from 'express';
import {
  getAllBrands,
  getBrandById,
  createBrand,
  updateBrand,
  toggleBrandStatus,
  deleteBrand,
} from './brands.service';

// ─── GET /api/brands ──────────────────────────────────────────────────────────

export const getBrands = async (req: Request, res: Response) => {
  try {
    const result = await getAllBrands(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Brands] getBrands error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /api/brands/:id ──────────────────────────────────────────────────────

export const getBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    if (isNaN(brandId)) {
      res.status(400).json({ success: false, message: 'Invalid brand ID' });
      return;
    }

    const brand = await getBrandById(brandId);

    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error('[Brands] getBrand error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /api/brands ─────────────────────────────────────────────────────────

export const addBrand = async (req: Request, res: Response) => {
  try {
    const { brandName } = req.body;

    if (!brandName) {
      res.status(400).json({ success: false, message: 'brandName is required' });
      return;
    }

    const result = await createBrand(req.body);

    if (result.duplicate) {
      res.status(409).json({
        success: false,
        message: `${result.field === 'brandName' ? 'Brand name' : 'Brand slug'} already exists`,
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Brand created successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('[Brands] addBrand error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /api/brands/:id ──────────────────────────────────────────────────────

export const editBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    if (isNaN(brandId)) {
      res.status(400).json({ success: false, message: 'Invalid brand ID' });
      return;
    }

    const result = await updateBrand(brandId, req.body);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    if ((result as any).duplicate) {
      res.status(409).json({
        success: false,
        message: `${(result as any).field === 'brandName' ? 'Brand name' : 'Brand slug'} already exists`,
      });
      return;
    }

    res.json({
      success: true,
      message: 'Brand updated successfully',
      data: (result as any).data,
    });
  } catch (error) {
    console.error('[Brands] editBrand error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PATCH /api/brands/:id/toggle-status ─────────────────────────────────────

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    if (isNaN(brandId)) {
      res.status(400).json({ success: false, message: 'Invalid brand ID' });
      return;
    }

    const brand = await toggleBrandStatus(brandId);

    if (!brand) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    res.json({
      success: true,
      message: `Brand ${brand.brandStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      data: brand,
    });
  } catch (error) {
    console.error('[Brands] toggleStatus error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── DELETE /api/brands/:id ───────────────────────────────────────────────────

export const removeBrand = async (req: Request, res: Response) => {
  try {
    const brandId = Number(req.params.id);

    if (isNaN(brandId)) {
      res.status(400).json({ success: false, message: 'Invalid brand ID' });
      return;
    }

    const result = await deleteBrand(brandId);

    if (!result) {
      res.status(404).json({ success: false, message: 'Brand not found' });
      return;
    }

    res.json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    console.error('[Brands] removeBrand error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};