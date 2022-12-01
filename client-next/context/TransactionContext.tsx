import React, {
  useState,
  useEffect,
  ReactElement,
  useContext,
  createContext,
} from "react";
import { contractABI, contractAddress } from "../lib/constants";
import { ethers } from "ethers";
import { client } from "../lib/sanityClient";

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

export type HanldeInputType = React.InputHTMLAttributes<any> & {
  target: { value: string };
};
export type Eth = Window["ethereum"] | undefined;
export type TransactionContext = {
  isLoggedIn: boolean;
  isLoading: boolean;
  isCorrectNetwork: boolean;
  information: string;
  currentAccount: string | null;
  connectWallet: (eth?: Eth) => Promise<any>;
  sendTransaction: (eht?: Eth, connectedAccount?: string) => Promise<any>;
  handleFormChange: (e: HanldeInputType, name: string, regExp?: RegExp) => void;
  formData: {
    addressTo: string;
    amount: string;
  };
};

const initContext: TransactionContext = {
  isLoggedIn: false,
  isLoading: false,
  isCorrectNetwork: false,
  information: "",
  currentAccount: null,
  connectWallet: () => new Promise(() => {}),
  sendTransaction: () => new Promise(() => {}),
  handleFormChange: () => {},
  formData: {
    addressTo: "",
    amount: "0.0",
  },
};

const TransactionContext = createContext(initContext);

export const TransactionProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);
  const [information, setInformation] = useState("...");
  const [currentAccount, setCurrentAccount] =
    useState<TransactionContext["currentAccount"]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionContext["formData"]>(
    initContext?.formData
  );

  console.log("Context data", formData);

  useEffect(() => {
    console.log("try connect", eth);
    checkIfWalletIsConnected();
  }, []);

  // Create user profile in Sanity if not exists
  useEffect(() => {
    console.log("currentAccount useEffect : ", currentAccount);
    if (!currentAccount) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    // IIF
    (async () => {
      const userDoc = {
        _id: currentAccount,
        _type: "users",
        userName: "Unnamed",
        walletAddress: currentAccount,
      };

      await client.createIfNotExists(userDoc);
      //const res = await client.createOrReplace(userDoc);
    })();
  }, [currentAccount]);

  const validateNetwork = async (metamask = eth) => {
    let chainId = await metamask?.request({ method: "eth_chainId" });

    console.log(`Connected to chain: ${chainId}`);

    const goerlyChainId = "0x5";

    if (chainId !== goerlyChainId) {
      const message = "You are not connected to the 'Goerli' test network!";
      console.log(message);
      setInformation(message);
      //alert(message);
      setIsCorrectNetwork(false);

      return false;
    }

    setIsCorrectNetwork(true);
    return true;
  };

  const connectWallet = async (metamask = eth) => {
    try {
      if (!metamask) {
        setInformation("Please install MetaMask.");
        return alert("Please install metamask (connectWallet)");
      }

      let chainId = await metamask?.request({ method: "eth_chainId" });

      console.log(`Connected to chain: ${chainId}`);

      const isNetworkValid = await validateNetwork();
      if (!isNetworkValid) {
        return;
      }

      const accounts = await metamask.request({
        method: "eth_requestAccounts",
      });
      console.log("accounts", accounts);

      setCurrentAccount(accounts[0]);
    } catch (err: any) {
      if (err?.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log("Please connect to MetaMask.");
        setInformation("Please connect to MetaMask.");
      } else {
        console.error(err);
        setInformation("Error...");
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
        setInformation("Please install MetaMask.");
        return; // alert("Please install metamask (checkIfWalletIsConnected)");
      }

      const isNetworkValid = await validateNetwork();
      if (!isNetworkValid) {
        return;
      }

      const accounts = await metamask?.request({
        method: "eth_accounts",
      });

      // Using first one that we found (we could find more =)
      if (accounts?.length > 0) {
        console.log(`Found account[0]: ${accounts[0]}`);
        console.log("Wallet is already connected!");
        setCurrentAccount(accounts[0]);
      }
    } catch (err) {
      console.error(err);
      //throw new Error("No ethereum object (eth_accounts)");
    }
  };

  const sendTransaction = async (
    metamask = eth,
    connectedAccount = currentAccount
  ) => {
    try {
      if (!metamask) {
        setInformation("Please install to MetaMask.");
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
      const transactionHash = await transactionContract?.publishTransaction(
        addressTo, // to wallet address
        parsedAmount, // amount
        `Transferring ETH ${parsedAmount} to ${addressTo}`, // message
        `TRANSFER` // key word
      );

      setIsLoading(true);

      // Waiting Hash to return
      await transactionHash.wait();

      // Saving transaction to the Sanity DB
      await saveTransaction(
        transactionHash.hash,
        amount,
        connectedAccount,
        addressTo
      );

      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormChange = (
    e: HanldeInputType,
    name: string,
    regExp?: RegExp
  ) => {
    const value = e?.target?.value.trim();

    if (regExp && !new RegExp(regExp).test(value)) {
      return;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: e?.target?.value.trim(),
    }));
  };

  // Save transaction info to Sanity (it's faster then getting from blockchain)
  const saveTransaction = async (
    // Transaction Hash
    txHash: string,
    amount: string,
    fromAddress = currentAccount,
    toAddress: string
  ) => {
    if (!fromAddress) {
      // return if we don't have currentAccount
      return;
    }

    // Transaction document
    const txDoc = {
      _type: "transactions",
      _id: txHash,
      fromAddress,
      toAddress,
      timestamp: new Date(Date.now()).toISOString(),
      txHash,
      amount: parseFloat(amount),
    };

    /*
     * Create new document in Sanity if needed
     * client from ./lib/sanityClient file
     */
    await client.createIfNotExists(txDoc);

    /*
     * Connect transactions with current user account (currentAccount)
     * so we can see all transactions for each user
     */
    await client
      .patch(fromAddress)
      .setIfMissing({ transactions: [] }) // first init array with Transactions
      .insert(
        "after",
        "transactions[-1]", // append to array of Transactions
        [
          {
            _key: txHash,
            _ref: txHash,
            _type: "reference",
          },
        ]
      )
      .commit(); // send and update sanity DB with new data

    return;
  };

  return (
    <TransactionContext.Provider
      value={{
        information,
        isLoggedIn,
        isCorrectNetwork,
        isLoading,
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
