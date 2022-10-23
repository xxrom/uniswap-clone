import React, { ChangeEvent, memo, useCallback, useState } from "react";

import { AiOutlineArrowDown } from "react-icons/ai";
import { RiSettings3Fill } from "react-icons/ri";
import { GrDropbox } from "react-icons/gr";
import { useTransaction } from "../context/TransactionContext";

export interface MainProps {}

const style = {
  wrapper: `w-screen flex items-center justify-center mt-14`,
  content: `bg-[#19181F] w-[40rem] rounded-2xl p-4`,
  formHeader: `px-2 flex items-center justify-center justify-between font-semibold text-xl`,
  transferPropContainer: `bg-[#20242A] my-3 rounded-2xl p-6 text-3xl border border-[#20242A] hover:border-[#20442A] flex`,
  transferPropInput: `bg-transparent placeholder:text-[#B2B9D2] outline-none mb-0 w-full text-2xl`,
  currencySelector: `flex w-1/4`,
  currencySelectorContent: `w-full h-min flex justify-between items-center bg-[#2d2f36] hover:bg-[#41444f] rounded-2xl text-xl font-medium cursor-pointer p-2 mt-[-0.2rem]`,
  currencySelectorIcon: `flex items-center`,
  currencySelectorTicker: `mx-2`,
  currencySelectorArrow: `text-lg`,
  confirmButton: `bg-[#2172e5] my-2 rounded-2xl py-6 px-8 text-2xl font-bold flex items-center justify-center cursor-pointer`,
};

export type InputChangeEvent = ChangeEvent<HTMLInputElement>;

export const Main = memo(({}: MainProps) => {
  const { currentAccount, formData, handleFormChange, sendTransaction } =
    useTransaction();

  const onChangeAmount = useCallback(
    (e: InputChangeEvent) => handleFormChange(e, "amount"),
    [handleFormChange]
  );
  const onChangeAddress = useCallback(
    (e: InputChangeEvent) => handleFormChange(e, "addressTo"),
    [handleFormChange]
  );
  const onSubmit = useCallback(
    async (e: InputChangeEvent) => {
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
          <div>Swap</div>
          <div>
            <RiSettings3Fill />
          </div>
        </div>
        <div className={style.transferPropContainer}>
          <input
            type="text"
            className={style.transferPropInput}
            placeholder="0.0"
            pattern="^[0-9]*[.,]?[0-9]*$"
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
            placeholder="0x..."
            onChange={onChangeAddress}
          />
          <div className={style.currencySelector}></div>
        </div>
        <div onClick={onSubmit} className={style.confirmButton}>
          Confirm
        </div>
      </div>
    </div>
  );
});
