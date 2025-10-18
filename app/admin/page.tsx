"use client"
import { useEffect, useState } from "react"
import UserService from "../../services/userService"

interface User {
  username: string;
  role: string;
  biBan: boolean;
}

interface FindUserResponse {
  id: number;
  username: string;
  biBan: boolean;
  role: string;
  vang: number;
  ngoc: number;
  vangNapTuWeb: number;
  ngocNapTuWeb: number;
  sucManh: number;
  x: number;
  y: number;
  mapHienTai: string;
  daVaoTaiKhoanLanDau: boolean;
  coDeTu: boolean;
  deTu: any;                  
  items: any[];              
  danhSachVatPhamWeb: number[];
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [findUser, setFindUser] = useState<FindUserResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldPage, setFieldPage] = useState(1); 
  const [userPage, setUserPage] = useState(1); 
  const [updateRoleInput, setUpdateRoleInput] = useState("");
  const [banUsername, setBanUsername] = useState("");
  const [unbanUsername, setUnbanUsername] = useState("");
  const [adminName, setAdminName] = useState("");

  const fieldsPerPage = 4;
  const usersPerPage = 10;

  const refetchUsers = async () => {
  const response = await UserService.getAllUsersExceptNormal(); 
    setUsers(response);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await UserService.getAllUsersExceptNormal(); 
      console.log("API response:", response);
      setUsers(response); 
    };
    fetchData();

    // Lấy admin name từ localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const userData = JSON.parse(currentUser);
      setAdminName(userData.username);
    }
  }, []);

  const handleSearchUser = async () => {
    if (!searchInput.trim()) {
      setError("Vui lòng nhập username");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await UserService.findUsername(searchInput);
      setFindUser(response);
      setFieldPage(1); 
    } catch (err) {
      setError("Không tìm thấy người dùng");
      setFindUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSearchInput("");
    setFindUser(null);
    setError("");
  };

  const handleUpdateRole = async () => {
    if (!banUsername.trim()) {
      setError("Vui lòng nhập username");
      return;
    }
    if (!updateRoleInput.trim()) {
      setError("Vui lòng chọn role");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await UserService.updateRole(banUsername, updateRoleInput, adminName);
      setSuccess("Cập nhật role thành công!");
      await refetchUsers();
      setTimeout(() => {
        setShowUpdateRoleModal(false);
        setBanUsername("");
        setUpdateRoleInput("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Cập nhật role thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!banUsername.trim()) {
      setError("Vui lòng nhập username");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await UserService.banUser(banUsername, adminName);
      setSuccess("Ban user thành công!");
      await refetchUsers();
      setTimeout(() => {
        setShowBanModal(false);
        setBanUsername("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Ban user thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async () => {
    if (!unbanUsername.trim()) {
      setError("Vui lòng nhập username");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await UserService.unbanUser(unbanUsername, adminName);
      setSuccess("Unban user thành công!");
      await refetchUsers();
      setTimeout(() => {
        setShowUnbanModal(false);
        setUnbanUsername("");
        setSuccess("");
      }, 2000);
    } catch (err) {
      setError("Unban user thất bại");
    } finally {
      setLoading(false);
    }
  };

  const userInfoFields = findUser ? [
    { label: 'ID', value: findUser.id },
    { label: 'Username', value: findUser.username },
    { label: 'Contact', value: `${findUser.username}@gmail.com` },
    { label: 'Name', value: findUser.username },
    { label: 'Status', value: findUser.biBan ? 'Bị ban' : 'Active', color: findUser.biBan ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' },
    { label: 'Role', value: findUser.role, color: 'bg-blue-100 text-blue-800' },
    { label: 'Vàng', value: findUser.vang },
    { label: 'Ngọc', value: findUser.ngoc },
    { label: 'Vàng nạp từ web', value: findUser.vangNapTuWeb },
    { label: 'Ngọc nạp từ web', value: findUser.ngocNapTuWeb },
    { label: 'Sức mạnh', value: findUser.sucManh },
    { label: 'Map hiện tại', value: findUser.mapHienTai },
  ] : [];

  const indexOfLastField = fieldPage * fieldsPerPage;
  const indexOfFirstField = indexOfLastField - fieldsPerPage;
  const currentFields = userInfoFields.slice(indexOfFirstField, indexOfLastField);
  const totalFieldPages = Math.ceil(userInfoFields.length / fieldsPerPage);

  const indexOfLastUser = userPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalUserPages = Math.ceil(users.length / usersPerPage);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Chào mừng đến với trang quản trị</p>
      </div>

      <div className="flex gap-4">
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Find user
          </button>

          <button 
            onClick={() => setShowUpdateRoleModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            updateRole
          </button>

          <button 
            onClick={() => setShowBanModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            ban
          </button>

          <button 
            onClick={() => setShowUnbanModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            unban
          </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Danh sách quản trị viên</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>

              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentUsers.map((user) => (
                <tr key={user.username} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">👤</span>
                      <span className="text-sm font-medium text-gray-900">{user.username}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{user.role}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      !user.biBan ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {!user.biBan ? 'Hoạt động' : 'Bị ban'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalUserPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setUserPage((p) => Math.max(p - 1, 1))}
            disabled={userPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            ← Trước
          </button>

          <span className="text-gray-700 font-medium">
            Trang {userPage} / {totalUserPages}
          </span>

          <button
            onClick={() => setUserPage((p) => Math.min(p + 1, totalUserPages))}
            disabled={userPage === totalUserPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
          >
            Sau →
          </button>
        </div>
      )}

      {/* Find User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Find User</h2>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearchUser()}
                placeholder="Nhập username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              onClick={handleSearchUser}
              disabled={loading}
              className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 mb-6 font-medium"
            >
              {loading ? 'Đang tìm kiếm...' : 'Search'}
            </button>

            {findUser && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">User Information</h3>

                <div className="grid grid-cols-2 gap-4">
                  {currentFields.map((item, idx) => (
                    <div key={idx}>
                      <p className="text-xs font-medium text-gray-600 mb-2">{item.label}</p>
                      {item.color ? (
                        <div className={`px-3 py-2 rounded text-center text-sm font-semibold ${item.color}`}>
                          {item.value}
                        </div>
                      ) : (
                        <div className="border border-gray-300 rounded-lg p-3">
                          <p className="text-gray-800 font-medium text-sm">{item.value}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {totalFieldPages > 1 && (
                  <div className="flex justify-between items-center mt-6">
                    <button
                      onClick={() => setFieldPage((p) => Math.max(p - 1, 1))}
                      disabled={fieldPage === 1}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      ← Trước
                    </button>

                    <span className="text-gray-700 font-medium">
                      Trang {fieldPage} / {totalFieldPages}
                    </span>

                    <button
                      onClick={() => setFieldPage((p) => Math.min(p + 1, totalFieldPages))}
                      disabled={fieldPage === totalFieldPages}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
                    >
                      Sau →
                    </button>
                  </div>
                )}
              </div>
            )}

            {!findUser && (
              <button
                onClick={handleCloseModal}
                className="w-full mt-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {showUpdateRoleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Update Role</h2>
              <button
                onClick={() => {
                  setShowUpdateRoleModal(false);
                  setBanUsername("");
                  setUpdateRoleInput("");
                  setError("");
                  setSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={banUsername}
                onChange={(e) => setBanUsername(e.target.value)}
                placeholder="Nhập username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role mới <span className="text-red-500">*</span>
              </label>
              <select
                value={updateRoleInput}
                onChange={(e) => setUpdateRoleInput(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              >
                <option value="">Chọn role</option>
                <option value="ADMIN">ADMIN</option>
                <option value="MODERATOR">MODERATOR</option>
                <option value="USER">USER</option>
              </select>
            </div>

            <button
              onClick={handleUpdateRole}
              disabled={loading}
              className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Đang cập nhật...' : 'Update'}
            </button>
          </div>
        </div>
      )}

      {/* Ban User Modal */}
      {showBanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Ban </h2>
              <button
                onClick={() => {
                  setShowBanModal(false);
                  setBanUsername("");
                  setError("");
                  setSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={banUsername}
                onChange={(e) => setBanUsername(e.target.value)}
                placeholder="Nhập username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <button
              onClick={handleBanUser}
              disabled={loading}
              className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Đang ban...' : 'Ban '}
            </button>
          </div>
        </div>
      )}

      {/* Unban User Modal */}
      {showUnbanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Unban</h2>
              <button
                onClick={() => {
                  setShowUnbanModal(false);
                  setUnbanUsername("");
                  setError("");
                  setSuccess("");
                }}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-sm">
                {success}
              </div>
            )}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={unbanUsername}
                onChange={(e) => setUnbanUsername(e.target.value)}
                placeholder="Nhập username"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black outline-none"
              />
            </div>

            <button
              onClick={handleUnbanUser}
              disabled={loading}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 font-medium"
            >
              {loading ? 'Đang unban...' : 'Unban'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}