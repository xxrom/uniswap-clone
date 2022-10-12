import React, { memo, useCallback, useState } from "react";

import { HiOutlineDotsVertical } from "react-icons/hi";
import { AiOutlineArrowDown } from "react-icons/ai";
import { DiAptana } from "react-icons/di";
import { GrCloudlinux, GrDropbox } from "react-icons/gr";
import { IconType } from "react-icons";
export interface MainProps {}

const style = {
  wrapper: `p-4 w-screen flex flex-wrap justify-between items-center`,
  headerLogo: `flex w-1/8 items-center justify-start`,
  nav: `flex-1 flex justify-center items-center`,
  navItemsContainer: `flex bg-[#191B1F] rounded-3xl`,
  navItem: `px-4 py-2 m-1 flex items-center fext-lg font-semibold cursrot-pointer rounded-3xl`,
  activeNavItem: ` text-amber-400 bg-[#20242A]`,
  buttonsContainer: `flex justify-end items-center`,
};

export const Main = memo(({}: MainProps) => {
  return <div>Main</div>;
});
