import {
  ArrowLeft,
  ShieldCheck,
  ShoppingBag,
  Mail,
  Lock,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { useEffect, useState } from "react";

// firebase imports
import { auth, googleProvider } from "../config/firebase";

// tanstack imports
import { useMutation } from "@tanstack/react-query";

import { getMe, getAdminMe } from "../api/authApi";

import toast from "react-hot-toast";

import LoadingOverlay from "../components/LoadingOverlay";

const Login = () => {
  const navigate = useNavigate();

  const selectedRole = localStorage.getItem("selectedRole");
  const isAdmin = selectedRole === "admin";

  // Email and password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Firebase login loading state
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    if (!selectedRole) {
      navigate("/select-role", { replace: true });
    }
  }, [selectedRole, navigate]);

  const handleBack = () => {
    navigate("/select-role");
  };

  // User /me mutation
  const { mutateAsync: fetchMe, isPending } = useMutation({
    mutationFn: getMe,
  });

  // Admin /admin/me mutation
  const {
    mutateAsync: fetchAdminMe,
    isPending: isAdminLoading,
  } = useMutation({
    mutationFn: getAdminMe,
  });

  // ==========================================
  // GOOGLE LOGIN
  // ==========================================
  const handleGoogleLogin = async () => {
    try {
      setIsLoggingIn(true);

      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      // Firebase ID Token
      const token = await user.getIdToken();

      // Call backend based on selected role
      if (selectedRole === "admin") {
        await fetchAdminMe(token);
      } else {
        await fetchMe(token);
      }

      navigate("/home");
    } catch (error: any) {
      console.error("Google login failed:", error);

      if (error.response?.status === 403) {
        toast.error(
          error.response.data.message || "You are not authorized."
        );
        navigate("/select-role");
        return;
      }

      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ==========================================
  // EMAIL / PASSWORD LOGIN
  // ==========================================
  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    // Basic validation
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!password) {
      toast.error("Please enter your password.");
      return;
    }

    try {
      setIsLoggingIn(true);

      // Login with Firebase Email & Password
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      const user = result.user;

      // Get Firebase ID Token
      const token = await user.getIdToken();

      // Call the SAME backend APIs used by Google login
      if (selectedRole === "admin") {
        await fetchAdminMe(token);
      } else {
        await fetchMe(token);
      }

      toast.success("Login successful!");

      navigate("/home");
    } catch (error: any) {
      console.error("Email login failed:", error);

      // Firebase errors
      switch (error.code) {
        case "auth/invalid-email":
          toast.error("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          toast.error("No account found with this email.");
          break;

        case "auth/wrong-password":
          toast.error("Incorrect password.");
          break;

        case "auth/invalid-credential":
          toast.error("Invalid email or password.");
          break;

        case "auth/user-disabled":
          toast.error("This account has been disabled.");
          break;

        case "auth/too-many-requests":
          toast.error(
            "Too many login attempts. Please try again later."
          );
          break;

        default:
          // Backend 403
          if (error.response?.status === 403) {
            toast.error(
              error.response.data.message ||
                "You are not authorized."
            );

            navigate("/select-role");
            return;
          }

          toast.error("Login failed. Please try again.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const isLoading =
    isPending || isAdminLoading || isLoggingIn;

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-500 to-white flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-xl">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Back Button */}
            <div className="px-6 pt-8">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft size={18} />

                <span className="text-sm font-medium">
                  Change role
                </span>
              </button>
            </div>

            {/* Login Content */}
            <div className="px-7 sm:px-10 pt-8 pb-10">
              {/* Icon */}
              <div
                className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
                  isAdmin ? "bg-yellow-100" : "bg-blue-100"
                }`}
              >
                {isAdmin ? (
                  <ShieldCheck
                    size={32}
                    className="text-yellow-600"
                  />
                ) : (
                  <ShoppingBag
                    size={32}
                    className="text-blue-600"
                  />
                )}
              </div>

              {/* Heading */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome Back
                </h1>

                <p className="mt-3 text-gray-500">
                  Continue as{" "}
                  <span
                    className={`font-semibold ${
                      isAdmin
                        ? "text-yellow-600"
                        : "text-blue-600"
                    }`}
                  >
                    {isAdmin ? "Admin" : "User"}
                  </span>
                </p>

                {/* Role Badge */}
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-200">
                  {isAdmin ? (
                    <ShieldCheck
                      size={17}
                      className="text-yellow-600"
                    />
                  ) : (
                    <ShoppingBag
                      size={17}
                      className="text-blue-600"
                    />
                  )}

                  <span className="text-sm font-medium text-gray-700">
                    {isAdmin
                      ? "Administrator"
                      : "Shopping Account"}
                  </span>
                </div>
              </div>

              {/* ==========================================
                  EMAIL / PASSWORD FORM
                  ========================================== */}
              <form
                onSubmit={handleEmailLogin}
                className="mt-8 space-y-4"
              >
                {/* Email */}
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email
                  </label>

                  <div className="relative">
                    <Mail
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="text-left">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <Lock
                      size={19}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full border-2 border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-gray-700 outline-none transition-all focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />
                  </div>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-xl px-5 py-3.5 text-white font-semibold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-100"
                >
                  Login
                </button>
              </form>

              {/* OR Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="h-px bg-gray-200 flex-1" />

                <span className="text-sm text-gray-400 font-medium">
                  OR
                </span>

                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* ==========================================
                  GOOGLE LOGIN
                  ========================================== */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3
                  bg-white border-2 border-gray-200
                  hover:border-blue-500 hover:shadow-md
                  disabled:bg-gray-50 disabled:cursor-not-allowed
                  rounded-xl px-5 py-3.5
                  text-gray-700 font-semibold
                  transition-all duration-200
                  focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                {/* Google Icon */}
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M21.35 12.27c0-.79-.07-1.55-.2-2.27H12v4.3h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.42Z"
                    fill="#4285F4"
                  />

                  <path
                    d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.7-1.72-5.47-4.03H3.29v2.53A9.75 9.75 0 0 0 12 21.5Z"
                    fill="#34A853"
                  />

                  <path
                    d="M6.53 13.58A5.86 5.86 0 0 1 6.22 12c0-.55.1-1.09.31-1.58V7.89H3.29A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.05 1.04 4.11l3.24-2.53Z"
                    fill="#FBBC05"
                  />

                  <path
                    d="M12 6.39c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.84 3.49 14.63 2.5 12 2.5a9.75 9.75 0 0 0-8.71 5.39l3.24 2.53C7.3 8.11 9.46 6.39 12 6.39Z"
                    fill="#EA4335"
                  />
                </svg>

                Continue with Google
              </button>

              {/* Information */}
              <p className="mt-6 text-center text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to our terms and
                acknowledge our privacy policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;