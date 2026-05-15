// src/modules/districts/district.types.ts

export interface District {
  id:                number;
  stateId:           number | null;
  districtName:      string | null;
  status:            number | null;
  isPopularCity:     number | null;
  ismajorCityPetrol: number | null;
  ismajorCityDiesel: number | null;
  ismajorCityCNG:    number | null;
}

// ─── Enriched (GET /districts response mein aata hai) ────────────────────────

export interface DistrictEnriched extends District {
  stateName: string | null;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface GetDistrictsQuery {
  page?:       number;
  limit?:      number;
  search?:     string;
  stateId?:    number;
  districtId?: number;
}

// ─── Update Payload ───────────────────────────────────────────────────────────

export interface UpdateDistrictPayload {
  ismajorCityPetrol?: number;
  ismajorCityDiesel?: number;
  ismajorCityCNG?:    number;
  isPopularCity?:     number;
  ip:                 string;
}