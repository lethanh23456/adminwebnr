import { api } from '../api/client';

class UserService {
  async updateRole(username: string, newRole: string, adminName: string) {
    const response = await api.post('/updateRole', {
      username: username,
      newRole: newRole,
      adminName: adminName
    });
    return response.data;
  }

  async banUser(username: string, adminName: string) {
    const response = await api.post('/banUser', {
      username: username,
      adminName: adminName
    });
    return response.data;
  }

  async unbanUser(username: string, adminName: string) {
    const response = await api.post('/unbanUser', {
      username: username,
      adminName: adminName
    });
    return response.data;
  }


  async getAllUsersExceptNormal() {
      const response = await api.get('/getAllUsersExceptNormal');
      return response.data;
  }

  async findUsername(username: string) {
    const response = await api.post('/findUsername' , {
      username: username,
    });
    return response.data;
  }
  
  async login(username: string, password: string) {
    try {
      const response = await api.post('/login', {
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
        error: error.response?.data?.error || 'Đăng nhập thất bại!'
      };
    }
  }

}

export default new UserService();