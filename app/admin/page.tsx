"use client"
import { useEffect, useState } from "react"

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

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [findUser, setFindUser] = useState<FindUserResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const fetchData = async () => {
        // const response = await UserService.getAllUsersExceptNormal(); 
        // console.log("API response:", response);
        // setUsers(response); 
    };

    fetchData(); 
  }, []);

  const handleSearchUser = async () => {
    if (!searchInput.trim()) {
      setError("Vui lòng nhập username");
      return;
    }

    setLoading(true);
    setError("");
    try {
      // const response = await UserService.findUsername(searchInput);
      // console.log("Find user response:", response);
      // setFindUser(response);
      
      // Mock data for demo
      setFindUser({
        id: 27,
        username: searchInput,
        biBan: false,
        role: 'ADMIN',
        vang: 1000,
        ngoc: 500,
        vangNapTuWeb: 200,
        ngocNapTuWeb: 100,
        sucManh: 150,
        x: 10,
        y: 20,
        mapHienTai: 'Map 1',
        daVaoTaiKhoanLanDau: true,
        coDeTu: true,
        deTu: {},
        items: [],
        danhSachVatPhamWeb: []
      });
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

  const userInfoFields = findUser ? [
    { label: 'ID', value: findUser.id },
    { label: 'Username', value: findUser.username },
    { label: 'Contact', value: `${findUser.username}@gmail.com` },
    { label: 'Name', value: findUser.username },
    { label: 'Status', value: findUser.biBan ? 'Bị ban' : 'Active', color: findUser.biBan ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800' },
    { label: 'Role', value: findUser.role, color: 'bg-green-100 text-green-800' },
    { label: 'Vàng', value: findUser.vang },
    { label: 'Ngọc', value: findUser.ngoc },
    { label: 'Vàng nạp từ web', value: findUser.vangNapTuWeb },
    { label: 'Ngọc nạp từ web', value: findUser.ngocNapTuWeb },
    { label: 'Sức mạnh', value: findUser.sucManh },
    { label: 'Map hiện tại', value: findUser.mapHienTai },
  ] : [];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">Chào mừng đến với trang quản trị</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Danh sách người dùng</h2>

          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
          >
            Find user
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
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
                      !user.biBan
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {!user.biBan ? 'Hoạt động' : 'Bị ban'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-red-600 hover:text-red-800 font-medium">
                      {!user.biBan ? 'Ban' : 'Unban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Find User</h2>
                <p className="text-sm text-gray-600">Find someone on Gahu studio.</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>
            
            {/* Search Input */}
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

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Search Button */}
            <button
              onClick={handleSearchUser}
              disabled={loading}
              className="w-full bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition disabled:bg-gray-400 mb-6 font-medium"
            >
              {loading ? 'Đang tìm kiếm...' : 'Search'}
            </button>

            {/* User Info Display - 2 Column Grid */}
            {findUser && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">User Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  {userInfoFields.map((item, idx) => (
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
              </div>
            )}

            {/* Close Button */}
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
    </div>
  )
}