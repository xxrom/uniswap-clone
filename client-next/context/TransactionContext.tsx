import React, {
  useState,
  createContext,
  useEffect,
  ReactElement,
  useContext,
} from "react";

export type TransactionContext = {
  currentAccount: string | null;
  connectWallet: (eth: Window.ethereum) => Promise<any>;
};
export const TransactionContext = createContext<TransactionContext>({});

export const TransactionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [currentAccount, setCurrentAccount] =
    useState<TransactionContext["currentAccount"]>(null);
  const [eth, setEth] = useState<Window.ethereum | null>();
  console.log(eth, currentAccount);

  useEffect(() => {
    console.log("useEffect", window.ethereum);
    if (typeof window !== "undefiend") {
      setEth(window?.ethereum);
    }
  }, []);

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) {
        return alert("Please install metamask");
      }

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      console.log("accoutns", accounts);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
      } else {
        console.error(err);
        throw new Error("No ethereum object (eth_requestAccounts)");
      }
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
