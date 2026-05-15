export interface Role {
  id:            number;
  role:          string | null;
  parent_role:   string | null;
  permissionIds: string | null;
}

// ─── Enriched (GET /roles response mein aata hai) ────────────────────────────

export interface RoleEnriched extends Role {
  parentRole:       { id: number; role: string | null } | null;
  subRoles:         { id: number; role: string | null }[];
  permissionNames:  { id: number; title: string | null }[];
}

export interface GetRolesQuery {
  page?:   number;
  limit?:  number;
  search?: string;
}

export interface CreateRolePayload {
  role:          string;
  parent_role?:  string | null;
  permissionIds: string;
  ip:            string;
}

export interface UpdateRolePayload {
  role?:          string;
  parent_role?:   string | null;
  permissionIds?: string;
  ip:             string;
}

export interface DeleteRolePayload {
  ip: string;
}