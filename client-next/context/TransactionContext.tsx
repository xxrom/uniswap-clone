import React, {
  useState,
  useEffect,
  ReactElement,
  useContext,
  createContext,
} from "react";

/*
 * TODO: is it fine to try only once to connect to wallet,
 * with window check only once ?
 *
 * ANS: yes, it is fine, useEffect will run only in browser,
 * on server it will be skipped
 * ANS2: typeof window !== 'undefined'
 * ANS3: dynamic import 'next/dynamic' with {ssr: false},
 * so loading will be skipped too
 *
 * URL: https://dev.to/vvo/how-to-solve-window-is-not-defined-errors-in-react-and-next-js-5f97
 */

export type Eth = Window["ethereum"] | undefined;
export type TransactionContext = {
  currentAccount: string | null;
  connectWallet: (eth?: Eth) => Promise<any>;
};

const initContext: TransactionContext = {
  currentAccount: null,
  connectWallet: () => new Promise(() => {}),
};

const TransactionContext = createContext(initContext);

export const TransactionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [currentAccount, setCurrentAccount] =
    useState<TransactionContext["currentAccount"]>(null);

  const eth: Eth = typeof window !== "undefined" ? window?.ethereum : undefined;

  useEffect(() => {
    console.log("useEffect", eth);

    if (typeof window === "object") {
      checkIfWalletIsConnected();
    }
  }, []);

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) {
        return alert("Please install metamask (connectWallet)");
      }

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      console.log("accoutns", accounts);
      setCurrentAccount(accounts[0]);
    } catch (err: { code?: number }) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
        throw new Error("No ethereum object (eth_requestAccounts)");
      }
    }
  };

  const checkIfWalletIsConnected = async (metamask = eth) => {
    try {
      if (!metamask) {
        /*
         * If user didn't have metasmask, then he doesn't have
         * window.ethereum, then he has to install plugin MetaMask
         */
        return alert("Please install metamask (checkIfWalletIsConnected)");
      }

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts?.length) {
        setCurrentAccount(accounts[0]);
        console.log("wallet is already connected!");
      }
    } catch (err) {
      console.error(err);
      throw new Error("no ethereum object (eth_accounts)");
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        currentAccount,
        setCurrentAccount,
        connectWallet,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
