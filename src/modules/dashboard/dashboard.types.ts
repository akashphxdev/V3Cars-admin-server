// src/modules/dashboard/dashboard.types.ts

export interface LmsMetrics {
  users:             number;
  brands:            number;
  models:            number;
  leads:             number;
  todayLeads:        number;
  otpVerifiedLeads:  number;
  carInsuranceLeads: number;
  carLoanLeads:      number;
  sellCarLeads:      number;
  variants:          number;
  clientApis:        number;
}

export interface WebsiteMetrics {
  websiteUsers:   number;
  authors:        number;
  contents:       number;
  videos:         number;
  upcomingModels: number;
  pendingReviews: number;
  activeOffers:   number;
  subscribers:    number;
}

export interface DashboardMetrics {
  lms:     LmsMetrics;
  website: WebsiteMetrics;
}