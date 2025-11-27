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
  buyer_id?: number;
  createdAt: string;
}

interface FormData {
  username: string;
  password: string;
  url: string;
  description: string;
  price: number;
}

export default function AccountManagementComplete() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [token, setToken] = useState<string>("");
  const [currentPartnerId, setCurrentPartnerId] = useState<number | null>(null);
  const [searchPartnerId, setSearchPartnerId] = useState<string>("");
  const [viewingPartnerId, setViewingPartnerId] = useState<number | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
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
      if (!stored) return null;
      
      try {
        const userData = JSON.parse(stored);
        return {
          token: userData.access_token || "",
          partner_id: userData.auth_id || null,
        };
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    };

    const userData = getUserData();
    if (userData?.token) {
      setToken(userData.token);
      setCurrentPartnerId(userData.partner_id);
    }
  }, []);

  const loadAccountsByPartner = async (userToken: string, partnerId: number) => {
    setSearching(true);
    try {
      const result = await accService.accountSellByPartner(userToken, partnerId);
      if (result.success) {
        const allAccounts = result.data || [];
        
        // ✅ FIX: Lọc chỉ lấy accounts của partner_id đang tìm kiếm
        const filteredAccounts = allAccounts.filter(
          (account: Account) => account.partner_id === partnerId
        );
        
        console.log(`Total accounts: ${allAccounts.length}, Filtered for Partner #${partnerId}: ${filteredAccounts.length}`);
        
        setAccounts(filteredAccounts);
        setViewingPartnerId(partnerId);
        setSearchPartnerId(partnerId.toString());
      }
    } catch (error: any) {
      console.error('Error fetching accounts:', error);
      showMessage(error.response?.data?.message || "Có lỗi xảy ra khi tải account!", "error");
      setAccounts([]);
      setViewingPartnerId(null);
    } finally {
      setSearching(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!token) {
      showMessage("Vui lòng đăng nhập!", "error");
      return;
    }

    if (!searchPartnerId) {
      showMessage("Vui lòng nhập Partner ID!", "error");
      return;
    }

    const partnerId = parseInt(searchPartnerId);
    if (isNaN(partnerId) || partnerId <= 0) {
      showMessage("Partner ID không hợp lệ!", "error");
      return;
    }

    // ✅ RESET toàn bộ trước khi tìm kiếm mới
    setShowForm(false);
    setEditingAccount(null);
    setAccounts([]);
    setIsSearching(true);
    
    await loadAccountsByPartner(token, partnerId);
  };

  const handleCancelSearch = () => {
    setSearchPartnerId("");
    setIsSearching(false);
    setAccounts([]);
    setViewingPartnerId(null);
    setShowForm(false);
    setEditingAccount(null);
  };

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
        formData.description,
        formData.price,
        formData.url
      );
      
      if (result.success) {
        if (viewingPartnerId !== null) {
          await loadAccountsByPartner(token, viewingPartnerId);
        }
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
        if (viewingPartnerId !== null) {
          await loadAccountsByPartner(token, viewingPartnerId);
        }
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
        if (viewingPartnerId !== null) {
          await loadAccountsByPartner(token, viewingPartnerId);
        }
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

  const handleViewMyAccounts = () => {
    if (!currentPartnerId || !token) {
      showMessage("Không tìm thấy thông tin Partner!", "error");
      return;
    }
    
    // ✅ RESET trước khi load
    setAccounts([]);
    setShowForm(false);
    setEditingAccount(null);
    setIsSearching(true);
    
    loadAccountsByPartner(token, currentPartnerId);
  };

  const isViewingMyAccounts = viewingPartnerId === currentPartnerId;

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Account</h1>
          <p className="text-gray-600 mt-1">
            {viewingPartnerId 
              ? (isViewingMyAccounts 
                  ? `Account của tôi (Partner #${viewingPartnerId})` 
                  : `Đang xem Partner #${viewingPartnerId}`)
              : "Vui lòng tìm kiếm Partner"}
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={handleViewMyAccounts}
            disabled={!currentPartnerId}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold disabled:bg-gray-400"
          >
            📋 Account Của Tôi
          </button>
          
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors font-semibold disabled:bg-gray-400"
          >
            {showForm ? "Đóng Form" : "+ Thêm Account"}
          </button>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">🔍 Tìm kiếm theo Partner ID</h3>
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partner ID
            </label>
            <input
              type="number"
              value={searchPartnerId}
              onChange={(e) => setSearchPartnerId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập Partner ID (VD: 1, 2, 3...)"
              disabled={searching}
            />
          </div>
          
          {!isSearching ? (
            <button
              type="submit"
              disabled={searching || !searchPartnerId}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors disabled:bg-gray-400 font-semibold"
            >
              {searching ? "Đang tìm..." : "🔍 Tìm kiếm"}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleCancelSearch}
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              ❌ Hủy
            </button>
          )}
        </form>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`p-4 mb-4 rounded-lg ${
          message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {message.text}
        </div>
      )}

      {/* Form - Chỉ hiển thị khi đang xem accounts của mình */}
      {showForm && isViewingMyAccounts && (
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
        <div className="px-6 py-4 bg-gray-50 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Danh Sách Account</h2>
          {viewingPartnerId && (
            <span className="text-sm text-gray-600">
              Tổng: <span className="font-bold text-blue-600">{accounts.length}</span> account
            </span>
          )}
        </div>
        
        {searching ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải...</p>
          </div>
        ) : accounts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {viewingPartnerId 
                ? `Partner #${viewingPartnerId} chưa có account nào` 
                : "Không có dữ liệu"}
            </h3>
            <p className="text-gray-500">
              {viewingPartnerId 
                ? "Hãy thêm account mới để bắt đầu!" 
                : "Vui lòng tìm kiếm Partner ID hoặc nhấn 'Account Của Tôi'."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hình Ảnh</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô Tả</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng Thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Partner ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buyer ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày Tạo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành Động</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {accounts.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{account.id}</td>
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
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                      <div className="line-clamp-2">
                        {account.description || <span className="text-gray-400 italic">Không có mô tả</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {account.price.toLocaleString('vi-VN')} ₫
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        account.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : account.status === 'SOLD'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {account.status === 'SOLD' ? 'ĐÃ BÁN' : account.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={account.partner_id === viewingPartnerId ? "font-bold text-blue-600" : ""}>
                        #{account.partner_id}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {account.buyer_id ? `#${account.buyer_id}` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(account.createdAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {account.status === 'SOLD' || !isViewingMyAccounts ? (
                        <span className="text-gray-400 italic">
                          {account.status === 'SOLD' ? 'Đã bán' : 'Chỉ xem'}
                        </span>
                      ) : (
                        <>
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
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}