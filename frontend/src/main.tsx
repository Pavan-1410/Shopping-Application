import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import App from "./App";
import queryClient from "./lib/queryclient";

import "./index.css";

createRoot(document.getElementById("root")!).render(

  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Toaster/>
      <App />
    </QueryClientProvider>
  </BrowserRouter>

);