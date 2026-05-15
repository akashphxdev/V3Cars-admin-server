// src/modules/countries/countries.validation.ts

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValidationResult {
  valid: boolean;
  message?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isPositiveFloat = (val: any): boolean =>
  !isNaN(parseFloat(val)) && isFinite(val) && parseFloat(val) > 0;

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

// ─── Validate GET /countries Query ───────────────────────────────────────────

export const validateGetCountries = (query: any): ValidationResult => {
  const { page, limit, search, isActive } = query;

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

  if (isActive !== undefined) {
    if (!['0', '1', 0, 1].includes(isActive)) {
      return { valid: false, message: 'isActive must be 0 or 1' };
    }
  }

  return { valid: true };
};

// ─── Validate POST /countries Body ───────────────────────────────────────────

export const validateCreateCountry = (body: any): ValidationResult => {
  const {
    countryName,
    pincodeLength,
    countryCurrency,
    currencySymbol,
    distanceCalcOption,
    currencyRate,
    fuelUnitOption,
    isActive,
    exchangeCurrencyRate,
    countryCode,
  } = body;

  // ── countryName (required) ──
  if (!countryName) {
    return { valid: false, message: 'countryName is required' };
  }
  if (typeof countryName !== 'string' || countryName.trim().length === 0) {
    return { valid: false, message: 'countryName must be a non-empty string' };
  }
  if (countryName.trim().length < 2) {
    return { valid: false, message: 'countryName must be at least 2 characters' };
  }
  if (countryName.trim().length > 100) {
    return { valid: false, message: 'countryName cannot exceed 100 characters' };
  }
  if (!/^[a-zA-Z\s\-'().]+$/.test(countryName.trim())) {
    return { valid: false, message: 'countryName can only contain letters, spaces, hyphens, apostrophes, and parentheses' };
  }

  // ── pincodeLength (optional) ──
  if (pincodeLength !== undefined) {
    const p = Number(pincodeLength);
    if (!Number.isInteger(p) || p < 1 || p > 10) {
      return { valid: false, message: 'pincodeLength must be an integer between 1 and 10' };
    }
  }

  // ── countryCurrency (optional) ──
  if (countryCurrency !== undefined) {
    if (typeof countryCurrency !== 'string' || countryCurrency.trim().length === 0) {
      return { valid: false, message: 'countryCurrency must be a non-empty string' };
    }
    if (countryCurrency.trim().length > 45) {
      return { valid: false, message: 'countryCurrency cannot exceed 45 characters' };
    }
  }

  // ── currencySymbol (optional) ──
  if (currencySymbol !== undefined) {
    if (typeof currencySymbol !== 'string' || currencySymbol.trim().length === 0) {
      return { valid: false, message: 'currencySymbol must be a non-empty string' };
    }
    if (currencySymbol.trim().length > 10) {
      return { valid: false, message: 'currencySymbol cannot exceed 10 characters' };
    }
  }

  // ── distanceCalcOption (optional) ──
  if (distanceCalcOption !== undefined) {
    if (![0, 1].includes(Number(distanceCalcOption))) {
      return { valid: false, message: 'distanceCalcOption must be 0 (km) or 1 (miles)' };
    }
  }

  // ── currencyRate (optional) ──
  if (currencyRate !== undefined) {
    if (!isPositiveFloat(currencyRate)) {
      return { valid: false, message: 'currencyRate must be a positive number' };
    }
  }

  // ── fuelUnitOption (optional) ──
  if (fuelUnitOption !== undefined) {
    if (![0, 1].includes(Number(fuelUnitOption))) {
      return { valid: false, message: 'fuelUnitOption must be 0 (litre) or 1 (gallon)' };
    }
  }

  // ── isActive (optional) ──
  if (isActive !== undefined) {
    if (![0, 1].includes(Number(isActive))) {
      return { valid: false, message: 'isActive must be 0 or 1' };
    }
  }

  // ── exchangeCurrencyRate (optional) ──
  if (exchangeCurrencyRate !== undefined) {
    if (!isPositiveFloat(exchangeCurrencyRate)) {
      return { valid: false, message: 'exchangeCurrencyRate must be a positive number' };
    }
  }

  // ── countryCode (optional) ──
  if (countryCode !== undefined) {
    if (typeof countryCode !== 'string' || countryCode.trim().length === 0) {
      return { valid: false, message: 'countryCode must be a non-empty string' };
    }
    if (!/^\+?[0-9]{1,6}$/.test(countryCode.trim())) {
      return { valid: false, message: 'countryCode must be a valid phone code e.g. +91 or 91' };
    }
  }

  return { valid: true };
};

// ─── Validate PUT /countries/:id Body ────────────────────────────────────────

export const validateUpdateCountry = (body: any): ValidationResult => {
  if (!body || Object.keys(body).length === 0) {
    return { valid: false, message: 'Request body cannot be empty' };
  }

  const {
    countryName,
    pincodeLength,
    countryCurrency,
    currencySymbol,
    distanceCalcOption,
    currencyRate,
    fuelUnitOption,
    isActive,
    exchangeCurrencyRate,
    countryCode,
  } = body;

  // ── countryName (optional in update) ──
  if (countryName !== undefined) {
    if (typeof countryName !== 'string' || countryName.trim().length === 0) {
      return { valid: false, message: 'countryName must be a non-empty string' };
    }
    if (countryName.trim().length < 2) {
      return { valid: false, message: 'countryName must be at least 2 characters' };
    }
    if (countryName.trim().length > 100) {
      return { valid: false, message: 'countryName cannot exceed 100 characters' };
    }
    if (!/^[a-zA-Z\s\-'().]+$/.test(countryName.trim())) {
      return { valid: false, message: 'countryName can only contain letters, spaces, hyphens, apostrophes, and parentheses' };
    }
  }

  // ── pincodeLength (optional) ──
  if (pincodeLength !== undefined) {
    const p = Number(pincodeLength);
    if (!Number.isInteger(p) || p < 1 || p > 10) {
      return { valid: false, message: 'pincodeLength must be an integer between 1 and 10' };
    }
  }

  // ── countryCurrency (optional) ──
  if (countryCurrency !== undefined) {
    if (typeof countryCurrency !== 'string' || countryCurrency.trim().length === 0) {
      return { valid: false, message: 'countryCurrency must be a non-empty string' };
    }
    if (countryCurrency.trim().length > 45) {
      return { valid: false, message: 'countryCurrency cannot exceed 45 characters' };
    }
  }

  // ── currencySymbol (optional) ──
  if (currencySymbol !== undefined) {
    if (typeof currencySymbol !== 'string' || currencySymbol.trim().length === 0) {
      return { valid: false, message: 'currencySymbol must be a non-empty string' };
    }
    if (currencySymbol.trim().length > 10) {
      return { valid: false, message: 'currencySymbol cannot exceed 10 characters' };
    }
  }

  // ── distanceCalcOption (optional) ──
  if (distanceCalcOption !== undefined) {
    if (![0, 1].includes(Number(distanceCalcOption))) {
      return { valid: false, message: 'distanceCalcOption must be 0 (km) or 1 (miles)' };
    }
  }

  // ── currencyRate (optional) ──
  if (currencyRate !== undefined) {
    if (!isPositiveFloat(currencyRate)) {
      return { valid: false, message: 'currencyRate must be a positive number' };
    }
  }

  // ── fuelUnitOption (optional) ──
  if (fuelUnitOption !== undefined) {
    if (![0, 1].includes(Number(fuelUnitOption))) {
      return { valid: false, message: 'fuelUnitOption must be 0 (litre) or 1 (gallon)' };
    }
  }

  // ── isActive (optional) ──
  if (isActive !== undefined) {
    if (![0, 1].includes(Number(isActive))) {
      return { valid: false, message: 'isActive must be 0 or 1' };
    }
  }

  // ── exchangeCurrencyRate (optional) ──
  if (exchangeCurrencyRate !== undefined) {
    if (!isPositiveFloat(exchangeCurrencyRate)) {
      return { valid: false, message: 'exchangeCurrencyRate must be a positive number' };
    }
  }

  // ── countryCode (optional) ──
  if (countryCode !== undefined) {
    if (typeof countryCode !== 'string' || countryCode.trim().length === 0) {
      return { valid: false, message: 'countryCode must be a non-empty string' };
    }
    if (!/^\+?[0-9]{1,6}$/.test(countryCode.trim())) {
      return { valid: false, message: 'countryCode must be a valid phone code e.g. +91 or 91' };
    }
  }

  return { valid: true };
};