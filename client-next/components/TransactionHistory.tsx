import { useCallback, useEffect, useState, useTransition } from "react";

import { useTransaction } from "../context/TransactionContext";
import { day } from "../lib/dayjs";
import { client } from "../lib/sanityClient";

const style = {
  wrapper: `absolute z-10 max-h-20 text-white select-none flex items-end justify-end right-2 bottom-2 pl-2`,
  content: `rounded-lg p-2 bg-sky-800 overflow-scroll h-[20rem] max-h-[60vh]`,
  closeBtn: `inline-flex px-4 py-2 rounded-lg mb-2 cursor-pointer bg-amber-400 text-black font-bold`,
  txHistoryItem: `bg-slate-900 rounded-lg px-4 py-2 sm:py-4 my-1 sm:my-2 text-sm`,
  amount: `text-sky-400 font-bold`,
  txDetails: `flex flex-1 justify-between`,
  index: `mr-2`,
  toAddress: `mx-2 text-amber-400`,
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
  const [isHidden, setIsHidden] = useState(true);
  const [transactionHistory, setTransactionHistory] = useState<TransactionList>(
    []
  );

  useEffect(() => {
    (async () => {
      if (!isLoading && currentAccount) {
        // sanity doc: https://www.sanity.io/docs/query-cheat-sheet
        const query = `
            *[_type=="users" && _id=="${currentAccount}"] {
              "transactionList": transactions[]->{amount, toAddress, timestamp, txHash}
            }
          `;

        const clientRes = await client.fetch(query);
        console.log(clientRes);

        // get transactionList for currentAccount
        setTransactionHistory(clientRes[0].transactionList.reverse());
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
            {transactionHistory?.map(
              ({ _id, amount, toAddress, timestamp, txHash }, index) => (
                <div className={style.txHistoryItem} key={`${_id}${timestamp}`}>
                  <div className={style.txDetails}>
                    <span className={style.index}>{`№ ${index + 1}: `}</span>
                    <span className={style.amount}>{`amount: ${amount}`}</span>
                    <span className={style.toAddress}>
                      {`to: ${toAddress.substring(0, 7)}...`}
                    </span>
                    <span className={style.txTimestamp}>
                      {day(timestamp).fromNow()}
                    </span>
                    <a
                      href={`https://goerli.etherscan.io/tx/${txHash}`}
                      target="_blank"
                      rel="noreferrer"
                      className={style.etherscanLink}
                    >
                      {`Link to goerli: ${txHash.substring(0, 6)}...`}
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
