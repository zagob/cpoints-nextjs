import "../styles/globals.css";
import "../styles/day-picker.css";
import "react-day-picker/dist/style.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import type { AppProps } from "next/app";
import { AuthProvider } from "../contexts/AuthProvider";
import { Toaster } from "react-hot-toast";
import { TimeProvider } from "../contexts/TimeProvider";
import { queryClient } from "../services/reactQuery";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TimeProvider>
          <Toaster />
          <Component {...pageProps} />
        </TimeProvider>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen />
    </QueryClientProvider>
  );
}
