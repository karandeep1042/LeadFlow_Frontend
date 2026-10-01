import axiosInstance from './axiosInstance';

export const brokerageDashboardApi = {
  getDashboardData: async () => {
    const response = await axiosInstance.get('/api/brokerage/dashboard');
    return response.data;
  },
};

export default brokerageDashboardApi;
