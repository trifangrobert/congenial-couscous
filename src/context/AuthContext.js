import React, { createContext, useContext, useEffect, useState } from "react";
import app from "../firebase";
import { GoogleAuthProvider } from "firebase/auth";
import { GithubAuthProvider } from "firebase/auth";

export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);

  const signup = (email, password) => {
    return app.createUserWithEmailAndPassword(email, password);
  };

  const logIn = (email, password) => {
    return app.signInWithEmailAndPassword(email, password);
  };

  const logOut = () => {
    return app.signOut();
  };

  const resetPassword = (email) => {
    return app.sendPasswordResetEmail(email);
  };

  const signInWithGoogle = () => {
    const provider = new GoogleAuthProvider();
    return app.signInWithPopup(provider);
  };

  const signInWithGithub = () => {
    const provider = new GithubAuthProvider();
    return app.signInWithPopup(provider);
  };

  const updateEmail = (email) => {
    return currentUser.updateEmail(email);
  };

  const updatePassword = (password) => {
    return currentUser.updatePassword(password);
  };


  const value = {
    currentUser,
    signup,
    logOut,
    logIn,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;