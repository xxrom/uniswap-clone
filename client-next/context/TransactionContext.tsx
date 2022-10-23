import React, {
  useState,
  useEffect,
  ReactElement,
  useContext,
  createContext,
} from "react";
import { contractABI, contractAddress } from "../lib/constants";
import { ethers } from "ethers";

const eth: Eth = typeof window !== "undefined" ? window?.ethereum : undefined;

const getEthereumContract = () => {
  if (!eth) {
    console.error("Dont have any eth object");
    return;
  }
  const provider = new ethers.providers.Web3Provider(eth);
  // I'm signer (I will send eth from my account contractAddress to addressTo)
  const signer = provider.getSigner();

  // Getting contract from smart-contract that we generated before
  const transactionContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionContract;
};

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
  sendTransaction: (eht?: Eth, connectedAccount?: string) => Promise<any>;
  handleFormChange: (e: React.InputHTMLAttributes<any>, name: string) => void;
  formData: {
    addressTo: string;
    amount: string;
  };
};

const initContext: TransactionContext = {
  currentAccount: null,
  connectWallet: () => new Promise(() => {}),
  sendTransaction: () => new Promise(() => {}),
  handleFormChange: () => {},
  formData: {
    addressTo: "",
    amount: "",
  },
};

const TransactionContext = createContext(initContext);

export const TransactionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [currentAccount, setCurrentAccount] =
    useState<TransactionContext["currentAccount"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionContext["formData"]>(
    initContext?.formData
  );

  console.log("Context data", formData);

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
    } catch (err: any) {
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
        console.log("Wallet is already connected!");
      }
    } catch (err) {
      console.error(err);
      throw new Error("No ethereum object (eth_accounts)");
    }
  };

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) {
        return alert("Please install metamask (checkIfWalletIsConnected)");
      }

      const { addressTo, amount } = formData;

      const transactionContract = getEthereumContract();

      const parsedAmount = ethers.utils.parseEther(amount);

      await metamask.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: connectedAccount,
            to: addressTo,
            gas: "0x7EF40", // 520000 Gwei
            value: parsedAmount._hex,
          },
        ],
      });

      // We already waiting hash ??? or we waiting to publish transaction ??
      const transactionHash = await transactionContract.publishTransaction(
        addressTo, // to wallet address
        parsedAmount, // amount
        `Transferring ETH ${parsedAmount} to ${addressTo}`, // message
        `TRANSFER` // key word
      );

      setIsLoading(true);

      // Waiting Hash to return
      await transactionHash.wait();

      // Saving transaction to the DB
      //await saveTransaction(
      //transactionHash.hash,
      //amount,
      //connectedAccount,
      //addressTo
      //);

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormChange = (e: React.InputHTMLAttributes, name: string) => {
    setFormData((prevState) => ({
      ...prevState,
      [name]: e?.target?.value,
    }));
  };

  return (
    <TransactionContext.Provider
      value={{
        formData,
        currentAccount,
        connectWallet,
        sendTransaction,
        handleFormChange,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => useContext(TransactionContext);
