import "./App.css";
import "./styles/split-pane.css";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { theme } from "./theme/theme";
import { GraphProvider } from "./context/GraphContext";
import Layout from "./components/Layout";
import GraphList from "./components/GraphList"; // Updated import
import GraphEditor from "./components/GraphEditor";
import BannerGraphTest from "./components/BannerGraphTest";
import { Box } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { setupAxiosAuth } from "./services/taxonomyService";

export const App = () => {
  const { isAuthenticated, getAccessTokenSilently, loginWithRedirect } =
    useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      setupAxiosAuth(getAccessTokenSilently);
    }
  }, [isAuthenticated, getAccessTokenSilently]);

  return (
    <div>
      {isAuthenticated ? (
        <BannerGraphTest />
      ) : (
        <div>
          Please log in
          <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      )}
    </div>
  );

  // return (
  //   <ThemeProvider theme={theme}>
  //     <Box sx={{ margin: 0, padding: 0 }}>
  //       <BrowserRouter>
  //         <GraphProvider>
  //           <Routes>
  //             <Route path="/" element={<Layout />}>
  //               <Route index element={<GraphList />} />
  //               <Route path="editor" element={<GraphEditor />} />
  //               {/* ...other routes... */}
  //             </Route>
  //           </Routes>
  //         </GraphProvider>
  //       </BrowserRouter>
  //     </Box>
  //   </ThemeProvider>
  // );
};

export default App;
