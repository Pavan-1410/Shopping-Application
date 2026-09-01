// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWgIB4fKEKGRou0tplFFHAmRNn75lCvg4",
  authDomain: "ecommerce-app-99615.firebaseapp.com",
  projectId: "ecommerce-app-99615",
  storageBucket: "ecommerce-app-99615.firebasestorage.app",
  messagingSenderId: "819144238395",
  appId: "1:819144238395:web:de1ac211213653e043c31e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// it exports the initialized app
export const auth = getAuth(app)
// it provides the authenticator to user
export const googleProvider = new GoogleAuthProvider();


// this enabels the user to every time select the account while logging in 
// googleProvider.setCustomParameters({
//   prompt: "select_account",
// });