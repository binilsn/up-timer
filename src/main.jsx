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
import { BrowserRouter, RouterProvider } from "react-router-dom";
import routes from "./route.js";

const qClient=new QueryClient()
createRoot(document.getElementById("root")).render(
		<ThemeProvider theme={theme}>
			<QueryClientProvider client={qClient}>
			<RouterProvider router={routes} />
			</QueryClientProvider>
		</ThemeProvider>
);
