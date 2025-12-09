"use client";

import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import playerManagementService from "@/services/playerManagementService";


interface PlayerProfile {
  user: {
    danhSachVatPhamWeb: any[]; 
    id: number;
    vang: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    ngoc: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    sucManh: {
      low: number;
      high: number;
      unsigned: boolean;
    };
    vangNapTuWeb: { 
      low: number;
      high: number;
      unsigned: boolean;
    };
    ngocNapTuWeb: { 
      low: number;
      high: number;
      unsigned: boolean;
    };
    x: number;
    y: number; 
    mapHienTai: string;
    daVaoTaiKhoanLanDau: boolean; 
    coDeTu: boolean;
    auth_id: number;
  };
}

interface BalanceWeb {
  vangNapTuWeb: { 
    low: number;
    high: number;
    unsigned: boolean;
  };
  ngocNapTuWeb: { 
    low: number;
    high: number;
    unsigned: boolean;
  };
}

interface PayInfo {
  pay: {
    id: number;
    userId: number;
    tien: string;
    status: string;
    updatedAt: string;
  };
  message: string;
}

export default function PlayerManagement() {
  const [token, setToken] = useState("");
  const [onlinePlayers, setOnlinePlayers] = useState<string[]>([]);
  const [searchPlayerId, setSearchPlayerId] = useState("");
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile | null>(null);
  const [balanceWeb, setBalanceWeb] = useState<BalanceWeb | null>(null);
  const [userItems, setUserItems] = useState<any[]>([]);
  const [payInfo, setPayInfo] = useState<PayInfo | null>(null);
  const [loading, setLoading] = useState(false);
  
  
  const [emailForm, setEmailForm] = useState({
    who: "",
    title: "",
    content: ""
  });

  useEffect(() => {
    const stored = localStorage.getItem("currentUser");
    if (stored) {
      const user = JSON.parse(stored);
      const userToken = user.access_token || "";
      setToken(userToken);
      
      if (userToken) {
        fetchOnlinePlayers(userToken);
      }
    }
  }, []);

  const fetchOnlinePlayers = async (userToken: string) => {
    try {
      setLoading(true);
      const response = await playerManagementService.UserOnlineVer2(userToken);
      
      if (response.success && response.data.users) {
        setOnlinePlayers(response.data.users);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải danh sách người chơi');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchPlayer = async () => {
    const playerId = parseInt(searchPlayerId);
    
    if (!playerId || isNaN(playerId)) {
      toast.error('Vui lòng nhập Player ID hợp lệ!');
      return;
    }

    setCurrentPlayerId(playerId);
    // Reset các state cũ
    setPlayerProfile(null);
    setBalanceWeb(null);
    setUserItems([]);
    setPayInfo(null);

    // Tự động tải thông tin
    await fetchPlayerProfile(playerId);
    await fetchBalanceWeb(playerId);
    await fetchUserItems(playerId);
    await fetchPayInfo(playerId);
  };

  const fetchPlayerProfile = async (playerId: number) => {
    try {
      setLoading(true);
      const response = await playerManagementService.profile(token, playerId);
      console.log(response);
      if (response.success) {
        setPlayerProfile(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin người chơi');
    } finally {
      setLoading(false);
    }
  };

  const fetchBalanceWeb = async (playerId: number) => {
    try {
      setLoading(true);
      const response = await playerManagementService.balanceWeb(token, playerId);
      if (response.success) {
        setBalanceWeb(response.data);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải số dư web');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserItems = async (playerId: number) => {
    try {
      setLoading(true);
      const response = await playerManagementService.userItems(token, playerId);
      if (response.success) {
        setUserItems(response.data.items || []);
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải danh sách vật phẩm');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayInfo = async (playerId: number) => {
    try {
      setLoading(true);
      const response = await playerManagementService.pay(token, playerId);
      if (response.success) {
        setPayInfo(response.data);
        toast.success('Lấy dữ liệu thành công');
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể tải thông tin thanh toán');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAllInfo = async () => {
    if (!currentPlayerId) {
      toast.error('Vui lòng tìm kiếm người chơi trước!');
      return;
    }
    
    await fetchPlayerProfile(currentPlayerId);
    await fetchBalanceWeb(currentPlayerId);
    await fetchUserItems(currentPlayerId);
    await fetchPayInfo(currentPlayerId);
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.who || !emailForm.title || !emailForm.content) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      setLoading(true);
      const response = await playerManagementService.sendEmail(
        token,
        emailForm.who,
        emailForm.title,
        emailForm.content
      );
      
      if (response.success) {
        toast.success('Gửi email thành công!');
        setEmailForm({ who: "", title: "", content: "" });
      }
    } catch (error: any) {
      toast.error(error.message || 'Không thể gửi email');
    } finally {
      setLoading(false);
    }
  };

 

   const formatValue = (value: any): number => {
    if (typeof value === 'number') return value;
    if (value && typeof value === 'object' && 'low' in value) {
      const low = value.low || 0;
      const high = value.high || 0;
      // Xử lý đúng cho số 64-bit: (high << 32) + (low & 0xFFFFFFFF)
      return (high * Math.pow(2, 32)) + (low >>> 0); // >>> 0 converts to unsigned
    }
    return value;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Quản Lý Người Chơi</h1>

      <div className="bg-[#FFFFF] rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">Tìm Kiếm Người Chơi</h2>
        <div className="flex gap-3">
          <input
            type="number"
            value={searchPlayerId}
            onChange={(e) => setSearchPlayerId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchPlayer()}
            className="flex-1 px-4 py-3 rounded-lg border-2 border-black focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Nhập Player ID (ví dụ: 3)"
          />
          <button
            onClick={handleSearchPlayer}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Đang tìm...' : 'Tìm Kiếm'}
          </button>
        </div>
      </div>

      {/* Current Player Info Banner */}
      {currentPlayerId && playerProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang xem thông tin của</p>
              <h2 className="text-2xl font-bold text-gray-800">Player ID: {currentPlayerId}</h2>
              <p className="text-gray-600 mt-1">Map: {playerProfile.user.mapHienTai}</p>
            </div>
            <button
              onClick={() => {
                setCurrentPlayerId(null);
                setSearchPlayerId("");
                setPlayerProfile(null);
                setBalanceWeb(null);
                setUserItems([]);
                setPayInfo(null);
              }}
              className="bg-red-100 hover:bg-red-200 text-red-600 px-4 py-2 rounded-lg transition-colors"
            >
              Xóa Kết Quả
            </button>
          </div>
        </div>
      )}


      {/* Player Profile */}
      {playerProfile && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Thông Tin Người Chơi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">ID</p>
              <p className="text-xl font-bold text-gray-800">{playerProfile.user.id}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-gray-600 mb-1">💰 Vàng</p>
              <p className="text-xl font-bold text-yellow-600">
                {formatValue(playerProfile.user.vang).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">💎 Ngọc</p>
              <p className="text-xl font-bold text-green-600">
                {formatValue(playerProfile.user.ngoc).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-gray-600 mb-1">⚡ Sức Mạnh</p>
              <p className="text-xl font-bold text-red-600">
                {formatValue(playerProfile.user.sucManh).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-1">🗺️ Map Hiện Tại</p>
              <p className="text-xl font-bold text-purple-600">{playerProfile.user.mapHienTai}</p>
            </div>
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <p className="text-sm text-gray-600 mb-1">💰 Vàng Nạp Web</p>
              <p className="text-xl font-bold text-indigo-600">
                {formatValue(playerProfile.user.vangNapTuWeb).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <p className="text-sm text-gray-600 mb-1">💎 Ngọc Nạp Web</p>
              <p className="text-xl font-bold text-teal-600">
                {formatValue(playerProfile.user.ngocNapTuWeb).toLocaleString()}
              </p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-gray-600 mb-1">🔑 Auth ID</p>
              <p className="text-xl font-bold text-pink-600">{playerProfile.user.auth_id}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">📍 Tọa độ</p>
              <p className="text-xl font-bold text-blue-600">X: {playerProfile.user.x}, Y: {playerProfile.user.y}</p>
            </div>
          </div>
        </div>
      )}

        {/* Balance Web */}
        {balanceWeb && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Số Dư Web</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border-2 border-yellow-300">
                <p className="text-sm text-gray-600 mb-2">💰 Vàng Nạp Từ Web</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {formatValue(balanceWeb.vangNapTuWeb)?.toLocaleString() || 0}
                </p>
              </div>
              <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border-2 border-green-300">
                <p className="text-sm text-gray-600 mb-2">💎 Ngọc Nạp Từ Web</p>
                <p className="text-3xl font-bold text-green-600">
                  {formatValue(balanceWeb.ngocNapTuWeb)?.toLocaleString() || 0}
                </p>
              </div>
            </div>
          </div>
        )}

    
      {/* User Items */}
      {userItems.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            🎒 Vật Phẩm ({userItems.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thông Tin
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userItems.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <pre className="whitespace-pre-wrap text-xs bg-gray-50 p-3 rounded">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pay Info */}
      {payInfo && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">💳 Thông Tin Thanh Toán</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">ID Thanh Toán</p>
              <p className="text-xl font-bold text-gray-800">{payInfo.pay.id}</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-600 mb-1">💵 Số Tiền</p>
              <p className="text-xl font-bold text-blue-600">
                {parseInt(payInfo.pay.tien).toLocaleString()} VNĐ
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-sm text-gray-600 mb-1">📊 Trạng Thái</p>
              <p className={`text-xl font-bold ${
                payInfo.pay.status === 'open' ? 'text-green-600' : 'text-gray-600'
              }`}>
                {payInfo.pay.status === 'open' ? '✅ Đang mở' : payInfo.pay.status}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 col-span-1 md:col-span-2 lg:col-span-3">
              <p className="text-sm text-gray-600 mb-1">🕐 Cập Nhật Lúc</p>
              <p className="text-lg font-semibold text-purple-600">
                {new Date(payInfo.pay.updatedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Online Players Section - Optional Reference */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            👥 Người Chơi Online ({onlinePlayers.length})
          </h2>
          <button
            onClick={() => fetchOnlinePlayers(token)}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang tải...' : '🔄 Làm mới'}
          </button>
        </div>
        
        {onlinePlayers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Không có người chơi nào đang online</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {onlinePlayers.map((username, index) => (
              <div
                key={index}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-700">{username}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send Email Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">📧 Gửi Email</h2>
        <form onSubmit={handleSendEmail} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Người Nhận
            </label>
            <input
              type="text"
              value={emailForm.who}
              onChange={(e) => setEmailForm({ ...emailForm, who: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tên người nhận"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu Đề
            </label>
            <input
              type="text"
              value={emailForm.title}
              onChange={(e) => setEmailForm({ ...emailForm, title: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nội Dung
            </label>
            <textarea
              value={emailForm.content}
              onChange={(e) => setEmailForm({ ...emailForm, content: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập nội dung email"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {loading ? '⏳ Đang gửi...' : '📤 Gửi Email'}
          </button>
        </form>
      </div>
    </div>
  );
}