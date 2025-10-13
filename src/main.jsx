import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { ThemeProvider } from "@mui/material";
import theme from "./theme.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qClient=new QueryClient()
createRoot(document.getElementById("root")).render(
	<StrictMode>
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={qClient}>
				<App />
			</QueryClientProvider>
		</ThemeProvider>
	</StrictMode>
);
