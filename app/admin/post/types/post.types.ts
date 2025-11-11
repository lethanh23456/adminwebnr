

export interface Post {
  id: number;
  title: string;
  url_anh: string;
  content: string;
  editor_id: number;  
  editor_realname: string;
  status?: string;     
  create_at?: string;  
  update_at?: string; 
}

export interface PostFormData {
  title: string;
  url_anh: string;
  content: string;
}

export interface PostFormProps {
  editingPost: Post | null;
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

export interface PostListProps {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export interface PostItemProps {
  post: Post;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export interface DeleteConfirmModalProps {
  isOpen: boolean;
  postTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}