"use client";
import React, { useState } from "react";
import AdminService from "../services/adminService"; // Giữ nguyên service của bạn
import { useRouter } from "next/navigation";

interface FormData {
  username: string;
  password: string;
}

interface FormErrors {
  username?: string;
  password?: string;
}

function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  
  // State quản lý chế độ Dark/Light (Mặc định là Dark)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const result = await AdminService.login(
        formData.username,
        formData.password
      );

      if (result.success) {
        console.log("✅ Login success:", result.data);

        const sessionData = {
          sessionId: result.data.sessionId,
          username: formData.username,
        };

        localStorage.setItem("currentUser", JSON.stringify(sessionData));
        console.log("💾 Saved session data:", sessionData);

        if (rememberMe) {
          localStorage.setItem("rememberedUsername", formData.username);
        } else {
          localStorage.removeItem("rememberedUsername");
        }

        alert(result.message || "Đăng nhập thành công! Vui lòng nhập OTP.");
        router.push("/otp");
      } else {
        alert(result.error || "Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("❌ Unexpected error:", error);
      alert("Đã xảy ra lỗi không mong đợi!");
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa styles động dựa trên mode
  const themeStyles = {
    // Overlay nền: Dark thì tối đi, Light thì phủ trắng mờ
    backgroundOverlay: isDarkMode
      ? "bg-black/40" 
      : "bg-white/40 backdrop-blur-md",

    // Card Container
    card: isDarkMode 
      ? "bg-white/[0.08] border-white/15 shadow-[0_8px_32px_rgba(124,58,237,0.3)] text-white" 
      : "bg-white/80 border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.1)] text-gray-800",
    
    // Texts
    titleGradient: isDarkMode 
      ? "from-amber-400 via-orange-500 to-pink-500" 
      : "from-blue-600 via-indigo-600 to-purple-600",
    titleSub: isDarkMode ? "text-white/80" : "text-gray-600",
    
    // Inputs
    inputWrapper: isDarkMode ? "text-white/60" : "text-gray-500",
    input: isDarkMode
      ? "bg-white/[0.08] border-white/20 text-white placeholder:text-white/50 focus:bg-white/[0.12] focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:shadow-lg",
    
    // Controls
    checkboxLabel: isDarkMode ? "text-white/80 hover:text-white" : "text-gray-600 hover:text-gray-900",
    forgotPassBtn: isDarkMode ? "text-cyan-500 hover:text-amber-400" : "text-blue-600 hover:text-indigo-700",
    
    // Submit Button
    submitBtn: isDarkMode
      ? "bg-gradient-to-br from-orange-500 to-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)]"
      : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-500/30",
      
    // Footer & Toggle
    footerText: isDarkMode ? "text-white/50" : "text-gray-600",
    toggleBtn: isDarkMode ? "text-yellow-400 hover:bg-white/10" : "text-indigo-600 hover:bg-gray-200",
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. Lớp hình nền gốc (Luôn hiển thị) */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/br.jpg')" }}
      />

      {/* 2. Lớp Overlay thay đổi theo Dark/Light Mode */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-700 ease-in-out ${themeStyles.backgroundOverlay}`}
      />

      {/* Container Glassmorphism */}
      <div
        className={`backdrop-blur-2xl border rounded-3xl p-8 w-full max-w-[420px] relative z-10 transition-all duration-500 hover:scale-[1.01] sm:p-6 sm:mx-4 ${themeStyles.card}`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        }}
      >
        {/* Dark Mode Toggle Button */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`absolute top-4 right-4 p-2 rounded-full transition-all duration-300 transform hover:rotate-12 ${themeStyles.toggleBtn}`}
          title={isDarkMode ? "Chuyển sang nền sáng" : "Chuyển sang nền tối"}
        >
          {isDarkMode ? (
            // Sun Icon
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"></circle>
              <path d="M12 2v2"></path>
              <path d="M12 20v2"></path>
              <path d="m4.93 4.93 1.41 1.41"></path>
              <path d="m17.66 17.66 1.41 1.41"></path>
              <path d="M2 12h2"></path>
              <path d="M20 12h2"></path>
              <path d="m6.34 17.66-1.41 1.41"></path>
              <path d="m19.07 4.93-1.41 1.41"></path>
            </svg>
          ) : (
            // Moon Icon
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
            </svg>
          )}
        </button>

        <div className="text-center mb-8">
          <h2 className={`text-[2.5rem] sm:text-[2rem] font-extrabold bg-gradient-to-br bg-clip-text text-transparent mb-2 animate-[titleGlow_3s_ease-in-out_infinite_alternate] ${themeStyles.titleGradient}`}>
            Admin Portal
          </h2>
          <p className={`${themeStyles.titleSub} text-base font-medium transition-colors duration-300`}>
            Quản trị viên đăng nhập
          </p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none transition-colors duration-300 ${themeStyles.inputWrapper}`}>
              <i className="text-xl">
                👤
              </i>
            </div>
            <input
              type="text"
              name="username"
              placeholder="Tên đăng nhập"
              value={formData.username}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 border rounded-2xl text-base leading-6 transition-all duration-300 box-border focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${themeStyles.input} ${
                errors.username
                  ? "border-red-600 !shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  : ""
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            {errors.username && (
              <p
                className="mt-2 text-red-600 text-sm font-medium"
                style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.5)" }}
              >
                {errors.username}
              </p>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 z-[2] pointer-events-none transition-colors duration-300 ${themeStyles.inputWrapper}`}>
              <i className="text-xl">
                🔒
              </i>
            </div>
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
              className={`w-full h-14 px-4 pl-12 border rounded-2xl text-base leading-6 transition-all duration-300 box-border focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed ${themeStyles.input} ${
                errors.password
                  ? "border-red-600 !shadow-[0_0_20px_rgba(220,38,38,0.3)]"
                  : ""
              }`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
            {errors.password && (
              <p
                className="mt-2 text-red-600 text-sm font-medium"
                style={{ textShadow: "0 0 10px rgba(220, 38, 38, 0.5)" }}
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Options: Remember Me & Forgot Password */}
          <div className="flex justify-between items-center text-sm">
            <label
              className={`flex items-center cursor-pointer transition-all duration-300 ${themeStyles.checkboxLabel}`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
                className="mr-2 w-4 h-4 accent-cyan-500"
              />
              Ghi nhớ tài khoản
            </label>
            <button
              type="button"
              className={`bg-transparent border-none cursor-pointer text-sm font-semibold transition-all duration-300 ${themeStyles.forgotPassBtn}`}
              style={{
                transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Quên mật khẩu?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-4 sm:py-[14px] border-none rounded-2xl text-white text-[1.1rem] sm:text-base font-bold cursor-pointer flex items-center justify-center gap-2 transition-all duration-[400ms] relative overflow-hidden hover:translate-y-[-2px] hover:scale-[1.02] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:!transform-none ${themeStyles.submitBtn} ${
              loading ? "pointer-events-none" : ""
            }`}
            style={{
              transitionTimingFunction:
                "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
            }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <></>
            )}
            {loading ? "Đang xử lý..." : "Đăng nhập Admin"}
          </button>
        </form>

        {/* Note Footer */}
        <div className={`mt-5 text-center text-xs transition-colors duration-300 ${themeStyles.footerText}`}>
          Hệ thống quản trị - Vui lòng bảo mật thông tin
        </div>
      </div>
    </div>
  );
}

export default Home;