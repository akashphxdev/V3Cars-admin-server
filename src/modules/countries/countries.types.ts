export interface GetCountriesQuery {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: number;
}

export interface CreateCountryPayload {
  countryName: string;
  pincodeLength?: number;
  countryCurrency?: string;
  currencySymbol?: string;
  distanceCalcOption?: number;
  currencyRate?: number;
  fuelUnitOption?: number;
  isActive?: number;
  exchangeCurrencyRate?: number;
  countryCode?: string;
}

export interface UpdateCountryPayload extends Partial<CreateCountryPayload> {}