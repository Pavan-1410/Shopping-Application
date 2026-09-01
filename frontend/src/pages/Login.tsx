import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      const user = result.user;

      const token = await user.getIdToken();        // is the the firebase builtin proofe the you are verified

      console.log("token", token);
      console.log("User:", user);
      console.log("Firebase UID:", user.uid);
      console.log("Email:", user.email);
      console.log("Name:", user.displayName);
    } catch (error) {
      console.error("Google login failed:", error);
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
};

export default Login;