import { Request, Response } from 'express';
import {
  getAllCities,
  getCityById,
  createCity,
  updateCity,
  toggleCityStatus,
  deleteCity,
} from './cities.service';

// ─── GET /cities ──────────────────────────────────────────────────────────────

export const getCities = async (req: Request, res: Response) => {
  try {
    const result = await getAllCities(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Cities] getCities error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /cities/:id ──────────────────────────────────────────────────────────

export const getCity = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);

    if (isNaN(cityId)) {
      res.status(400).json({ success: false, message: 'Invalid city ID' });
      return;
    }

    const city = await getCityById(cityId);

    if (!city) {
      res.status(404).json({ success: false, message: 'City not found' });
      return;
    }

    res.json({ success: true, data: city });
  } catch (error) {
    console.error('[Cities] getCity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /cities ─────────────────────────────────────────────────────────────

export const addCity = async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      res.status(400).json({ success: false, message: 'cityName is required' });
      return;
    }

    const result = await createCity(req.body);

    if (result.duplicate) {
      res.status(409).json({
        success: false,
        message: 'City already exists in this state',
      });
      return;
    }

    res.status(201).json({
      success: true,
      message: 'City created successfully',
      data: result.data,
    });
  } catch (error) {
    console.error('[Cities] addCity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /cities/:id ──────────────────────────────────────────────────────────

export const editCity = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);

    if (isNaN(cityId)) {
      res.status(400).json({ success: false, message: 'Invalid city ID' });
      return;
    }

    const result = await updateCity(cityId, req.body);

    if (result === null) {
      res.status(404).json({ success: false, message: 'City not found' });
      return;
    }

    if ((result as any).duplicate) {
      res.status(409).json({
        success: false,
        message: 'City already exists in this state',
      });
      return;
    }

    res.json({
      success: true,
      message: 'City updated successfully',
      data: (result as any).data,
    });
  } catch (error) {
    console.error('[Cities] editCity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PATCH /cities/:id/toggle-status ─────────────────────────────────────────

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);

    if (isNaN(cityId)) {
      res.status(400).json({ success: false, message: 'Invalid city ID' });
      return;
    }

    const city = await toggleCityStatus(cityId);

    if (!city) {
      res.status(404).json({ success: false, message: 'City not found' });
      return;
    }

    res.json({
      success: true,
      message: `City ${city.status === 1 ? 'activated' : 'deactivated'} successfully`,
      data: city,
    });
  } catch (error) {
    console.error('[Cities] toggleStatus error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── DELETE /cities/:id ───────────────────────────────────────────────────────

export const removeCity = async (req: Request, res: Response) => {
  try {
    const cityId = Number(req.params.id);

    if (isNaN(cityId)) {
      res.status(400).json({ success: false, message: 'Invalid city ID' });
      return;
    }

    const result = await deleteCity(cityId);

    if (!result) {
      res.status(404).json({ success: false, message: 'City not found' });
      return;
    }

    res.json({ success: true, message: 'City deleted successfully' });
  } catch (error) {
    console.error('[Cities] removeCity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};