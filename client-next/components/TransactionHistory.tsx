import { useCallback, useEffect, useState, useTransition } from "react";
import { useTransaction } from "../context/TransactionContext";
import { client } from "../lib/sanityClient";

const style = {
  wrapper: `absolute z-10 max-h-20 text-white select-none flex items-end justify-end right-2 bottom-2`,
  content: `rounded-lg p-2 bg-sky-800`,
  closeBtn: `inline-flex px-4 py-2 rounded-lg mb-2 cursor-pointer bg-amber-400 text-black font-bold`,
  txHistoryItem: `bg-[#191a1e] rounded-lg px-4 py-4 my-2 flex items-center justify-end`,
  amount: `text-sky-700`,
  txDetails: `flex items-center`,
  toAddress: `text-amber-400 mx-2`,
  txTimestamp: `ml-2`,
  etherscanLink: `ml-4 flex items-center text-sky-700`,
};

export type TransactionItem = {
  _id: string;
  amount: number;
  toAddress: string;
  timestamp: string;
  txHash: string;
};
export type TransactionList = Array<TransactionItem>;

export const TransactionHistory = () => {
  const { isLoading, currentAccount } = useTransaction();
  const [isHidden, setIsHidden] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<TransactionList>(
    []
  );

  useEffect(() => {
    (async () => {
      if (!isLoading && currentAccount) {
        const query = `
            *[_type=="users" && _id=="${currentAccount}"] {
              "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}|order(timestamp, desc)
            }
          `;

        const clientRes = await client.fetch(query);

        // get transactionList for currentAccount
        setTransactionHistory(clientRes[0].transactionList);

        setIsHidden(false);
      }
    })();
  }, [isLoading, currentAccount]);

  const onToggleHistory = useCallback(() => setIsHidden((state) => !state), []);

  const isContentVisibale = !isHidden && transactionHistory?.length > 0;

  return (
    <div className={style.wrapper}>
      <div>
        <span className={style.closeBtn} onClick={onToggleHistory}>
          {isContentVisibale ? "Close" : "Open History"}
        </span>

        {isContentVisibale && (
          <div className={style.content}>
            {transactionHistory.map(
              ({ _id, amount, toAddress, timestamp, txHash }) => (
                <div className={style.txHistoryItem} key={_id}>
                  <div className={style.txDetails}>
                    <span className={style.amount}>{amount}</span>
                    <span className={style.toAddress}>
                      {`${toAddress.substring(0, 6)}...`}
                    </span>
                    <span className={style.txTimestamp}>
                      {new Date(timestamp).toLocaleString()}
                    </span>
                    <a
                      href={`https://rinkeby.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className={style.etherscanLink}
                    >
                      {`${txHash.substring(0, 6)}...`}
                    </a>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};
