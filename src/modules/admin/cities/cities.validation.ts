// src/modules/cities/cities.validation.ts

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

// ─── Validate GET /cities Query ───────────────────────────────────────────────

export const validateGetCities = (query: any): ValidationResult => {
  const { page, limit, search, status, stateId, countryId, isPopularCity, isTopCity } = query;

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
    if (!['0', '1', 0, 1].includes(status)) {
      return { valid: false, message: 'status must be 0 or 1' };
    }
  }

  if (stateId !== undefined) {
    const s = Number(stateId);
    if (!Number.isInteger(s) || s <= 0) {
      return { valid: false, message: 'stateId must be a positive integer' };
    }
  }

  if (countryId !== undefined) {
    const c = Number(countryId);
    if (!Number.isInteger(c) || c <= 0) {
      return { valid: false, message: 'countryId must be a positive integer' };
    }
  }

  if (isPopularCity !== undefined) {
    if (!['0', '1', 0, 1].includes(isPopularCity)) {
      return { valid: false, message: 'isPopularCity must be 0 or 1' };
    }
  }

  if (isTopCity !== undefined) {
    if (!['0', '1', 0, 1].includes(isTopCity)) {
      return { valid: false, message: 'isTopCity must be 0 or 1' };
    }
  }

  return { valid: true };
};

// ─── Validate POST /cities Body ───────────────────────────────────────────────

export const validateCreateCity = (body: any): ValidationResult => {
  const {
    cityName,
    stateId,
    countryId,
    status,
    isDefault,
    isPopularCity,
    isTopCity,
    ismajorCityPetrol,
    ismajorCityDiesel,
    ismajorCityCNG,
    isCurrentCity,
    isImage,
  } = body;

  // ── cityName (required) ──
  if (!cityName) {
    return { valid: false, message: 'cityName is required' };
  }
  if (typeof cityName !== 'string' || cityName.trim().length === 0) {
    return { valid: false, message: 'cityName must be a non-empty string' };
  }
  if (cityName.trim().length < 2) {
    return { valid: false, message: 'cityName must be at least 2 characters' };
  }
  if (cityName.trim().length > 100) {
    return { valid: false, message: 'cityName cannot exceed 100 characters' };
  }
  if (!/^[a-zA-Z\s\-'().]+$/.test(cityName.trim())) {
    return { valid: false, message: 'cityName can only contain letters, spaces, hyphens, apostrophes, and parentheses' };
  }

  // ── stateId (optional) ──
  if (stateId !== undefined) {
    const s = Number(stateId);
    if (!Number.isInteger(s) || s <= 0) {
      return { valid: false, message: 'stateId must be a positive integer' };
    }
  }

  // ── countryId (optional) ──
  if (countryId !== undefined) {
    const c = Number(countryId);
    if (!Number.isInteger(c) || c <= 0) {
      return { valid: false, message: 'countryId must be a positive integer' };
    }
  }

  // ── status (optional) ──
  if (status !== undefined) {
    if (![0, 1].includes(Number(status))) {
      return { valid: false, message: 'status must be 0 or 1' };
    }
  }

  // ── isDefault (optional) ──
  if (isDefault !== undefined) {
    if (![0, 1].includes(Number(isDefault))) {
      return { valid: false, message: 'isDefault must be 0 or 1' };
    }
  }

  // ── isPopularCity (optional) ──
  if (isPopularCity !== undefined) {
    if (![0, 1].includes(Number(isPopularCity))) {
      return { valid: false, message: 'isPopularCity must be 0 or 1' };
    }
  }

  // ── isTopCity (optional) ──
  if (isTopCity !== undefined) {
    if (![0, 1].includes(Number(isTopCity))) {
      return { valid: false, message: 'isTopCity must be 0 or 1' };
    }
  }

  // ── ismajorCityPetrol (optional) ──
  if (ismajorCityPetrol !== undefined) {
    if (![0, 1].includes(Number(ismajorCityPetrol))) {
      return { valid: false, message: 'ismajorCityPetrol must be 0 or 1' };
    }
  }

  // ── ismajorCityDiesel (optional) ──
  if (ismajorCityDiesel !== undefined) {
    if (![0, 1].includes(Number(ismajorCityDiesel))) {
      return { valid: false, message: 'ismajorCityDiesel must be 0 or 1' };
    }
  }

  // ── ismajorCityCNG (optional) ──
  if (ismajorCityCNG !== undefined) {
    if (![0, 1].includes(Number(ismajorCityCNG))) {
      return { valid: false, message: 'ismajorCityCNG must be 0 or 1' };
    }
  }

  // ── isCurrentCity (optional) ──
  if (isCurrentCity !== undefined) {
    if (![0, 1].includes(Number(isCurrentCity))) {
      return { valid: false, message: 'isCurrentCity must be 0 or 1' };
    }
  }

  // ── isImage (optional) ──
  if (isImage !== undefined) {
    if (typeof isImage !== 'string' || isImage.trim().length === 0) {
      return { valid: false, message: 'isImage must be a non-empty string' };
    }
    if (isImage.trim().length > 255) {
      return { valid: false, message: 'isImage cannot exceed 255 characters' };
    }
  }

  return { valid: true };
};

// ─── Validate PUT /cities/:id Body ───────────────────────────────────────────

export const validateUpdateCity = (body: any): ValidationResult => {
  if (!body || Object.keys(body).length === 0) {
    return { valid: false, message: 'Request body cannot be empty' };
  }

  const {
    cityName,
    stateId,
    countryId,
    status,
    isDefault,
    isPopularCity,
    isTopCity,
    ismajorCityPetrol,
    ismajorCityDiesel,
    ismajorCityCNG,
    isCurrentCity,
    isImage,
  } = body;

  // ── cityName (optional in update) ──
  if (cityName !== undefined) {
    if (typeof cityName !== 'string' || cityName.trim().length === 0) {
      return { valid: false, message: 'cityName must be a non-empty string' };
    }
    if (cityName.trim().length < 2) {
      return { valid: false, message: 'cityName must be at least 2 characters' };
    }
    if (cityName.trim().length > 100) {
      return { valid: false, message: 'cityName cannot exceed 100 characters' };
    }
    if (!/^[a-zA-Z\s\-'().]+$/.test(cityName.trim())) {
      return { valid: false, message: 'cityName can only contain letters, spaces, hyphens, apostrophes, and parentheses' };
    }
  }

  // ── stateId (optional) ──
  if (stateId !== undefined) {
    const s = Number(stateId);
    if (!Number.isInteger(s) || s <= 0) {
      return { valid: false, message: 'stateId must be a positive integer' };
    }
  }

  // ── countryId (optional) ──
  if (countryId !== undefined) {
    const c = Number(countryId);
    if (!Number.isInteger(c) || c <= 0) {
      return { valid: false, message: 'countryId must be a positive integer' };
    }
  }

  // ── status (optional) ──
  if (status !== undefined) {
    if (![0, 1].includes(Number(status))) {
      return { valid: false, message: 'status must be 0 or 1' };
    }
  }

  // ── isDefault (optional) ──
  if (isDefault !== undefined) {
    if (![0, 1].includes(Number(isDefault))) {
      return { valid: false, message: 'isDefault must be 0 or 1' };
    }
  }

  // ── isPopularCity (optional) ──
  if (isPopularCity !== undefined) {
    if (![0, 1].includes(Number(isPopularCity))) {
      return { valid: false, message: 'isPopularCity must be 0 or 1' };
    }
  }

  // ── isTopCity (optional) ──
  if (isTopCity !== undefined) {
    if (![0, 1].includes(Number(isTopCity))) {
      return { valid: false, message: 'isTopCity must be 0 or 1' };
    }
  }

  // ── ismajorCityPetrol (optional) ──
  if (ismajorCityPetrol !== undefined) {
    if (![0, 1].includes(Number(ismajorCityPetrol))) {
      return { valid: false, message: 'ismajorCityPetrol must be 0 or 1' };
    }
  }

  // ── ismajorCityDiesel (optional) ──
  if (ismajorCityDiesel !== undefined) {
    if (![0, 1].includes(Number(ismajorCityDiesel))) {
      return { valid: false, message: 'ismajorCityDiesel must be 0 or 1' };
    }
  }

  // ── ismajorCityCNG (optional) ──
  if (ismajorCityCNG !== undefined) {
    if (![0, 1].includes(Number(ismajorCityCNG))) {
      return { valid: false, message: 'ismajorCityCNG must be 0 or 1' };
    }
  }

  // ── isCurrentCity (optional) ──
  if (isCurrentCity !== undefined) {
    if (![0, 1].includes(Number(isCurrentCity))) {
      return { valid: false, message: 'isCurrentCity must be 0 or 1' };
    }
  }

  // ── isImage (optional) ──
  if (isImage !== undefined) {
    if (typeof isImage !== 'string' || isImage.trim().length === 0) {
      return { valid: false, message: 'isImage must be a non-empty string' };
    }
    if (isImage.trim().length > 255) {
      return { valid: false, message: 'isImage cannot exceed 255 characters' };
    }
  }

  return { valid: true };
};