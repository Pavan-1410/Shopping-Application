import { QueryClient } from "@tanstack/react-query";
const queryClient = new QueryClient();
export default queryClient

// we are using the tanstack query to call backend routes instedt of zustand because it reduces latency