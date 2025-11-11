import { api } from '../api/client';

class EditService {
    async CreatePost(title: string, url_anh: string , content : string, token: string , editor_id : number , editor_realname : string) {
    try {
      const response = await api.post('/editor/create-post', {
        title: title,
        url_anh: url_anh,
        content : content,
        editor_id : editor_id,
        editor_realname : editor_realname
      },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      return {
        success: true,
        data: response.data,
        message: 'Tạo bài viết thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi tạo bài:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'không có token'
        };
      }

      if (error.response?.status === 403) {
        return {
          success: false,
            error: 'Bạn không có quyền'
        };
      }
      
      return {
        success: false,
        error: error.response?.data?.message || error.response?.data?.error || 'tạo bài viết thất bại!'
      };
    }
  }


  async AllPosts(token: string) {
    try {
      const response = await api.get(
        '/editor/all-posts',
       {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      return {
        success: true,
        data: response.data,
        message: 'Lấy bài viết thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi lấy bài viết', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'hết hạn token'
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
        error: error.response?.data?.message || error.response?.data?.error || 'Lấy danh sách bài viết thất bại!'
      };
    }
  }


  async UpdatePost(id: number, title: string, token: string , url_anh: string , content : string) {
    try {
      const response = await api.patch(
        '/editor/update-post',
        {
          id: id,
          title: title,
          url_anh: url_anh,
          content : content
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
        message: 'cập nhật thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi duyệt yêu cầu:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'hết hạn token'
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
        error: error.response?.data?.message || error.response?.data?.error || 'Duyệt yêu cầu thất bại!'
      };
    }
  }

  async Deletepost(id: number, token: string ) {
    try {
   
      const response = await api.delete(
        '/editor/delete-post',
        {
            data: { id: id },  
            headers: {
            'Authorization': `Bearer ${token}`
            }
        }
        );
      return {
        success: true,
        data: response.data,
        message: 'cập nhật thành công!'
      };
    } catch (error: any) {
      console.error('Lỗi khi duyệt yêu cầu:', error);
      
      if (error.response?.status === 401) {
        return {
          success: false,
          error: 'hết hạn token'
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
        error: error.response?.data?.message || error.response?.data?.error || 'Duyệt yêu cầu thất bại!'
      };
    }
  }
}

export default new EditService();