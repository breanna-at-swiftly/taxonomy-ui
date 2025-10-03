import React, { createContext, useContext } from "react";

// Define the shape of our stubbed auth context
interface StubAuthContextType {
  isAuthenticated: boolean;
  getAccessTokenSilently: () => Promise<string>;
}

// Create the context with default values
const StubAuthContext = createContext<StubAuthContextType>({
  isAuthenticated: false,
  getAccessTokenSilently: async () => "",
});

// Create a custom hook for easy access to the context
export const useStubAuth = () => useContext(StubAuthContext);

// Create the provider component
export const StubAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const value = {
    isAuthenticated: true, // We are always authenticated in our stub
    getAccessTokenSilently: async (): Promise<string> => {
      const token = import.meta.env.VITE_STUB_JWT;
      console.log(
        "StubAuthProvider: Reading token from .env",
        token ? "Token Found" : "Token NOT Found!"
      );
      if (!token) {
        console.error("VITE_STUB_JWT is not set in your .env file!");
        return "";
      }
      // The token in .env includes "Bearer ", so we don't add it here.
      // If it didn't, you would return `Bearer ${token}`.
      return token;
    },
  };

  return (
    <StubAuthContext.Provider value={value}>
      {children}
    </StubAuthContext.Provider>
  );
};
