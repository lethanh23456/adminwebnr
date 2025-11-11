
"use client";

import { useState, useEffect } from "react";
import { PostFormProps, PostFormData } from "../types/post.types";

export default function PostForm({
  editingPost,
  onSubmit,
  onCancel,
  isSubmitting,
}: PostFormProps) {
  const [formData, setFormData] = useState<PostFormData>({
    title: "",
    url_anh: "",
    content: "",
  });

  const [errors, setErrors] = useState<Partial<PostFormData>>({});

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        url_anh: editingPost.url_anh,
        content: editingPost.content,
      });
    } else {
      setFormData({
        title: "",
        url_anh: "",
        content: "",
      });
    }
    setErrors({});
  }, [editingPost]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PostFormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Tiêu đề không được để trống";
    }
    if (!formData.url_anh.trim()) {
      newErrors.url_anh = "URL ảnh không được để trống";
    }
    if (!formData.content.trim()) {
      newErrors.content = "Nội dung không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
   
    if (errors[name as keyof PostFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">
        {editingPost ? "Sửa Bài Viết" : "Tạo Bài Viết Mới"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Tiêu đề <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập tiêu đề bài viết"
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

     
        <div>
          <label
            htmlFor="url_anh"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            URL Ảnh <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="url_anh"
            name="url_anh"
            value={formData.url_anh}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.url_anh ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="https://example.com/image.jpg"
            disabled={isSubmitting}
          />
          {errors.url_anh && (
            <p className="text-red-500 text-sm mt-1">{errors.url_anh}</p>
          )}
          {formData.url_anh && !errors.url_anh && (
            <div className="mt-2">
              <img
                src={formData.url_anh}
                alt="Preview"
                className="max-w-xs max-h-48 rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

       
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nội dung <span className="text-red-500">*</span>
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={6}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.content ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập nội dung bài viết"
            disabled={isSubmitting}
          />
          {errors.content && (
            <p className="text-red-500 text-sm mt-1">{errors.content}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting
              ? "Đang xử lý..."
              : editingPost
              ? "Cập Nhật"
              : "Tạo Bài Viết"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
}