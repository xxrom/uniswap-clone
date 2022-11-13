import type { NextPage } from "next";
import { Header, Main, TransactionHistory } from "../components";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-slate-800 text-white select-none flex flex-col justify-between`,
};

const Home: NextPage = () => {
  return (
    <div className={style.wrapper}>
      <Header />
      <Main />
      <TransactionHistory />
      <div />
    </div>
  );
};

export default Home;
