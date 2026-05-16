// src/modules/admin/apiManagement/apiManagement.controller.ts

import { Request, Response }                              from 'express';
import { getAllApis, getApiById, createApi, updateApi, toggleApiStatus } from '@/modules/admin/apiManagement/apiManagement.service';
import { validateIdParam, validateGetApis, validateCreateApi, validateUpdateApi } from '@/modules/admin/apiManagement/apiManagement.validation';

// ─── GET /admin/v1/api-management ────────────────────────────────────────────

export const getApis = async (req: Request, res: Response) => {
  try {
    const validation = validateGetApis(req.query);
    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const result = await getAllApis(req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('[ApiManagement] getApis error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── GET /admin/v1/api-management/:id ────────────────────────────────────────

export const getApi = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const api = await getApiById(Number(req.params.id));
    if (!api) {
      res.status(404).json({ success: false, message: 'API not found' });
      return;
    }

    res.json({ success: true, data: api });
  } catch (error) {
    console.error('[ApiManagement] getApi error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── POST /admin/v1/api-management ───────────────────────────────────────────

export const addApi = async (req: Request, res: Response) => {
  try {
    const validation = validateCreateApi(req.body);
    if (!validation.valid) {
      res.status(400).json({ success: false, message: validation.message });
      return;
    }

    const { apiName, apiDesc, apiStatus, brandId, modelIds, lmsApiUrl } = req.body;

    const api = await createApi({
      apiName,
      apiDesc,
      apiStatus,
      brandId,
      modelIds,
      lmsApiUrl,
      createdBy: (req as any).admin?.adminId,
    });

    res.status(201).json({ success: true, message: 'API created successfully', data: api });
  } catch (error) {
    console.error('[ApiManagement] addApi error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PUT /admin/v1/api-management/:id ────────────────────────────────────────

export const editApi = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const bodyValidation = validateUpdateApi(req.body);
    if (!bodyValidation.valid) {
      res.status(400).json({ success: false, message: bodyValidation.message });
      return;
    }

    const result = await updateApi(Number(req.params.id), req.body);
    if (!result) {
      res.status(404).json({ success: false, message: 'API not found' });
      return;
    }

    res.json({ success: true, message: 'API updated successfully', data: result });
  } catch (error) {
    console.error('[ApiManagement] editApi error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// ─── PATCH /admin/v1/api-management/:id/toggle-status ────────────────────────

export const toggleStatus = async (req: Request, res: Response) => {
  try {
    const idValidation = validateIdParam(req.params.id);
    if (!idValidation.valid) {
      res.status(400).json({ success: false, message: idValidation.message });
      return;
    }

    const result = await toggleApiStatus(Number(req.params.id));
    if (!result) {
      res.status(404).json({ success: false, message: 'API not found' });
      return;
    }

    res.json({
      success: true,
      message: `API ${result.apiStatus === 1 ? 'activated' : 'deactivated'} successfully`,
      data:    result,
    });
  } catch (error) {
    console.error('[ApiManagement] toggleStatus error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};