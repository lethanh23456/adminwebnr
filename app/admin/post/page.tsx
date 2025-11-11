"use client";

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import PostForm from "./components/PostForm";
import PostList from "./components/PostList";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import EditService from "@/services/editService";
import { Post, PostFormData, ApiResponse } from "./types/post.types";

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    postId: number | null;
    postTitle: string;
  }>({
    isOpen: false,
    postId: null,
    postTitle: "",
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const getUserData = () => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      return null;
    }
    
    try {
      const userData = JSON.parse(stored);
      return {
        token: userData.access_token || "",
        auth_id: userData.auth_id || 0,
        realname: userData.realname || userData.username || "User",
      };
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  };

  const currentUser = getUserData();

  useEffect(() => {
    if (!currentUser) {
      toast.error("Không tìm thấy thông tin đăng nhập");
      return;
    }
    
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    if (!currentUser) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result: ApiResponse<Post[]> = await EditService.AllPosts(
        currentUser.token
      );

      if (result.success && result.data) {
        setPosts(result.data);
      } else {
        toast.error(result.error || "Không thể tải danh sách bài viết");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Đã xảy ra lỗi khi tải danh sách bài viết");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (formData: PostFormData) => {
    if (!currentUser) {
      toast.error("Không tìm thấy thông tin đăng nhập");
      return;
    }
    
    setIsSubmitting(true);
    try {
      let result: ApiResponse<any>;

      if (editingPost) {
        result = await EditService.UpdatePost(
          editingPost.id,
          formData.title,
          currentUser.token,
          formData.url_anh,
          formData.content
        );
      } else {
        result = await EditService.CreatePost(
          formData.title,
          formData.url_anh,
          formData.content,
          currentUser.token,
          currentUser.auth_id,  
          currentUser.realname
        );
      }

      if (result.success) {
        toast.success(
          result.message || 
          (editingPost ? "Cập nhật bài viết thành công!" : "Tạo bài viết thành công!")
        );
        setEditingPost(null);
        await fetchPosts(); 
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast.error("Đã xảy ra lỗi không mong muốn");
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const handleDeleteConfirm = async () => {
    if (!deleteModal.postId || !currentUser) {
      return;
    }

    setIsDeleting(true);
    try {
      const result: ApiResponse<any> = await EditService.Deletepost(
        deleteModal.postId,
        currentUser.token
      );

      if (result.success) {
        toast.success(result.message || "Xóa bài viết thành công!");
        setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
        await fetchPosts();
      } else {
        toast.error(result.error || "Không thể xóa bài viết");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Đã xảy ra lỗi khi xóa bài viết");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = (post: Post) => {
    setEditingPost(post);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: number) => {
    const post = posts.find((p) => p.id === id);
    if (post) {
      setDeleteModal({
        isOpen: true,
        postId: id,
        postTitle: post.title,
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const handleCancelDelete = () => {
    setDeleteModal({ isOpen: false, postId: null, postTitle: "" });
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Quản Lý Bài Viết
          </h1>
          <p className="text-gray-600">
            Tạo, chỉnh sửa và xóa bài viết của bạn
          </p>
        </div>

        <PostForm
          editingPost={editingPost}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
          isSubmitting={isSubmitting}
        />

      
        <PostList
          posts={posts}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

       
        <DeleteConfirmModal
          isOpen={deleteModal.isOpen}
          postTitle={deleteModal.postTitle}
          onConfirm={handleDeleteConfirm}
          onCancel={handleCancelDelete}
          isDeleting={isDeleting}
        />
      </div>
    </div>
  );
}