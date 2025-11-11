import { api } from '../api/client';

class AdminService {
  async allWithdrawl(token: string) {
    try {
      const response = await api.get(
        '/cashier/all-withdraw',
       {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      return {
        success: true,
        data: response.data,
        message: 'Lấy danh sách rút tiền thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách rút tiền:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!'
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Bạn không có quyền truy cập!'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Lấy danh sách rút tiền thất bại!'
      };
    }
  }

  // API Approve Withdraw
  async approveWithdraw(id: number, finance_id: number, token: string) {
    try {
      const response = await api.patch(
        '/cashier/approve-withdraw',
        {
          id: id,
          finance_id: finance_id,
          status: "SUCCESS"
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Duyệt yêu cầu rút tiền thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi duyệt yêu cầu rút tiền:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!'
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Bạn không có quyền thực hiện thao tác này!'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Duyệt yêu cầu rút tiền thất bại!'
      };
    }
  }

  // API Reject Withdraw
  async rejectWithdraw(id: number, finance_id: number, token: string) {
    try {
      const response = await api.patch(
        '/cashier/reject-withdraw',
        {
          id: id,
          finance_id: finance_id,
          status: "SUCCESS"
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return {
        success: true,
        data: response.data,
        message: 'Từ chối yêu cầu rút tiền thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi từ chối yêu cầu rút tiền:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn!'
        };
      }
      
      if (error.response?.status === 403) {
        return {
          success: false,
          error: 'Bạn không có quyền thực hiện thao tác này!'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Từ chối yêu cầu rút tiền thất bại!'
      };
    }
  }

  async verifyOtp(otp: string, sessionId: string) {
    try {
      const response = await api.post('/auth/verify-otp', {
        otp: otp,
        sessionId: sessionId
      });
      return {
        success: true,
        data: response.data,
        message: 'Xác thực OTP thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi xác thực OTP:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Mã OTP không đúng hoặc đã hết hạn!'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Xác thực OTP thất bại!'
      };
    }
  }

  async login(username: string, password: string) {
    try {
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });
      return {
        success: true,
        data: response.data,
        message: 'Đăng nhập thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi đăng nhập:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'Tài khoản hoặc mật khẩu không đúng!'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'Đăng nhập thất bại!'
      };
    }
  }
}

export default new AdminService();