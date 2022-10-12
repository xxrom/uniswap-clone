import React, { memo, useCallback, useMemo, useState } from "react";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineArrowDown } from "react-icons/ai";
import { DiAptana } from "react-icons/di";
import { GrCloudlinux, GrDropbox } from "react-icons/gr";
import { IconType } from "react-icons";
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
  const [isConnected] = useState(true);

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
          <IconButton title="0x00..234" />
        ) : (
          <IconButton type="accent" title="Connect Wallet" />
        )}

        <IconButton IconStart={HiOutlineDotsVertical} />
      </div>
    </div>
  );
});

// Button with Icons
const styleButton = {
  buttonIconContainer: "flex items-center",
  buttonTitleContainer: "m-2",
  button: `flex items-center bg-[#191B1F] rounded-2xl mx-2`,
  buttonPadding: `p-2`,
  accent: `text-blue-500 font-bold border border-[#163256] bg-[#172A42] rounded-2xl h-full`,
};

const IconButton = ({
  title,
  IconStart,
  IconEnd,
  type,
}: {
  title?: string;
  IconStart?: IconType;
  IconEnd?: IconType;
  type?: "accent";
}) => (
  <div
    className={`${styleButton.button} ${
      type === "accent" && styleButton.accent
    } ${styleButton.buttonPadding}`}
  >
    <div className={`${styleButton.buttonIconContainer}`}>
      {IconStart && <IconStart />}
      {title && (
        <div className={styleButton.buttonTitleContainer}>{`${title}`}</div>
      )}

      {IconEnd && <IconEnd />}
    </div>
  </div>
);
