import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { GoogleOAuthProvider } from "@react-oauth/google";

import { Provider } from "react-redux";
import Store from "./redux/store.jsx";

import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <BrowserRouter>
      <HelmetProvider>
        <GoogleOAuthProvider clientId="376060240227-15io4m0mkte4i7o7p28l39i5186do9vu.apps.googleusercontent.com">
          <StrictMode>
            <App />
          </StrictMode>
        </GoogleOAuthProvider>
      </HelmetProvider>
    </BrowserRouter>
  </Provider>
);