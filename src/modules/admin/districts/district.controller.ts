// src/modules/districts/district.controller.ts

import { Request, Response } from 'express';
import { getAllDistricts, updateDistrict } from './district.service';
import { validateIdParam, validateUpdateDistrict } from './district.validation';

// ─── IP Helper ────────────────────────────────────────────────────────────────

const getIP = (req: Request): string => {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
};

// ─── GET /api/districts ───────────────────────────────────────────────────────

export const getDistricts = async (req: Request, res: Response) => {
  try {
    const result = await getAllDistricts(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[Districts] getDistricts error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /api/districts/:id ───────────────────────────────────────────────────

export const editDistrict = async (req: Request, res: Response) => {
  try {
    // ID validate karo
    const idCheck = validateIdParam(req.params.id);
    if (!idCheck.valid) {
      res.status(400).json({ success: false, message: idCheck.message });
      return;
    }

    // Body validate karo
    const bodyCheck = validateUpdateDistrict(req.body);
    if (!bodyCheck.valid) {
      res.status(400).json({ success: false, message: bodyCheck.message });
      return;
    }

    const id = Number(req.params.id);
    const { ismajorCityPetrol, ismajorCityDiesel, ismajorCityCNG, isPopularCity } = req.body;

    const payload: any = { ip: getIP(req) };
    if (ismajorCityPetrol !== undefined) payload.ismajorCityPetrol = Number(ismajorCityPetrol);
    if (ismajorCityDiesel !== undefined) payload.ismajorCityDiesel = Number(ismajorCityDiesel);
    if (ismajorCityCNG    !== undefined) payload.ismajorCityCNG    = Number(ismajorCityCNG);
    if (isPopularCity     !== undefined) payload.isPopularCity     = Number(isPopularCity);

    const result = await updateDistrict(id, payload);

    if (result === null) {
      res.status(404).json({ success: false, message: 'District not found' });
      return;
    }

    res.json({ success: true, message: 'District updated successfully', data: result.data });
  } catch (error) {
    console.error('[Districts] editDistrict error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};