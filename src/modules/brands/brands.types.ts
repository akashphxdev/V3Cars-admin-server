export interface GetBrandsQuery {
  page?: number;
  limit?: number;
  search?: string;
  brandStatus?: number;
  brandType?: number;
}

export interface CreateBrandPayload {
  brandName: string;
  brandSlug?: string;
  displayName?: string;
  brandTitle?: string;
  brandType?: number;
  brandStatus?: number;
  logoPath?: string;
  iconPath?: string;
  bannerImage?: string;
  bannerImageAltTag?: string;
  brandDescription?: string;
  introContent?: string;
  parentOrganization?: string;
  brandOrganizationName?: string;
  websiteName?: string;
  websiteUrl?: string;
  emailAddress?: string;
  founderName?: string;
  brandKeyPeople?: string;
  products?: string;
  customerService?: string;
  roadsideAssistance?: number;
  serviceNetwork?: boolean;
  stateId?: number;
  cityId?: number;
  isFasttag?: number;
  similarBrand?: string;
  popularity?: string;
}

export interface UpdateBrandPayload extends Partial<CreateBrandPayload> {}