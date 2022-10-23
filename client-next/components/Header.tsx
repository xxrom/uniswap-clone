import React, { memo, useCallback, useState } from "react";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineArrowDown } from "react-icons/ai";
import { DiAptana } from "react-icons/di";
import { GrCloudlinux, GrDropbox } from "react-icons/gr";
import { IconButton } from ".";
import { useTransaction } from "../context/TransactionContext";

export interface HeaderProps {}

const style = {
  wrapper: `p-4 w-screen flex flex-wrap justify-between items-center`,
  headerLogo: `flex w-1/8 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center fext-lg font-semibold cursrot-pointer rounded-3xl`,
  activeNavItem: ` text-amber-400 bg-[#20242A]`,
  buttonsContainer: `flex justify-end items-center`,
};

export const Header = memo(({}: HeaderProps) => {
  // Top current tab
  const [selectedNav, setSelectedNav] = useState("swap");
  const { currentAccount, connectWallet } = useTransaction();
  const isConnected = typeof currentAccount === "string";

  const onTabClick = useCallback(
    (newTab: string) => () => setSelectedNav(newTab),
    []
  );

  const getTabStyle = useCallback(
    (tabName: string) =>
      `${style.navItem} ${selectedNav === tabName && style.activeNavItem}`,
    [selectedNav]
  );

  const getTabComponent = useCallback(
    (tabName: string) => (
      <div onClick={onTabClick(tabName)} className={getTabStyle(tabName)}>
        {tabName}
      </div>
    ),
    [getTabStyle, onTabClick]
  );

  const onConnectWaller = useCallback(async () => {
    await connectWallet().then((ans: any) => {
      console.log("res after connectWallet", ans);
    });
  }, [connectWallet]);

  return (
    <div className={style.wrapper}>
      <div className={style.headerLogo}>
        <GrCloudlinux size="40" />
      </div>

      <div className={style.nav}>
        <div className={style.navItemsContainer}>
          {getTabComponent("swap")}
          {getTabComponent("pool")}
          {getTabComponent("vote")}

          <a
            href="https://info.uniswap.org/#/"
            rel="noreferrer"
            target="_blank"
          >
            <div className={style.navItem}>
              {`Charts_`}
              <GrDropbox />
            </div>
          </a>
        </div>
      </div>

      <div className={style.buttonsContainer}>
        <IconButton
          title="Ethereum"
          IconStart={DiAptana}
          IconEnd={AiOutlineArrowDown}
        />

        {isConnected ? (
          <IconButton
            title={`${currentAccount?.slice(0, 7)}...${currentAccount?.slice(
              35
            )}`}
          />
        ) : (
          <IconButton
            type="accent"
            title="Connect Wallet"
            onClick={onConnectWaller}
          />
        )}

        <IconButton IconStart={HiOutlineDotsVertical} />
      </div>
    </div>
  );
});
