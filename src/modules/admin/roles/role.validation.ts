// src/modules/roles/role.validation.ts

export interface ValidationResult {
  valid:   boolean;
  message: string;
}

// ─── Create Role Validation ───────────────────────────────────────────────────

export const validateCreateRole = (body: any): ValidationResult => {
  const { role, permissionIds } = body;

  if (!role || typeof role !== 'string' || !role.trim()) {
    return { valid: false, message: 'Role name is required' };
  }
  if (role.trim().length < 2) {
    return { valid: false, message: 'Role name must be at least 2 characters' };
  }
  if (role.trim().length > 100) {
    return { valid: false, message: 'Role name must not exceed 100 characters' };
  }
  if (!/^[a-zA-Z0-9\s_-]+$/.test(role.trim())) {
    return { valid: false, message: 'Role name can only contain letters, numbers, spaces, underscores and hyphens' };
  }

  if (!permissionIds) {
    return { valid: false, message: 'At least one permission is required' };
  }
  if (!Array.isArray(permissionIds)) {
    return { valid: false, message: 'permissionIds must be an array' };
  }
  if (permissionIds.length === 0) {
    return { valid: false, message: 'At least one permission is required' };
  }
  if (permissionIds.some((p: any) => isNaN(Number(p)))) {
    return { valid: false, message: 'All permission IDs must be valid numbers' };
  }

  return { valid: true, message: '' };
};

// ─── Update Role Validation ───────────────────────────────────────────────────

export const validateUpdateRole = (body: any): ValidationResult => {
  const { role, permissionIds } = body;

  if (role !== undefined) {
    if (typeof role !== 'string' || !role.trim()) {
      return { valid: false, message: 'Role name cannot be empty' };
    }
    if (role.trim().length < 2) {
      return { valid: false, message: 'Role name must be at least 2 characters' };
    }
    if (role.trim().length > 100) {
      return { valid: false, message: 'Role name must not exceed 100 characters' };
    }
    if (!/^[a-zA-Z0-9\s_-]+$/.test(role.trim())) {
      return { valid: false, message: 'Role name can only contain letters, numbers, spaces, underscores and hyphens' };
    }
  }

  if (permissionIds !== undefined) {
    if (!Array.isArray(permissionIds)) {
      return { valid: false, message: 'permissionIds must be an array' };
    }
    if (permissionIds.length === 0) {
      return { valid: false, message: 'At least one permission is required' };
    }
    if (permissionIds.some((p: any) => isNaN(Number(p)))) {
      return { valid: false, message: 'All permission IDs must be valid numbers' };
    }
  }

  if (role === undefined && permissionIds === undefined && body.parent_role === undefined) {
    return { valid: false, message: 'At least one field is required to update' };
  }

  return { valid: true, message: '' };
};

// ─── ID Param Validation ──────────────────────────────────────────────────────

export const validateIdParam = (id: any): ValidationResult => {
  const numId = Number(id);
  if (!id || isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
    return { valid: false, message: 'Invalid role ID' };
  }
  return { valid: true, message: '' };
};