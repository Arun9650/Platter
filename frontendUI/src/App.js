import "./App.css";
import { useEffect, useState } from "react";
import Title from "./components/Title";
import NativeTokens from "./components/NativeTokens";
import Tokens from "./components/Tokens";
import TransferHistory from "./components/TransferHistory";
import Nfts from "./components/Nfts";
import WalletInputs from "./components/WalletInputs";
import PortfolioValue from "./components/PortfolioValue";
import { Avatar, TabList, Tab } from "@web3uikit/core";
import { AiOutlineMenu,AiOutlineEye } from "react-icons/ai";

function App() {
  const [wallet, setWallet] = useState("");
  const [chain, setChain] = useState("0x1");
  const [nativeBalances, setNativeBalances] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [nfts, setNfts] = useState([]);
  const [filteredNfts, setFilteredNfts] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  });
  return (
    <div className="App flex overflow-hidden w-full h-full">
      <aside
        className={`shadow-md bg-[#1d1d21]   max-h-screen lg:min-w-[250px] w-2/12`}
      >
        <div className="h-screen flex flex-col items-center w-60 left-0   z-20">
          <div className="flex w-full justify-center  ">
            {windowWidth < 1200 ? (
              <AiOutlineMenu className="text-blue-500 text-2xl mt-5 ml-5" />
            ) : (
              <Title />
            )}
            {console.log(window.innerWidth)}
          </div>

          <div
            className={
              "text-md flex items-center justify-center gap-3 mt-20 bg-[#16161a] text-blue-500 font-medium hover:cursor-pointer p-3 lg:min-w-[192px]  text-center  rounded-xl " +
              (windowWidth < 993 ? "w-24" : "w-40")
            }
          >
           <AiOutlineEye size={25}/>
            Overview
          </div>
        </div>
      </aside>

      <div className="flex  overflow-auto scrollbar-hide md:scrollbar-default  border-blue-800 border w-full bg-[#101213]  justify-center h-screen">
        <main className=" max-h-screen   scrollbar-hide md:scrollbar-default  lg:w-3/4 w-full  overflow-auto">
          <WalletInputs
            chain={chain}
            setChain={setChain}
            wallet={wallet}
            setWallet={setWallet}
          />

          <div className="flex py-5 ">
            {wallet.length === 42 && (
              <div className="">
                <div className="flex items-center ">
                  <Avatar
                    isRounded
                    size={130}
                    image="https://nftcoders.com/avatar/avatar-cool.svg"
                    theme="image"
                  />
                  <div className="px-5">
                    <h3 className="font-bold text-lg ">{`${wallet.slice(
                      0,
                      6
                    )}...${wallet.slice(36)}`}</h3>
                    <PortfolioValue
                      tokens={tokens}
                      nativeBalances={nativeBalances}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <TabList className="tab-list">
            <Tab tabKey={1} tabName={"Tokens"}>
              <NativeTokens
                wallet={wallet}
                nativeBalances={nativeBalances}
                setNativeBalances={setNativeBalances}
              />

              <Tokens
                wallet={wallet}
                chain={chain}
                tokens={tokens}
                setTokens={setTokens}
              />
            </Tab>
            <Tab tabKey={2} tabName={"Transfer"}>
              <TransferHistory
                chain={chain}
                wallet={wallet}
                transfers={transfers}
                setTransfers={setTransfers}
              />
            </Tab>
            <Tab tabKey={3} tabName={"NFT'S"}>
              <Nfts
                wallet={wallet}
                chain={chain}
                nfts={nfts}
                setNfts={setNfts}
                filteredNfts={filteredNfts}
                setFilteredNfts={setFilteredNfts}
              />
            </Tab>
          </TabList>
        </main>
      </div>
    </div>
  );
}

export default App;
