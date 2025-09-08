import React from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { ReactQueryDevtools } from "react-query/devtools";
import { QueryClient, QueryClientProvider } from "react-query";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { Provider as ReduxProvider } from "react-redux";
import ReactGA from "react-ga4";

import { SwiftlykitThemeProvider, theme } from "swiftlykit";
import { Global, css } from "@emotion/react";
import { HelmetProvider } from "react-helmet-async";
import {
  NotificationsContextProvider,
  BannerContextProvider,
} from "@/contexts";
import { useRuntimeConf } from "@/hooks";
import { Snackbar } from "@/components/feedback";
import { store } from "@/store";
import ThemeCustomization from "@/themes";
import { AppRoutes } from "./AppRoutes";
// css file for react sortable tree
import "@nosferatu500/react-sortable-tree/style.css";

const global = css`
  // Used by Ad Tags
  .prism-code {
    overflow-x: scroll;
  }
  // Used by paragraph block, web content pages
  .wmde-markdown * {
    font-weight: normal;
  }
  .wmde-markdown p {
    line-height: 1.3 !important;
    margin-bottom: 16px !important;
  }
`;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 60 * 1000,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: 3,
    },
  },
});
const params = new URLSearchParams(window.location.search);

const Authorization = ({ children }: { children: React.ReactElement[] }) => {
  const navigate = useNavigate();

  const {
    REACT_APP_AUTH0_CLIENT_ID,
    REACT_APP_AUTH0_DOMAIN,
    REACT_APP_AUTH0_AUDIENCE,
  } = useRuntimeConf();

  // Used for switching orgs and (probably) deep links
  const onAuth0Redirect = (appState?: AppState | undefined) => {
    if (appState?.returnTo !== undefined) {
      navigate(appState.returnTo);
    }
  };

  return (
    <Auth0Provider
      clientId={REACT_APP_AUTH0_CLIENT_ID}
      domain={REACT_APP_AUTH0_DOMAIN}
      redirectUri={window.location.origin}
      audience={REACT_APP_AUTH0_AUDIENCE}
      useRefreshTokens={true}
      invitation={(params.has("ticket") && params.get("ticket")) || undefined}
      onRedirectCallback={onAuth0Redirect}
      cacheLocation={"localstorage"}
    >
      {children}
    </Auth0Provider>
  );
};

export function App({ config }: any) {
  config.GA_KEY && ReactGA.initialize(config.GA_KEY);

  return (
    <ReduxProvider store={store}>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          {/*for the moment we will use the swiftlykit provided theme*/}
          {/*but will define this locally later*/}
          <SwiftlykitThemeProvider theme={theme}>
            <ThemeCustomization>
              <React.StrictMode>
                <Global styles={global} />
                <CssBaseline />
                <BrowserRouter>
                  <Authorization>
                    <NotificationsContextProvider>
                      <BannerContextProvider>
                        <AppRoutes config={config} />
                      </BannerContextProvider>
                    </NotificationsContextProvider>
                    <Snackbar />
                  </Authorization>
                </BrowserRouter>
                <ReactQueryDevtools initialIsOpen={false} />
              </React.StrictMode>
            </ThemeCustomization>
          </SwiftlykitThemeProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ReduxProvider>
  );
}
