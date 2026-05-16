// src/modules/dashboard/dashboard.service.ts

import prisma from '../../config/db';
import { DashboardMetrics } from './dashboard.types';

export const getDashboardMetrics = async (): Promise<DashboardMetrics> => {

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [
    // ── LMS ──────────────────────────────────────────────────────────────────
    users,
    brands,
    models,
    leads,
    todayLeads,
    otpVerifiedLeads,
    carInsuranceLeads,
    carLoanLeads,
    sellCarLeads,
    variants,
    clientApis,

    // ── Website ───────────────────────────────────────────────────────────────
    websiteUsers,
    authors,
    contents,
    videos,
    upcomingModels,
    pendingReviews,
    activeOffers,
    subscribers,
  ] = await Promise.all([

    // ── LMS ──────────────────────────────────────────────────────────────────
    prisma.tbladmins.count({
      where: { status: 'Active' },
    }),

    prisma.tblbrands.count({
      where: { brandStatus: 1 },
    }),

    prisma.tblmodels.count({
      where: { isUpcoming: false },
    }),

    prisma.tblleads.count(),

    prisma.tblleads.count({
      where: {
        leadCaptureDateTime: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }),

    prisma.tblleads.count({
      where: { isOTPVerified: 1 },
    }),

    prisma.tblleads.count({
      where: { leadCategory: 1 },
    }),

    prisma.tblleads.count({
      where: { leadCategory: 2 },
    }),

    prisma.tblsellcarlead.count(),

    prisma.tblvariants.count(),

    prisma.tblclientapi.count(),

    // ── Website ───────────────────────────────────────────────────────────────
    prisma.tblusers.count({
      where: { status: 1 },
    }),

    prisma.tblauthor.count({
      where: { status: 1 },
    }),

    prisma.tblcontents.count({
      where: { contentPublishStatus: 1 },
    }),

    prisma.tblwebvideos.count({
      where: { publishStatus: 1 },
    }),

    prisma.tblmodels.count({
      where: { isUpcoming: true },
    }),

    prisma.tblcarreviews.count({
      where: { isApprovedRejected: 0 },
    }),

    prisma.tbloffers.count({
      where: { offerStatus: 1 },
    }),

    prisma.tblsubscribers.count(),
  ]);

  return {
    lms: {
      users,
      brands,
      models,
      leads,
      todayLeads,
      otpVerifiedLeads,
      carInsuranceLeads,
      carLoanLeads,
      sellCarLeads,
      variants,
      clientApis,
    },
    website: {
      websiteUsers,
      authors,
      contents,
      videos,
      upcomingModels,
      pendingReviews,
      activeOffers,
      subscribers,
    },
  };
};