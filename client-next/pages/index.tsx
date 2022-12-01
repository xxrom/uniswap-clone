import type { NextPage } from "next";
import { useCallback } from "react";
import { Header, IconButton, Main, TransactionHistory } from "../components";
import { useTransaction } from "../context/TransactionContext";

const style = {
  wrapper: `h-screen max-h-screen h-min-screen w-screen bg-slate-800 text-white select-none flex flex-col justify-between`,
  information: `flex flex-col items-center justify-center h-screen text-2xl `,
  informationText: `mb-4 min-h-1/8 text-center`,
};

const Home: NextPage = () => {
  const { isLoggedIn, isCorrectNetwork, information, connectWallet } =
    useTransaction();

  const onConnectWaller = useCallback(async () => {
    await connectWallet().then((ans: any) => {
      console.log("res after connectWallet", ans);
    });
  }, [connectWallet]);

  const ConnectContent = (
    <div className={style.information}>
      <div className={style.informationText}>{`<${information}>`}</div>

      <IconButton
        type="accent"
        title="Connect Wallet"
        onClick={onConnectWaller}
      />
    </div>
  );

  const MainContent = (
    <>
      <Header />
      <Main />
      <TransactionHistory />
      <div />
    </>
  );
  return (
    <div className={style.wrapper}>
      {isLoggedIn && isCorrectNetwork ? MainContent : ConnectContent}
    </div>
  );
};

export default Home;
