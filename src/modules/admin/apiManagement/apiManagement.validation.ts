// src/modules/admin/apiManagement/apiManagement.validation.ts

interface ValidationResult {
  valid:    boolean;
  message?: string;
}

// ─── Validate ID Param ────────────────────────────────────────────────────────

export const validateIdParam = (id: any): ValidationResult => {
  if (id === undefined || id === null || id === '') {
    return { valid: false, message: 'ID is required' };
  }
  const parsed = Number(id);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return { valid: false, message: 'ID must be a positive integer' };
  }
  return { valid: true };
};

// ─── Validate GET Query ───────────────────────────────────────────────────────

export const validateGetApis = (query: any): ValidationResult => {
  const { page, limit, search, apiStatus, brandId } = query;

  if (page !== undefined) {
    const p = Number(page);
    if (!Number.isInteger(p) || p < 1) {
      return { valid: false, message: 'page must be a positive integer' };
    }
  }

  if (limit !== undefined) {
    const l = Number(limit);
    if (!Number.isInteger(l) || l < 1) {
      return { valid: false, message: 'limit must be a positive integer' };
    }
    if (l > 100) {
      return { valid: false, message: 'limit cannot exceed 100' };
    }
  }

  if (search !== undefined) {
    if (typeof search !== 'string' || search.trim().length === 0) {
      return { valid: false, message: 'search must be a non-empty string' };
    }
    if (search.trim().length < 2) {
      return { valid: false, message: 'search must be at least 2 characters' };
    }
    if (search.trim().length > 100) {
      return { valid: false, message: 'search cannot exceed 100 characters' };
    }
  }

  if (apiStatus !== undefined) {
    if (![0, 1, '0', '1'].includes(apiStatus)) {
      return { valid: false, message: 'apiStatus must be 0 or 1' };
    }
  }

  if (brandId !== undefined) {
    const b = Number(brandId);
    if (!Number.isInteger(b) || b <= 0) {
      return { valid: false, message: 'brandId must be a positive integer' };
    }
  }

  return { valid: true };
};

// ─── Validate POST Body ───────────────────────────────────────────────────────

export const validateCreateApi = (body: any): ValidationResult => {
  const { apiName, apiDesc, apiStatus, brandId, modelIds, lmsApiUrl } = body;

  // ── apiName (required) ──
  if (!apiName) {
    return { valid: false, message: 'apiName is required' };
  }
  if (typeof apiName !== 'string' || apiName.trim().length === 0) {
    return { valid: false, message: 'apiName must be a non-empty string' };
  }
  if (apiName.trim().length < 2) {
    return { valid: false, message: 'apiName must be at least 2 characters' };
  }
  if (apiName.trim().length > 55) {
    return { valid: false, message: 'apiName cannot exceed 55 characters' };
  }

  // ── apiDesc (optional) ──
  if (apiDesc !== undefined) {
    if (typeof apiDesc !== 'string' || apiDesc.trim().length === 0) {
      return { valid: false, message: 'apiDesc must be a non-empty string' };
    }
    if (apiDesc.trim().length > 1000) {
      return { valid: false, message: 'apiDesc cannot exceed 1000 characters' };
    }
  }

  // ── apiStatus (optional) ──
  if (apiStatus !== undefined) {
    if (![0, 1].includes(Number(apiStatus))) {
      return { valid: false, message: 'apiStatus must be 0 or 1' };
    }
  }

  // ── brandId (optional) ──
  if (brandId !== undefined) {
    const b = Number(brandId);
    if (!Number.isInteger(b) || b <= 0) {
      return { valid: false, message: 'brandId must be a positive integer' };
    }
  }

  // ── modelIds (optional) ──
  if (modelIds !== undefined) {
    if (typeof modelIds !== 'string' || modelIds.trim().length === 0) {
      return { valid: false, message: 'modelIds must be a non-empty string' };
    }
    const ids = modelIds.split(',').map((id: string) => id.trim());
    const allValid = ids.every((id: string) => {
      const n = Number(id);
      return Number.isInteger(n) && n > 0;
    });
    if (!allValid) {
      return { valid: false, message: 'modelIds must be comma-separated positive integers (e.g. "1,2,3")' };
    }
    if (modelIds.length > 1000) {
      return { valid: false, message: 'modelIds cannot exceed 1000 characters' };
    }
  }

  // ── lmsApiUrl (optional) ──
  if (lmsApiUrl !== undefined) {
    if (typeof lmsApiUrl !== 'string' || lmsApiUrl.trim().length === 0) {
      return { valid: false, message: 'lmsApiUrl must be a non-empty string' };
    }
    if (lmsApiUrl.trim().length > 255) {
      return { valid: false, message: 'lmsApiUrl cannot exceed 255 characters' };
    }
    try {
      new URL(lmsApiUrl.trim());
    } catch {
      return { valid: false, message: 'lmsApiUrl must be a valid URL' };
    }
  }

  return { valid: true };
};

// ─── Validate PUT Body ────────────────────────────────────────────────────────

export const validateUpdateApi = (body: any): ValidationResult => {
  if (!body || Object.keys(body).length === 0) {
    return { valid: false, message: 'Request body cannot be empty' };
  }

  const { apiName, apiDesc, apiStatus, brandId, modelIds, lmsApiUrl } = body;

  // ── apiName (optional) ──
  if (apiName !== undefined) {
    if (typeof apiName !== 'string' || apiName.trim().length === 0) {
      return { valid: false, message: 'apiName must be a non-empty string' };
    }
    if (apiName.trim().length < 2) {
      return { valid: false, message: 'apiName must be at least 2 characters' };
    }
    if (apiName.trim().length > 55) {
      return { valid: false, message: 'apiName cannot exceed 55 characters' };
    }
  }

  // ── apiDesc (optional) ──
  if (apiDesc !== undefined) {
    if (typeof apiDesc !== 'string' || apiDesc.trim().length === 0) {
      return { valid: false, message: 'apiDesc must be a non-empty string' };
    }
    if (apiDesc.trim().length > 1000) {
      return { valid: false, message: 'apiDesc cannot exceed 1000 characters' };
    }
  }

  // ── apiStatus (optional) ──
  if (apiStatus !== undefined) {
    if (![0, 1].includes(Number(apiStatus))) {
      return { valid: false, message: 'apiStatus must be 0 or 1' };
    }
  }

  // ── brandId (optional) ──
  if (brandId !== undefined) {
    const b = Number(brandId);
    if (!Number.isInteger(b) || b <= 0) {
      return { valid: false, message: 'brandId must be a positive integer' };
    }
  }

  // ── modelIds (optional) ──
  if (modelIds !== undefined) {
    if (typeof modelIds !== 'string' || modelIds.trim().length === 0) {
      return { valid: false, message: 'modelIds must be a non-empty string' };
    }
    const ids = modelIds.split(',').map((id: string) => id.trim());
    const allValid = ids.every((id: string) => {
      const n = Number(id);
      return Number.isInteger(n) && n > 0;
    });
    if (!allValid) {
      return { valid: false, message: 'modelIds must be comma-separated positive integers (e.g. "1,2,3")' };
    }
    if (modelIds.length > 1000) {
      return { valid: false, message: 'modelIds cannot exceed 1000 characters' };
    }
  }

  // ── lmsApiUrl (optional) ──
  if (lmsApiUrl !== undefined) {
    if (typeof lmsApiUrl !== 'string' || lmsApiUrl.trim().length === 0) {
      return { valid: false, message: 'lmsApiUrl must be a non-empty string' };
    }
    if (lmsApiUrl.trim().length > 255) {
      return { valid: false, message: 'lmsApiUrl cannot exceed 255 characters' };
    }
    try {
      new URL(lmsApiUrl.trim());
    } catch {
      return { valid: false, message: 'lmsApiUrl must be a valid URL' };
    }
  }

  return { valid: true };
};