import React, {
  useState,
  useEffect,
  ReactElement,
  useContext,
  createContext,
} from "react";

export type Eth = Window.ethereum | undefined;
export type TransactionContext = {
  currentAccount: string | null;
  connectWallet: (eth: Eth) => Promise<any>;
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

  // TODO: is it fine to try only once to connect to wallet ?
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
        return alert("Please install metamask (checkIfWalletIsConnected)");
      }

      const accounts = await metamask.request({ method: "eth_accounts" });

      if (accounts?.length) {
        setCurrentAccount(accounts[0]);
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
