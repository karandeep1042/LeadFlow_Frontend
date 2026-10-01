import axiosInstance from './axiosInstance';

export const teamApi = {
  getAdvisors: async () => {
    const response = await axiosInstance.get('/api/team/advisors');
    return response.data;
  },

  inviteAdvisor: async (advisorData) => {
    const response = await axiosInstance.post('/api/team/advisors/invite', advisorData);
    return response.data;
  },

  updateAdvisorStatus: async (advisorId, status) => {
    const response = await axiosInstance.patch(`/api/team/advisors/${advisorId}/status`, { status });
    return response.data;
  },

  getAdvisorLeads: async (advisorId) => {
    const response = await axiosInstance.get(`/api/team/advisors/${advisorId}/leads`);
    return response.data;
  },

  deleteAdvisor: async (advisorId, payload = {}) => {
    const response = await axiosInstance.delete(`/api/team/advisors/${advisorId}`, {
      data: payload,
    });
    return response.data;
  },
};

export default teamApi;

