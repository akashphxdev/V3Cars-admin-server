// src/modules/admin/apiManagement/apiManagement.types.ts

export interface ClientApi {
  apiId:           number;
  apiName:         string | null;
  apiDesc:         string | null;
  apiStatus:       number;
  createdBy:       string | null;
  createdDateTime: Date | null;
  brandId:         number | null;
  modelIds:        string | null;
  lmsApiUrl:       string | null;
}

export interface GetApisQuery {
  page?:      number;
  limit?:     number;
  search?:    string;
  apiStatus?: number;
  brandId?:   number;
}

export interface CreateApiPayload {
  apiName:    string;
  apiDesc?:   string;
  apiStatus?: number;
  brandId?:   number;
  modelIds?:  string;
  lmsApiUrl?: string;
  createdBy?: number;
}

export interface UpdateApiPayload {
  apiName?:   string;
  apiDesc?:   string;
  apiStatus?: number;
  brandId?:   number;
  modelIds?:  string;
  lmsApiUrl?: string;
}