"use client"
import { useEffect, useState } from "react"
import accService from "../../../services/accService"

interface Account {
  id: number;
  url: string;
  description: string;
  price: number;
  status: string;
  partner_id: number;
  createdAt: string;
}

interface FormData {
  username: string;
  password: string;
  url: string;
  description: string;
  price: number;
}

export default function AccountManagement() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [token, setToken] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    url: "",
    description: "",
    price: 0
  });

  useEffect(() => {
    const getUserData = () => {
      const stored = localStorage.getItem('currentUser');
      if (!stored) {
        return null;
      }
      
      try {
        const userData = JSON.parse(stored);
        return {
          token: userData.access_token || "",
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    };

    const userData = getUserData();
    if (userData?.token) {
      setToken(userData.token);
    }
  }, []);

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  };

  const resetForm = () => {
    setFormData({
      username: "",
      password: "",
      url: "",
      description: "",
      price: 0
    });
    setEditingAccount(null);
    setShowForm(false);
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      showMessage("Vui lòng đăng nhập!", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await accService.createAccountSell(
        token,
        formData.username,
        formData.password,
        formData.price,
        formData.url
      );
      
      if (result.success) {
        setAccounts([...accounts, result.data]);
        showMessage(result.message, "success");
        resetForm();
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || "Có lỗi xảy ra!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingAccount) {
      showMessage("Dữ liệu không hợp lệ!", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await accService.updateAccountSell(
        token,
        editingAccount.id,
        formData.url,
        formData.description,
        formData.price
      );
      
      if (result.success) {
        setAccounts(accounts.map(acc => 
          acc.id === editingAccount.id ? result.data : acc
        ));
        showMessage(result.message, "success");
        resetForm();
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || "Có lỗi xảy ra!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (id: number) => {
    if (!token) {
      showMessage("Vui lòng đăng nhập!", "error");
      return;
    }

    if (!confirm("Bạn có chắc muốn xóa account này?")) {
      return;
    }

    setLoading(true);
    try {
      const result = await accService.deleteAccountSell(token, id);
      
      if (result.success) {
        setAccounts(accounts.filter(acc => acc.id !== id));
        showMessage(result.message, "success");
      }
    } catch (error: any) {
      showMessage(error.response?.data?.message || "Có lỗi xảy ra!", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      username: "",
      password: "",
      url: account.url,
      description: account.description,
      price: account.price
    });
    setShowForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Bán Account</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          {showForm ? "Đóng Form" : "+ Thêm Account"}
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded-lg ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingAccount ? "Cập Nhật Account" : "Thêm Account Mới"}
          </h2>
          <form onSubmit={editingAccount ? handleUpdateAccount : handleCreateAccount}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {!editingAccount && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username *
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập password"
                    />
                  </div>
                </>
              )}
              
              <div className={!editingAccount ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Ảnh *
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.url}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div className={!editingAccount ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô Tả *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập mô tả account"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá (VNĐ) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:bg-gray-400"
              >
                {loading ? "Đang xử lý..." : (editingAccount ? "Cập Nhật" : "Tạo Account")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Account List */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold text-gray-800">Danh Sách Account</h2>
        </div>
        
        {accounts.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có account nào. Hãy thêm account đầu tiên!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hình Ảnh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô Tả
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng Thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày Tạo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      #{account.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={account.url} 
                        alt="Account" 
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23ddd" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {account.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {account.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(account)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteAccount(account.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}