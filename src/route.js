import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import NewEndpoint from "./canvas/NewEndpoint";

const routes = createBrowserRouter([
  {
    path: '/',
    Component: App
  },
  {
    path: 'new',
    Component: NewEndpoint
  }
])

export default routes