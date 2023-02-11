import React, { useEffect } from "react";
import "../App.css";
import { Input, Select, CryptoLogos } from "@web3uikit/core";
import Title from "./Title";

function WalletInputs({ chain, wallet, setChain, setWallet }) {
  useEffect(() => {
    setWallet("0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d");
  },[]);
  return (
    <>
      <div className="header">
        
        <div className="flex w-full items-end justify-between ">
          {/* <Input
            id="Wallet"
            label="Wallet Address"
            labelBgColor="rgb(33, 33, 38)"
            value={wallet}
            style={{ height: "50px" }}
            onChange={(e) => setWallet(e.target.value)}
          /> */}
           <input className="rounded-lg p-4 py-2 max-w-sm  m-1  bg-[#29292c]
             focus:outline-none active:outline-none  w-full"
            value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          />
          <Select
            defaultOptionIndex={0}
            id="Chain"
            onChange={(e) => setChain(e.value)}
            options={[
              {
                id: "eth",
                label: "Ethereum",
                value: "0x1",
                prefix: <CryptoLogos chain="ethereum" />,
              },
              {
                id: "matic",
                label: "Polygon",
                value: "0x89",
                prefix: <CryptoLogos chain="polygon" />,
              },
              {
                id: "ftm",
                label: "Fantom",
                value: "0xfa",
                prefix: <CryptoLogos chain="fantom" />,
              },
              {
                id: "Bsc",
                label: "Binance",
                value: "0x38",
                prefix: <CryptoLogos chain="binance" />,
              },
            ]}
          />
        </div>
      </div>
    </>
  );
}

export default WalletInputs;
