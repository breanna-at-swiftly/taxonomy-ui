import { Auth0Provider } from "@auth0/auth0-react";

const Authorization = ({ children }: { children: React.ReactNode }) => (
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{
      audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      redirect_uri: window.location.origin,
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    {children}
  </Auth0Provider>
);

export default Authorization;
