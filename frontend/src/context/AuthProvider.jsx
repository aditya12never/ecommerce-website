import { useState } from "react";

import AuthContext from "./AuthContext";

function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {

    const savedUser =
      localStorage.getItem("shopzoneUser");

    if (!savedUser) {
      return null;
    }

    try {

      return JSON.parse(savedUser);

    } catch (error) {

      console.error(
        "Invalid saved user data:",
        error
      );

      localStorage.removeItem("shopzoneUser");

      return null;
    }
  });

  const [token, setToken] = useState(() => {

    return localStorage.getItem(
      "shopzoneToken"
    );
  });

  const login = (userData, jwtToken) => {

    localStorage.setItem(
      "shopzoneUser",
      JSON.stringify(userData)
    );

    localStorage.setItem(
      "shopzoneToken",
      jwtToken
    );

    setUser(userData);
    setToken(jwtToken);
  };

  const logout = () => {

    localStorage.removeItem(
      "shopzoneUser"
    );

    localStorage.removeItem(
      "shopzoneToken"
    );

    setUser(null);
    setToken(null);
  };

  const isLoggedIn =
    user !== null &&
    token !== null;

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;