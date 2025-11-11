
"use client";

import { PostItemProps } from "../types/post.types";

export default function PostItem({ post, onEdit, onDelete }: PostItemProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <img
            src={post.url_anh}
            alt={post.title}
            className="w-24 h-24 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://via.placeholder.com/150?text=No+Image";
            }}
          />
        </div>

        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2 w-[400px]">
            {post.content}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>ID: {post.id}</span>
            <span>•</span>
            <span>Tác giả: {post.editor_realname}</span>
            {post.create_at && (
              <>
                <span>•</span>
                <span>
                  {new Date(post.create_at).toLocaleDateString("vi-VN")}
                </span>
              </>
            )}
            {post.status && (
              <>
                <span>•</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                  {post.status}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(post)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors text-sm"
          >
            Sửa
          </button>
          <button
            onClick={() => onDelete(post.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}