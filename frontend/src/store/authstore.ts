import { create } from "zustand";

// as we are using the typescripe we need to define types it will work without this but for typesafety and auto correction we are using this
type Role = "user" | "admin";

interface AuthUser {    // it represent the user which is present in data base
  user_id: string;
  firebase_uid: string;
  name: string;
  email: string;
  phone: string | null;
  role: "user" | "admin";
  created_at: string;
}

// this represent the complete zustend state 
interface AuthState {
  user: AuthUser | null;        // it connects the user with interface
  role: Role | null;            // same for role it connected and checks if selected role is as per given values
  token: string | null
  isAuthenticated: boolean;
  isLoading: boolean;

  

  setAuth: (user: AuthUser, role: Role, token:string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

// real store starts here

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,


  setAuth: (user, role,token) =>
    set({
      user,
      role,
      token,
      isAuthenticated: true,
    }),
    

  logout: () =>
    set({
      user: null,
      role: null,
      token: null,
      isAuthenticated: false,
    }),
    setLoading: (isLoading) =>
    set({
      isLoading,
    }),
}));

export default useAuthStore;