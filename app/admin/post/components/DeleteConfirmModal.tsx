
"use client";

import { DeleteConfirmModalProps } from "../types/post.types";

export default function DeleteConfirmModal({
  isOpen,
  postTitle,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Xác Nhận Xóa Bài Viết
        </h3>
        
        <p className="text-gray-600 mb-2">
          Bạn có chắc chắn muốn xóa bài viết này không?
        </p>
        
        <div className="bg-gray-100 p-3 rounded-lg mb-6">
          <p className="font-medium text-gray-800 line-clamp-2">{postTitle}</p>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isDeleting ? "Đang xóa..." : "Xóa Bài Viết"}
          </button>
        </div>
      </div>
    </div>
  );
}