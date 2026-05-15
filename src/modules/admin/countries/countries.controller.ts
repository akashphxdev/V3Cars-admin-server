// src/modules/countries/countries.controller.ts

import { Request, Response } from 'express';
import {
  getAllCountries,
  getCountryById,
  createCountry,
  updateCountry,
  toggleCountryStatus,
  deleteCountry,
} from './countries.service';
import {
  validateIdParam,
  validateGetCountries,
  validateCreateCountry,
  validateUpdateCountry,
} from './countries.validation';

// ─── GET /countries ───────────────────────────────────────────────────────────

export const getCountries = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valid, message } = validateGetCountries(req.query);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const result = await getAllCountries(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Countries] getCountries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /countries/:id ───────────────────────────────────────────────────────

export const getCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valid, message } = validateIdParam(req.params.id);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const country = await getCountryById(Number(req.params.id));
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

export const addCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valid, message } = validateCreateCountry(req.body);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const result = await createCountry(req.body);

    if (result.duplicate) {
      res.status(409).json({ success: false, message: 'Country name already exists' });
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

export const editCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const idCheck = validateIdParam(req.params.id);
    if (!idCheck.valid) {
      res.status(400).json({ success: false, message: idCheck.message });
      return;
    }

    const bodyCheck = validateUpdateCountry(req.body);
    if (!bodyCheck.valid) {
      res.status(400).json({ success: false, message: bodyCheck.message });
      return;
    }

    const result = await updateCountry(Number(req.params.id), req.body);

    if (result === null) {
      res.status(404).json({ success: false, message: 'Country not found' });
      return;
    }
    if ((result as any).duplicate) {
      res.status(409).json({ success: false, message: 'Country name already exists' });
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

export const toggleStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valid, message } = validateIdParam(req.params.id);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const country = await toggleCountryStatus(Number(req.params.id));
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

export const removeCountry = async (req: Request, res: Response): Promise<void> => {
  try {
    const { valid, message } = validateIdParam(req.params.id);
    if (!valid) {
      res.status(400).json({ success: false, message });
      return;
    }

    const result = await deleteCountry(Number(req.params.id));
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