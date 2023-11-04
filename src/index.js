import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import DBProvider from "./contexts/DBProvider";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
	<DBProvider>
		<App />
	</DBProvider>
);
