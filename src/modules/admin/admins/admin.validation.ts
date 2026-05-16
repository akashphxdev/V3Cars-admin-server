// src/modules/admin/admin.validation.ts

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
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

// ─── Validate GET /admins Query ───────────────────────────────────────────────

export const validateGetAdmins = (query: any): ValidationResult => {
  const { page, limit, search, status } = query;

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

  if (status !== undefined) {
    if (!['Active', 'Inactive'].includes(status)) {
      return { valid: false, message: 'status must be Active or Inactive' };
    }
  }

  return { valid: true };
};

// ─── Validate POST /admins Body ───────────────────────────────────────────────

export const validateCreateAdmin = (body: any): ValidationResult => {
  const {
    adminUserName,
    adminPassword,
    adminName,
    adminEmailId,
    adminType,
    adminSubType,
    status,
    accessBrands,
    accessStartDate,
    accessEndDate,
    maxRows,
  } = body;

  // ── adminUserName (required) ──
  if (!adminUserName) {
    return { valid: false, message: 'adminUserName is required' };
  }
  if (typeof adminUserName !== 'string' || adminUserName.trim().length === 0) {
    return { valid: false, message: 'adminUserName must be a non-empty string' };
  }
  if (adminUserName.trim().length < 3) {
    return { valid: false, message: 'adminUserName must be at least 3 characters' };
  }
  if (adminUserName.trim().length > 50) {
    return { valid: false, message: 'adminUserName cannot exceed 50 characters' };
  }
  if (!/^[a-zA-Z0-9_]+$/.test(adminUserName.trim())) {
    return { valid: false, message: 'adminUserName can only contain letters, numbers, and underscores' };
  }

  // ── adminPassword (required) ──
  if (!adminPassword) {
    return { valid: false, message: 'adminPassword is required' };
  }
  if (typeof adminPassword !== 'string' || adminPassword.length < 6) {
    return { valid: false, message: 'adminPassword must be at least 6 characters' };
  }
  if (adminPassword.length > 100) {
    return { valid: false, message: 'adminPassword cannot exceed 100 characters' };
  }

  // ── adminName (required) ──
  if (!adminName) {
    return { valid: false, message: 'adminName is required' };
  }
  if (typeof adminName !== 'string' || adminName.trim().length === 0) {
    return { valid: false, message: 'adminName must be a non-empty string' };
  }
  if (adminName.trim().length < 2) {
    return { valid: false, message: 'adminName must be at least 2 characters' };
  }
  if (adminName.trim().length > 100) {
    return { valid: false, message: 'adminName cannot exceed 100 characters' };
  }

  // ── adminEmailId (required) ──
  if (!adminEmailId) {
    return { valid: false, message: 'adminEmailId is required' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(adminEmailId)) {
    return { valid: false, message: 'adminEmailId must be a valid email address' };
  }
  if (adminEmailId.length > 150) {
    return { valid: false, message: 'adminEmailId cannot exceed 150 characters' };
  }

  // ── adminType (required) ──
  if (adminType === undefined || adminType === null || adminType === '') {
    return { valid: false, message: 'adminType is required' };
  }
  const type = Number(adminType);
  if (!Number.isInteger(type) || type <= 0) {
    return { valid: false, message: 'adminType must be a positive integer' };
  }

  // ── adminSubType (optional) ──
  if (adminSubType !== undefined) {
    const subType = Number(adminSubType);
    if (!Number.isInteger(subType) || subType <= 0) {
      return { valid: false, message: 'adminSubType must be a positive integer' };
    }
  }

  // ── status (optional) ──
  if (status !== undefined) {
    if (!['Active', 'Inactive'].includes(status)) {
      return { valid: false, message: 'status must be Active or Inactive' };
    }
  }

  // ── accessBrands (optional) ──
  if (accessBrands !== undefined) {
    if (typeof accessBrands !== 'string' || accessBrands.trim().length === 0) {
      return { valid: false, message: 'accessBrands must be a non-empty string' };
    }
  }

  // ── accessStartDate (optional) ──
  if (accessStartDate !== undefined) {
    const d = new Date(accessStartDate);
    if (isNaN(d.getTime())) {
      return { valid: false, message: 'accessStartDate must be a valid date (YYYY-MM-DD)' };
    }
  }

  // ── accessEndDate (optional) ──
  if (accessEndDate !== undefined) {
    const d = new Date(accessEndDate);
    if (isNaN(d.getTime())) {
      return { valid: false, message: 'accessEndDate must be a valid date (YYYY-MM-DD)' };
    }
    if (accessStartDate !== undefined) {
      const start = new Date(accessStartDate);
      if (d <= start) {
        return { valid: false, message: 'accessEndDate must be after accessStartDate' };
      }
    }
  }

  // ── maxRows (optional) ──
  if (maxRows !== undefined) {
    const rows = Number(maxRows);
    if (!Number.isInteger(rows) || rows < 1) {
      return { valid: false, message: 'maxRows must be a positive integer' };
    }
    if (rows > 1000) {
      return { valid: false, message: 'maxRows cannot exceed 1000' };
    }
  }

  return { valid: true };
};

// ─── Validate PUT /admins/:id Body ────────────────────────────────────────────

export const validateUpdateAdmin = (body: any): ValidationResult => {
  if (!body || Object.keys(body).length === 0) {
    return { valid: false, message: 'Request body cannot be empty' };
  }

  const {
    adminUserName,
    adminPassword,
    adminName,
    adminEmailId,
    adminType,
    adminSubType,
    status,
    accessBrands,
    accessStartDate,
    accessEndDate,
    maxRows,
    isLock,
  } = body;

  // ── adminUserName (optional) ──
  if (adminUserName !== undefined) {
    if (typeof adminUserName !== 'string' || adminUserName.trim().length === 0) {
      return { valid: false, message: 'adminUserName must be a non-empty string' };
    }
    if (adminUserName.trim().length < 3) {
      return { valid: false, message: 'adminUserName must be at least 3 characters' };
    }
    if (adminUserName.trim().length > 50) {
      return { valid: false, message: 'adminUserName cannot exceed 50 characters' };
    }
    if (!/^[a-zA-Z0-9_]+$/.test(adminUserName.trim())) {
      return { valid: false, message: 'adminUserName can only contain letters, numbers, and underscores' };
    }
  }

  // ── adminPassword (optional) ──
  if (adminPassword !== undefined) {
    if (typeof adminPassword !== 'string' || adminPassword.length < 6) {
      return { valid: false, message: 'adminPassword must be at least 6 characters' };
    }
    if (adminPassword.length > 100) {
      return { valid: false, message: 'adminPassword cannot exceed 100 characters' };
    }
  }

  // ── adminName (optional) ──
  if (adminName !== undefined) {
    if (typeof adminName !== 'string' || adminName.trim().length === 0) {
      return { valid: false, message: 'adminName must be a non-empty string' };
    }
    if (adminName.trim().length < 2) {
      return { valid: false, message: 'adminName must be at least 2 characters' };
    }
    if (adminName.trim().length > 100) {
      return { valid: false, message: 'adminName cannot exceed 100 characters' };
    }
  }

  // ── adminEmailId (optional) ──
  if (adminEmailId !== undefined) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminEmailId)) {
      return { valid: false, message: 'adminEmailId must be a valid email address' };
    }
    if (adminEmailId.length > 150) {
      return { valid: false, message: 'adminEmailId cannot exceed 150 characters' };
    }
  }

  // ── adminType (optional) ──
  if (adminType !== undefined) {
    const type = Number(adminType);
    if (!Number.isInteger(type) || type <= 0) {
      return { valid: false, message: 'adminType must be a positive integer' };
    }
  }

  // ── adminSubType (optional) ──
  if (adminSubType !== undefined) {
    const subType = Number(adminSubType);
    if (!Number.isInteger(subType) || subType <= 0) {
      return { valid: false, message: 'adminSubType must be a positive integer' };
    }
  }

  // ── status (optional) ──
  if (status !== undefined) {
    if (!['Active', 'Inactive'].includes(status)) {
      return { valid: false, message: 'status must be Active or Inactive' };
    }
  }

  // ── accessBrands (optional) ──
  if (accessBrands !== undefined) {
    if (typeof accessBrands !== 'string' || accessBrands.trim().length === 0) {
      return { valid: false, message: 'accessBrands must be a non-empty string' };
    }
  }

  // ── accessStartDate (optional) ──
  if (accessStartDate !== undefined) {
    const d = new Date(accessStartDate);
    if (isNaN(d.getTime())) {
      return { valid: false, message: 'accessStartDate must be a valid date (YYYY-MM-DD)' };
    }
  }

  // ── accessEndDate (optional) ──
  if (accessEndDate !== undefined) {
    const d = new Date(accessEndDate);
    if (isNaN(d.getTime())) {
      return { valid: false, message: 'accessEndDate must be a valid date (YYYY-MM-DD)' };
    }
    if (accessStartDate !== undefined) {
      const start = new Date(accessStartDate);
      if (d <= start) {
        return { valid: false, message: 'accessEndDate must be after accessStartDate' };
      }
    }
  }

  // ── maxRows (optional) ──
  if (maxRows !== undefined) {
    const rows = Number(maxRows);
    if (!Number.isInteger(rows) || rows < 1) {
      return { valid: false, message: 'maxRows must be a positive integer' };
    }
    if (rows > 1000) {
      return { valid: false, message: 'maxRows cannot exceed 1000' };
    }
  }

  // ── isLock (optional) ──
  if (isLock !== undefined) {
    if (![0, 1].includes(Number(isLock))) {
      return { valid: false, message: 'isLock must be 0 or 1' };
    }
  }

  return { valid: true };
};

// ─── Validate POST /admins/custom-role Body ───────────────────────────────────

export const validateCreateCustomRole = (body: any): ValidationResult => {
  const { adminUserName, permissionIds } = body;

  // ── adminUserName (required) ──
  if (!adminUserName) {
    return { valid: false, message: 'adminUserName is required' };
  }
  if (typeof adminUserName !== 'string' || adminUserName.trim().length === 0) {
    return { valid: false, message: 'adminUserName must be a non-empty string' };
  }

  // ── permissionIds (required) ──
  if (!permissionIds) {
    return { valid: false, message: 'permissionIds is required' };
  }
  if (!Array.isArray(permissionIds)) {
    return { valid: false, message: 'permissionIds must be an array' };
  }
  if (permissionIds.length === 0) {
    return { valid: false, message: 'permissionIds cannot be empty' };
  }
  for (const id of permissionIds) {
    const n = Number(id);
    if (!Number.isInteger(n) || n <= 0) {
      return { valid: false, message: `permissionIds must contain only positive integers, got: ${id}` };
    }
  }

  return { valid: true };
};