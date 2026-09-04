import { ArrowLeft, ShieldCheck, ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";
import { useEffect } from "react";
// firebase imports
import { auth, googleProvider } from "../config/firebase";
//tanstack imports
import { useMutation } from "@tanstack/react-query";
import { getMe ,getAdminMe} from "../api/authApi";
import toast from "react-hot-toast";
import LoadingOverlay from "../components/LoadingOverlay";


const Login = () => {
  const navigate = useNavigate();
  const selectedRole = localStorage.getItem("selectedRole");

  const isAdmin = selectedRole === "admin";


  useEffect(() => {
    if (!selectedRole) {
      navigate("/select-role", { replace: true });
    }
  }, [selectedRole, navigate]);


  const handleBack = () => {
    navigate("/select-role");
  };

  const { mutateAsync: fetchMe, isPending } = useMutation({
  mutationFn: getMe,
});

const { mutateAsync: fetchAdminMe, isPending: isAdminLoading } = useMutation({
  mutationFn: getAdminMe,
});

    const handleGoogleLogin = async () => {
      try {
        console.log("Selected Role:", selectedRole);

        const result = await signInWithPopup(auth, googleProvider);

        const user = result.user;

        // Firebase ID Token
        const token = await user.getIdToken();

      console.log("========== Firebase Login Success ==========");
      console.log("Token:", token);
      console.log("User:", user);
      console.log("Firebase UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Name:", user.displayName);
      console.log("Photo URL:", user.photoURL);
      console.log("Selected Role:", selectedRole);
      console.log("============================================");

      // Call backend /me and /admin/me based on role
      let data;

      if (selectedRole === "admin") {
        data = await fetchAdminMe(token);
      } else {
        data = await fetchMe(token);
      }

      console.log("Backend Response:", data);
      navigate("/home");

    } catch (error:any) {
        console.error("Google login failed:", error);
        if (error.response?.status === 403) {
          toast.error(error.response.data.message);
          navigate("/select-role");
          return;
        }
        toast.error("Login failed. Please try again.");
    }
  };

   const isLoading = isPending || isAdminLoading;
  return (
    <>
    {isLoading && <LoadingOverlay />}
    <div className="min-h-screen bg-linear-to-br from-blue-600 via-blue-500 to-white flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl">

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden ">

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
          <div className="px-7 sm:px-10 pt-8 pb-10 text-center">

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

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="mt-8 w-full flex items-center justify-center gap-3
                bg-white border-2 border-gray-200
                hover:border-blue-500 hover:shadow-md
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
            <p className="mt-6 text-xs text-gray-400 leading-relaxed">
              By continuing, you agree to our terms and
              acknowledge our privacy policy.
            </p>
          </div>

          {/* Footer */}


        </div>
      </div>
    </div>
    </>
  );
};

export default Login;