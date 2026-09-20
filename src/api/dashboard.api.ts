import apiClient from "./client";

export const getDashboardStats = () =>
    apiClient.get("/analytics/dashboard/stats");

export const getCrimeCategories = () =>
    apiClient.get("/analytics/dashboard/crimes-by-category");

export const getMonthlyStats = () =>
    apiClient.get("/analytics/dashboard/monthly-stats");

export const getCrimesByDistrict = () =>
    apiClient.get("/analytics/dashboard/crimes-by-district");

export const getOfficerWorkload = () =>
    apiClient.get("/analytics/dashboard/officer-workload");

export const getRecentFIRs = () =>
    apiClient.get("/core/firs");