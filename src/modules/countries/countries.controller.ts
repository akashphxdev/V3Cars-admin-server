import { Request, Response } from 'express';
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  toggleCountryStatus,
  deleteCountry,
} from './countries.service';

// ─── GET /countries ───────────────────────────────────────────────────────────

export const getCountries = async (req: Request, res: Response) => {
  try {
    const result = await getAllCountries(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Countries] getCountries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /countries/:id ───────────────────────────────────────────────────────

export const getCountry = async (req: Request, res: Response) => {
  try {
    const countryId = Number(req.params.id);

    if (isNaN(countryId)) {
      res.status(400).json({ success: false, message: 'Invalid country ID' });
      return;
    }

    const country = await getCountryById(countryId);

    if (!country) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    res.json({ success: true, data: country });
  } catch (error) {
    console.error('[Countries] getCountry error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /countries ──────────────────────────────────────────────────────────

export const addCountry = async (req: Request, res: Response) => {
  try {
    const { countryName } = req.body;

    if (!countryName) {
      res.status(400).json({ success: false, message: 'countryName is required' });
      return;
    }

    const result = await createCountry(req.body);

    if (result.duplicate) {
      res.status(409).json({
        success: false,
        message: 'Country name already exists',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'Country created successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('[Countries] addCountry error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /countries/:id ───────────────────────────────────────────────────────

export const editCountry = async (req: Request, res: Response) => {
  try {
    const countryId = Number(req.params.id);

    if (isNaN(countryId)) {
      res.status(400).json({ success: false, message: 'Invalid country ID' });
      return;
    }

    const result = await updateCountry(countryId, req.body);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    if ((result as any).duplicate) {
      res.status(409).json({
        success: false,
        message: 'Country name already exists',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Country updated successfully',
      data: (result as any).data,
    });
  } catch (error) {
    console.error('[Countries] editCountry error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PATCH /countries/:id/toggle-status ──────────────────────────────────────

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const countryId = Number(req.params.id);

    if (isNaN(countryId)) {
      res.status(400).json({ success: false, message: 'Invalid country ID' });
      return;
    }

    const country = await toggleCountryStatus(countryId);

    if (!country) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    res.json({
      success: true,
      message: `Country ${country.isActive === 1 ? 'activated' : 'deactivated'} successfully`,
      data: country,
    });
  } catch (error) {
    console.error('[Countries] toggleStatus error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── DELETE /countries/:id ────────────────────────────────────────────────────

export const removeCountry = async (req: Request, res: Response) => {
  try {
    const countryId = Number(req.params.id);

    if (isNaN(countryId)) {
      res.status(400).json({ success: false, message: 'Invalid country ID' });
      return;
    }

    const result = await deleteCountry(countryId);

    if (!result) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }

    res.json({ success: true, message: 'Country deleted successfully' });
  } catch (error) {
    console.error('[Countries] removeCountry error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};