import axiosInstance from './axiosInstance';

export const clientApi = {
  getClients: async () => {
    const response = await axiosInstance.get('/api/clients');
    return response.data;
  },

  getPortalOverview: async (leadId = null) => {
    const params = leadId ? { leadId } : {};
    const response = await axiosInstance.get('/api/clients/portal-me', { params });
    return response.data;
  },

  updateClientStatus: async (clientId, status, reason = '') => {
    const response = await axiosInstance.patch(`/api/clients/${clientId}/status`, {
      status,
      reason,
    });
    return response.data;
  },
};

export default clientApi;
