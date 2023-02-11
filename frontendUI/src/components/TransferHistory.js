import React from "react";
import axios from "axios";
import { Reload } from "@web3uikit/icons";
import { Table } from "@web3uikit/core";

function TransferHistory({ chain, wallet, transfers, setTransfers }) {
  async function getTokenTransfers() {
    const response = await axios.get("http://localhost:8080/tokenTransfers", {
      params: {
        address: wallet
       
      },
    });

    if (response.data) {
      setTransfers(response.data);
      console.log(response.data);
    }
  }
  
  const tokenTransfers = transfers.tokenTransfers;
  return (
    <>
      <div className="tabHeading">
        Transfer History <Reload onClick={getTokenTransfers} />
      </div>
      <div>
        {tokenTransfers.length > 0 && (
          <Table
            pageSize={200}
            
            noPagination={false}
            style={{ width: "78vw" }}
            columnsConfig="14vw 10vw 10vw 14vw 16vw 10vw"
            data={tokenTransfers
              .flatMap((e) => {
                const { userTransDetails } = e;
                return userTransDetails
                  .sort((a, b) => new Date(b.block_timestamp) - new Date(a.block_timestamp))
                  .map((d) => [
                    d.symbol,
                    e.chain,
                    (Number(d.value) / Number(`1e${d.decimals}`)).toFixed(3),
                    `${d.from_address.slice(0, 4)}...${d.from_address.slice(38)}`,
                    `${d.to_address.slice(0, 4)}...${d.to_address.slice(38)}`,
                    d.block_timestamp.slice(0,10),
                  ]);
              })
            }
            header={[
              <span>Token</span>,
              <span>Chain</span>,
              <span>Amount</span>,
              <span>From</span>,
              <span>To</span>,
              <span>Date</span>,
            ]}
          />
        )}
      </div>
    </>
  );
  
}

export default TransferHistory;
