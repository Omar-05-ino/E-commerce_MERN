/* eslint-disable @typescript-eslint/no-explicit-any */
import { type FC, type PropsWithChildren, useState } from "react";
import { AuthContext } from "./AuthContext";
import { beasURL } from "../../constantes/beasURL";

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(() =>
    localStorage.getItem("username"),
  );
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token"),
  );

  const [orders, setOrders] = useState<any>([]);

  const login = (username: string, token: string) => {
    setUsername(username);
    setToken(token);
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    setUsername(null);
    setToken(null);
  };

  const isAuthenticated = !!token;

  const getMyOrders = async () => {
    const respons = await fetch(`${beasURL}/user/order`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!respons.ok) return;

    const data = await respons.json();
    setOrders(data);
  };

  return (
    <AuthContext.Provider
      value={{
        username,
        token,
        isAuthenticated,
        orders,
        login,
        logout,
        getMyOrders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
