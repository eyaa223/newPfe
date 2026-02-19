import axios from 'axios';

const API_URL = '/api';

// Campaigns
export const campaignService = {
  getAll: (params) => axios.get(`${API_URL}/campaigns`, { params }),
  getById: (id) => axios.get(`${API_URL}/campaigns/${id}`),
  create: (data) => axios.post(`${API_URL}/campaigns`, data),
  update: (id, data) => axios.put(`${API_URL}/campaigns/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/campaigns/${id}`),
  uploadImages: (id, formData) => axios.post(`${API_URL}/campaigns/${id}/images`, formData),
  addUpdate: (id, data) => axios.post(`${API_URL}/campaigns/${id}/updates`, data)
};

// Associations
export const associationService = {
  getAll: (params) => axios.get(`${API_URL}/associations`, { params }),
  getById: (id) => axios.get(`${API_URL}/associations/${id}`),
  create: (data) => axios.post(`${API_URL}/associations`, data),
  update: (id, data) => axios.put(`${API_URL}/associations/${id}`, data),
  uploadLogo: (id, formData) => axios.post(`${API_URL}/associations/${id}/logo`, formData),
  verify: (id) => axios.put(`${API_URL}/associations/${id}/verify`)
};

// Donations
export const donationService = {
  getAll: () => axios.get(`${API_URL}/donations`),
  getById: (id) => axios.get(`${API_URL}/donations/${id}`),
  create: (data) => axios.post(`${API_URL}/donations`, data),
  getUserDonations: (userId) => axios.get(`${API_URL}/donations/user/${userId}`),
  getCampaignDonations: (campaignId) => axios.get(`${API_URL}/donations/campaign/${campaignId}`)
};

// Requests
export const requestService = {
  getAll: (params) => axios.get(`${API_URL}/requests`, { params }),
  getById: (id) => axios.get(`${API_URL}/requests/${id}`),
  create: (data) => axios.post(`${API_URL}/requests`, data),
  update: (id, data) => axios.put(`${API_URL}/requests/${id}`, data),
  assign: (id, data) => axios.put(`${API_URL}/requests/${id}/assign`, data),
  updateStatus: (id, data) => axios.put(`${API_URL}/requests/${id}/status`, data),
  uploadDocuments: (id, formData) => axios.post(`${API_URL}/requests/${id}/documents`, formData),
  delete: (id) => axios.delete(`${API_URL}/requests/${id}`)
};

// Statistics
export const statsService = {
  getDashboard: () => axios.get(`${API_URL}/stats/dashboard`),
  getMonthlyDonations: (year) => axios.get(`${API_URL}/stats/donations/monthly`, { params: { year } }),
  getCampaignPerformance: () => axios.get(`${API_URL}/stats/campaigns/performance`),
  getTopDonors: (limit) => axios.get(`${API_URL}/stats/top-donors`, { params: { limit } })
};

// Users
export const userService = {
  getAll: () => axios.get(`${API_URL}/users`),
  getById: (id) => axios.get(`${API_URL}/users/${id}`),
  update: (id, data) => axios.put(`${API_URL}/users/${id}`, data),
  uploadAvatar: (formData) => axios.post(`${API_URL}/users/avatar`, formData),
  delete: (id) => axios.delete(`${API_URL}/users/${id}`)
};

export default {
  campaign: campaignService,
  association: associationService,
  donation: donationService,
  request: requestService,
  stats: statsService,
  user: userService
};
