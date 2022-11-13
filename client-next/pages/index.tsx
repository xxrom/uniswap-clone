import type { NextPage } from "next";
import { Header, Main, TransactionHistory } from "../components";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-[#2d242f] text-white select-none flex flex-col justify-between`,
};

const Home: NextPage = () => {
  return (
    <div className={style.wrapper}>
      <Header />
      <Main />
      <TransactionHistory />
      <div>footer</div>
    </div>
  );
};

export default Home;
