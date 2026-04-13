import { useAuthPage } from "./hooks/useAuthPage";

function AuthPage({ onAuthSuccess }) {
  const {
    isLogin,
    isVerify,
    registerForm,
    loginForm,
    verifyForm,
    error,
    info,
    loading,
    googleReady,
    resendCooldown,
    handleSwitchMode,
    handleRegisterFieldChange,
    handleLoginFieldChange,
    handleVerifyFieldChange,
    handleVerifySubmit,
    handleResendCode,
    handleSubmit,
    handleGoogleLogin,
  } = useAuthPage(onAuthSuccess);

  return (
    <div className="min-h-screen bg-white flex items-stretch text-slate-900">
      <div className="hidden md:flex md:w-3/5 bg-brand-soft items-center justify-center p-12">
        <div className="max-w-md text-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/5465/5465709.png"
            alt="App logo"
            className="w-24 h-24 mx-auto mb-6"
          />
          <h1 className="text-5xl font-bold text-slate-900 mb-3">My Tasks</h1>
          <p className="text-slate-600 text-lg">
            Organize your day, track your goals, and focus on what matters.
          </p>
        </div>
      </div>

      <div className="w-full md:w-2/5 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-lg p-6 md:p-8">
          {!isVerify && (
            <div className="flex gap-2 mb-6 bg-slate-100 rounded-xl p-1">
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  isLogin ? "bg-brand text-white" : "text-slate-600"
                }`}
                onClick={() => handleSwitchMode("login")}
              >
                Đăng nhập
              </button>
              <button
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                  !isLogin ? "bg-brand text-white" : "text-slate-600"
                }`}
                onClick={() => handleSwitchMode("register")}
              >
                Đăng ký
              </button>
            </div>
          )}

          {isVerify && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Xác thực email
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Nhập mã xác thực đã gửi đến email của bạn.
              </p>
            </div>
          )}

          <form
            className="space-y-4"
            onSubmit={isVerify ? handleVerifySubmit : handleSubmit}
          >
            {isVerify ? (
              <>
                <input
                  name="email"
                  value={verifyForm.email}
                  onChange={handleVerifyFieldChange}
                  placeholder="Email"
                  className="w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-slate-700 outline-none"
                />
                <input
                  name="code"
                  value={verifyForm.code}
                  onChange={handleVerifyFieldChange}
                  placeholder="Mã xác thực"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </>
            ) : isLogin ? (
              <>
                <input
                  name="identifier"
                  value={loginForm.identifier}
                  onChange={handleLoginFieldChange}
                  placeholder="Email hoặc username"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={loginForm.password}
                  onChange={handleLoginFieldChange}
                  placeholder="Password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </>
            ) : (
              <>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterFieldChange}
                  placeholder="Email"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
                <input
                  name="username"
                  value={registerForm.username}
                  onChange={handleRegisterFieldChange}
                  placeholder="Username"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={registerForm.password}
                  onChange={handleRegisterFieldChange}
                  placeholder="Password"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:ring-2 focus:ring-brand"
                  required
                />
              </>
            )}

            {info && <p className="text-sm text-emerald-600">{info}</p>}

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-brand hover:bg-brand-hover text-white font-semibold transition"
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : isVerify
                  ? "Xác thực"
                  : isLogin
                    ? "Đăng nhập"
                    : "Tạo tài khoản"}
            </button>

            {isVerify && (
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  className="text-sm text-brand hover:underline disabled:text-slate-400 disabled:no-underline"
                  onClick={handleResendCode}
                  disabled={loading || resendCooldown > 0}
                >
                  {resendCooldown > 0
                    ? `Gửi lại mã sau ${resendCooldown}s`
                    : "Gửi lại mã"}
                </button>
                <button
                  type="button"
                  className="text-sm text-slate-500 hover:underline"
                  onClick={() => handleSwitchMode("login")}
                  disabled={loading}
                >
                  Quay lại đăng nhập
                </button>
              </div>
            )}
          </form>

          {!isVerify && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs text-slate-400">Hoặc</span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <button
                type="button"
                className="w-full border border-slate-300 bg-white py-2.5 rounded-lg flex items-center justify-center gap-2 text-slate-700 hover:bg-slate-50 transition"
                onClick={handleGoogleLogin}
                disabled={loading || !googleReady}
              >
                <img
                  src="https://cdn-icons-png.flaticon.com/512/300/300221.png"
                  alt="Google"
                  className="w-5 h-5"
                />
                Đăng nhập bằng Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
