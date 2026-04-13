import { useEffect, useRef, useState } from "react";
import {
  login,
  loginWithGoogle,
  register,
  resendVerificationCode,
  verifyEmail,
} from "../../tasks/services/authApi";

export function useAuthPage(onAuthSuccess) {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  const googleInitializedRef = useRef(false);

  const [mode, setMode] = useState("login");
  const [registerForm, setRegisterForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });
  const [verifyForm, setVerifyForm] = useState({
    email: "",
    code: "",
  });

  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const isLogin = mode === "login";
  const isVerify = mode === "verify";

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  function handleSwitchMode(nextMode) {
    setMode(nextMode);
    setError("");
    setInfo("");
  }

  function handleRegisterFieldChange(event) {
    const { name, value } = event.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleLoginFieldChange(event) {
    const { name, value } = event.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleVerifyFieldChange(event) {
    const { name, value } = event.target;
    setVerifyForm((prev) => ({ ...prev, [name]: value }));
  }

  function startResendCooldown() {
    setResendCooldown(30);
  }

  function isEmail(value = "") {
    return /@/.test(value);
  }

  function isEmailNotVerifiedError(apiError) {
    return (
      apiError?.status === 403 &&
      (apiError?.data?.resendRequired === true ||
        apiError?.data?.error === "Email not verified" ||
        apiError?.message?.toLowerCase().includes("email not verified"))
    );
  }

  function getGooglePromptErrorMessage(reason) {
    const reasonMap = {
      invalid_client: "Google Client ID không hợp lệ.",
      missing_client_id: "Thiếu Google Client ID.",
      unregistered_origin:
        "Domain hiện tại chưa được cấp quyền trong Google Cloud (Authorized JavaScript origins).",
      secure_http_required: "Google Sign-In yêu cầu HTTPS hoặc localhost.",
      browser_not_supported:
        "Trình duyệt hiện tại không hỗ trợ Google Sign-In.",
      opt_out_or_no_session:
        "Không có phiên đăng nhập Google trên trình duyệt hoặc người dùng đã từ chối.",
      suppressed_by_user:
        "Popup Google bị chặn bởi trình duyệt hoặc extension.",
    };

    return (
      reasonMap[reason] ||
      "Không thể hiển thị popup đăng nhập Google. Vui lòng thử lại."
    );
  }

  async function handleEmailNotVerified(flowError, preferredEmail = "") {
    const fallbackIdentifier = preferredEmail?.trim() || "";
    const emailFromError = flowError?.data?.email;
    const email =
      emailFromError || (isEmail(fallbackIdentifier) ? fallbackIdentifier : "");

    setVerifyForm({ email, code: "" });
    setMode("verify");

    if (!email) {
      setInfo("Tài khoản chưa xác thực. Vui lòng nhập email để xác thực.");
      return;
    }

    try {
      await resendVerificationCode(email);
      setInfo("Mã xác thực đã được gửi lại. Vui lòng kiểm tra email của bạn.");
      startResendCooldown();
    } catch (resendError) {
      setError(
        resendError.message ||
          "Không thể gửi lại mã xác thực. Vui lòng thử lại ở nút Gửi lại mã.",
      );
    }
  }

  useEffect(() => {
    if (!googleClientId) {
      return;
    }

    let cancelled = false;

    const handleCredentialResponse = async (credentialResponse) => {
      const idToken = credentialResponse?.credential;

      if (!idToken) {
        setError("Không nhận được thông tin đăng nhập từ Google.");
        return;
      }

      setError("");
      setInfo("");
      setLoading(true);

      try {
        const result = await loginWithGoogle(idToken);
        onAuthSuccess?.(result);
      } catch (googleError) {
        if (isEmailNotVerifiedError(googleError)) {
          await handleEmailNotVerified(googleError, "");
          return;
        }

        setError(googleError.message || "Đăng nhập Google thất bại.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    const initGoogleIdentity = () => {
      if (
        cancelled ||
        googleInitializedRef.current ||
        !window.google?.accounts?.id
      ) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });

      googleInitializedRef.current = true;
      setGoogleReady(true);
    };

    if (window.google?.accounts?.id) {
      initGoogleIdentity();
      return () => {
        cancelled = true;
      };
    }

    const existingScript = document.getElementById("google-identity-services");
    const script = existingScript || document.createElement("script");

    const onLoad = () => initGoogleIdentity();
    const onError = () => {
      if (!cancelled) {
        setError("Không thể tải Google Identity Services.");
      }
    };

    if (!existingScript) {
      script.id = "google-identity-services";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);

    return () => {
      cancelled = true;
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };
  }, [googleClientId, onAuthSuccess]);

  async function handleVerifySubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      await verifyEmail(verifyForm.email, verifyForm.code);
      setInfo("Xác thực email thành công. Bạn có thể đăng nhập ngay.");
      setMode("login");
      setLoginForm((prev) => ({ ...prev, identifier: verifyForm.email }));
      setVerifyForm((prev) => ({ ...prev, code: "" }));
    } catch (verifyError) {
      setError(verifyError.message || "Xác thực email thất bại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleResendCode() {
    if (!verifyForm.email) return;

    setError("");
    setInfo("");
    setLoading(true);

    try {
      await resendVerificationCode(verifyForm.email);
      setInfo("Đã gửi lại mã xác thực. Vui lòng kiểm tra email của bạn.");
      startResendCooldown();
    } catch (resendError) {
      setError(resendError.message || "Không thể gửi lại mã xác thực.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (isLogin) {
        const result = await login(loginForm.identifier, loginForm.password);
        onAuthSuccess?.(result);
      } else {
        await register(
          registerForm.username,
          registerForm.email,
          registerForm.password,
        );

        setLoginForm({
          identifier: registerForm.email,
          password: "",
        });
        setMode("login");
      }
    } catch (submitError) {
      if (isEmailNotVerifiedError(submitError)) {
        const preferredEmail = isLogin
          ? loginForm.identifier
          : registerForm.email;
        await handleEmailNotVerified(submitError, preferredEmail);
        return;
      }

      setError(submitError.message || "Đã xảy ra lỗi.");
    } finally {
      setLoading(false);
    }
  }

  function handleGoogleLogin() {
    if (!googleClientId) {
      setError("Thiếu VITE_GOOGLE_CLIENT_ID");
      return;
    }

    if (!window.google?.accounts?.id || !googleReady) {
      setError("Google Identity Services chưa sẵn sàng. Vui lòng thử lại.");
      return;
    }

    setError("");
    window.google.accounts.id.prompt((notification) => {
      if (notification?.isNotDisplayed?.()) {
        const reason = notification.getNotDisplayedReason?.();
        setError(getGooglePromptErrorMessage(reason));
        return;
      }

      if (notification?.isSkippedMoment?.()) {
        const reason = notification.getSkippedReason?.();
        setError(getGooglePromptErrorMessage(reason));
      }
    });
  }

  return {
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
  };
}
