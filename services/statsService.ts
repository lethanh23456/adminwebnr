import { api } from '../api/client';

class statsService {
  async SystemCashFlow(token: string) {
    try {
      const response = await api.get('/finance/system-cash-flow', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      return {
        success: true,
        data: response.data,
        message: 'Thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi ', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Lấy dữ liệu thất bại!'
      };
    }
  }

  async AllRecord(token: string) {
    try {
      const response = await api.get('/finance/all-record', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      return {
        success: true,
        data: response.data.finances, 
        message: 'Thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi ', error);
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Lấy dữ liệu thất bại!'
      };
    }
  }
}

export default new statsService();