import "../styles/globals.css";
import "../global.d.ts";
import type { AppProps } from "next/app";
import { TransactionProvider } from "../context/TransactionContext";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <TransactionProvider>
      <Component {...pageProps} />
    </TransactionProvider>
  );
};

export default MyApp;
