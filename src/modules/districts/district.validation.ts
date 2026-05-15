// src/modules/districts/district.validation.ts

export interface ValidationResult {
  valid:   boolean;
  message: string;
}

// ─── ID Param Validation ──────────────────────────────────────────────────────

export const validateIdParam = (id: any): ValidationResult => {
  const numId = Number(id);
  if (!id || isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
    return { valid: false, message: 'Invalid district ID' };
  }
  return { valid: true, message: '' };
};

// ─── Update District Validation ───────────────────────────────────────────────

export const validateUpdateDistrict = (body: any): ValidationResult => {
  const { ismajorCityPetrol, ismajorCityDiesel, ismajorCityCNG, isPopularCity } = body;

  // Kam se kam ek field honi chahiye
  if (
    ismajorCityPetrol === undefined &&
    ismajorCityDiesel === undefined &&
    ismajorCityCNG    === undefined &&
    isPopularCity     === undefined
  ) {
    return { valid: false, message: 'At least one field is required to update' };
  }

  // Toggle fields — sirf 0 ya 1 allowed
  const toggleFields = [
    { name: 'ismajorCityPetrol', value: ismajorCityPetrol },
    { name: 'ismajorCityDiesel', value: ismajorCityDiesel },
    { name: 'ismajorCityCNG',    value: ismajorCityCNG    },
  ];

  for (const field of toggleFields) {
    if (field.value !== undefined) {
      const num = Number(field.value);
      if (isNaN(num) || (num !== 0 && num !== 1)) {
        return { valid: false, message: `${field.name} must be 0 or 1` };
      }
    }
  }

  // isPopularCity — non-negative integer hona chahiye
  if (isPopularCity !== undefined) {
    const num = Number(isPopularCity);
    if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
      return { valid: false, message: 'isPopularCity must be a non-negative integer' };
    }
  }

  return { valid: true, message: '' };
};