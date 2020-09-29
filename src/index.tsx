import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { queryCache, ReactQueryCacheProvider } from "react-query";
import { SnackbarProvider } from "notistack";
import { COMMON_APP_CONFIG } from "./constants/common";

ReactDOM.render(
  <React.StrictMode>
    <ReactQueryCacheProvider queryCache={queryCache}>
      <SnackbarProvider
        maxSnack={COMMON_APP_CONFIG.maxSnack}
        hideIconVariant={true}
      >
        <App />
      </SnackbarProvider>
    </ReactQueryCacheProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
