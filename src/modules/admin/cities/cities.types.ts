export interface GetCitiesQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: number;
  stateId?: number;
  countryId?: number;
  isPopularCity?: number;
  isTopCity?: number;
}

export interface CreateCityPayload {
  cityName: string;
  stateId?: number;
  countryId?: number;
  status?: number;
  isDefault?: number;
  isPopularCity?: number;
  isTopCity?: number;
  ismajorCityPetrol?: number;
  ismajorCityDiesel?: number;
  ismajorCityCNG?: number;
  isCurrentCity?: number;
  isImage?: string;
}

export interface UpdateCityPayload extends Partial<CreateCityPayload> {}