// src/modules/roles/role.types.ts

export interface Role {
  id:            number;
  role:          string | null;
  parent_role:   string | null;
  permissionIds: string | null;
}

export interface GetRolesQuery {
  page?:   number;
  limit?:  number;
  search?: string;
}

export interface CreateRolePayload {
  role:          string;
  parent_role?:  string | null;
  permissionIds: string; // comma-separated
}

export interface UpdateRolePayload {
  role?:          string;
  parent_role?:   string | null;
  permissionIds?: string;
}