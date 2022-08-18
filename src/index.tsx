import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { loadState, saveState } from "@src/utils/localStorage";
import { RootStore } from "@stores";
import { autorun } from "mobx";
import { storesContext } from "@stores/useStores";
import { BrowserRouter as Router } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";

import dayjs from "dayjs";

const relativeTime = require("dayjs/plugin/relativeTime");
const updateLocale = require("dayjs/plugin/updateLocale");
const weekday = require("dayjs/plugin/weekday");
const utc = require("dayjs/plugin/utc");
const timezone = require("dayjs/plugin/timezone"); // dependent on utc plugin

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(updateLocale);
dayjs.extend(weekday);
(dayjs as any).updateLocale("en", {
  relativeTime: {
    future: "%s",
    past: "%s ago",
    s: "a %d seconds",
    m: "a %d minutes",
    mm: "%d minutes",
    h: "an hour",
    hh: "%d hours",
    d: "a day",
    dd: "%d days",
    M: "a month",
    MM: "%d months",
    y: "a year",
    yy: "%d years",
  },
});

const initState = loadState();

const mobxStore = new RootStore(initState);

autorun(
  () => {
    console.log(mobxStore);
    saveState(mobxStore.serialize());
  },
  { delay: 1000 }
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <storesContext.Provider value={mobxStore}>
      <Router>
        {/*<ConnectionProvider*/}
        {/*  endpoint={mobxStore.accountStore.solanaWeb3Manager.endpoint}*/}
        {/*>*/}
        {/*  <WalletProvider*/}
        {/*    wallets={mobxStore.accountStore.solanaWeb3Manager.wallets}*/}
        {/*    autoConnect*/}
        {/*  >*/}
        {/*    <WalletModalProvider>*/}
        <App />
        {/*</WalletModalProvider>*/}
        {/*</WalletProvider>*/}
        {/*</ConnectionProvider>*/}
      </Router>
    </storesContext.Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
