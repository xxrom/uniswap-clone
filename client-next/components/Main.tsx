import React, { ChangeEvent, memo, useCallback } from "react";

import { AiOutlineArrowDown } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import { GrDropbox } from "react-icons/gr";
import { useTransaction } from "../context/TransactionContext";

export interface MainProps {}

const style = {
  wrapper: `w-screen flex items-center justify-center mt-2`,
  content: `bg-[#19181F] w-[40rem] rounded-2xl p-4 sm:p-4 m-4 sm:p-4`,
  formHeader: `px-2 flex items-center justify-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-4 sm:p-6 text-3xl border border-[#20242A] hover:border-[#20442A] flex`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-0 w-full text-lg md:text-2xl`,
  currencySelector: `flex w-28`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2d2f36] hover:bg-[#41444f] rounded-2xl text-base sm:text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-sky-500 my-2 rounded-2xl py-4 sm:py-6 px-4 sm:px-8 text-xl sm:text-2xl font-bold flex w-full items-center justify-center cursor-pointer hover:bg-sky-600 active:bg-sky-800`,
  inputControls: `flex text-base sm:text-xl`,
  loadingBadge: `flex min-w-28 justify-center bg-amber-400 rounded-xl ml-4 px-4 text-rose-800`,
};

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export const Main = memo(({}: MainProps) => {
  const { isLoading, formData, handleFormChange, sendTransaction } =
    useTransaction();

  const onChangeAmount = useCallback(
    (e: InputChangeEvent) =>
      handleFormChange(e, "amount", /^[0-9]*[.,][0-9]*$/g),
    [handleFormChange]
  );
  const onChangeAddress = useCallback(
    (e: InputChangeEvent) =>
      handleFormChange(e, "addressTo", /^[0-9a-zA-Z]*$/g),
    [handleFormChange]
  );

  const onSubmit = useCallback(
    async (_e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      const { addressTo, amount } = formData;

      // Disabling default thing (a form submission is to refresh the page)
      //e.preventDefault();

      if (!addressTo || !amount) {
        console.log("Do not have addressTo or amount");
        return;
      }

      sendTransaction();
    },
    [formData, sendTransaction]
  );

  return (
    <div className={style.wrapper}>
      <div className={style.content}>
        <div className={style.formHeader}>
          <div className={style.inputControls}>
            Swap
            {isLoading && (
              <span className={style.loadingBadge}>Loading...</span>
            )}
          </div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            value={formData?.["amount"]}
            placeholder={formData?.["amount"]}
            pattern="[0-9]*[.,]?[0-9]*"
            onChange={onChangeAmount}
          />
          <div className={style.currencySelector}>
            <div className={style.currencySelectorContent}>
              <div className={style.currencySelectorIcon}>
                <GrDropbox />
              </div>
              <div className={style.currencySelectorTicker}>ETH</div>
              <AiOutlineArrowDown className={style.currencySelectorArrow} />
            </div>
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            value={formData?.["addressTo"]}
            placeholder="0x..."
            pattern="^[0-9a-zA-Z]*$"
            onChange={onChangeAddress}
          />
        </div>
        <button
          disabled={isLoading}
          onClick={onSubmit}
          className={style.confirmButton}
        >
          {isLoading ? "Loading..." : "Confirm"}
        </button>
      </div>
    </div>
  );
});
