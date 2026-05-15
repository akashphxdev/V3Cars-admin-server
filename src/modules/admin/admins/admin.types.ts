// src/modules/admin/admin.types.ts

export interface Admin {
  adminId:            number;
  adminUserName:      string;
  adminName:          string;
  adminEmailId:       string;
  adminType:          number;
  adminSubType:       number | null;
  status:             string;
  accessBrands:       string | null;
  accessStartDate:    Date | null;
  accessEndDate:      Date | null;
  lastLoginDateTime:  Date | null;
  lastLoginIPAddress: string | null;
  maxRows:            number;
  isLock:             number | null;
  addedDateTime:      Date | null;
  addedBy:            number | null;
}

export interface GetAdminsQuery {
  page?:   number;
  limit?:  number;
  status?: string;
  search?: string;
}

export interface CreateAdminPayload {
  adminUserName:    string;
  adminPassword:    string;
  adminName:        string;
  adminEmailId:     string;
  adminType:        number;
  adminSubType?:    number;
  status?:          string;
  accessBrands?:    string;
  accessStartDate?: string;
  accessEndDate?:   string;
  maxRows?:         number;
  addedBy?:         number;
}

export interface UpdateAdminPayload {
  adminUserName?:   string;
  adminName?:       string;
  adminEmailId?:    string;
  adminPassword?:   string;
  adminType?:       number;
  adminSubType?:    number;
  status?:          string;
  accessBrands?:    string;
  accessStartDate?: string;
  accessEndDate?:   string;
  maxRows?:         number;
  isLock?:          number;
}