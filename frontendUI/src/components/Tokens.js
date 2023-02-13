import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {useTable} from 'react-table'
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";

function Tokens({ wallet, tokens, setTokens }) {

  async function getTokenBalances() {
    const response = await axios.get("https://platter-cqkw.vercel.app/tokenBalances", {
      params: {
        address: wallet,
       
      },
    });

    if (response.data) {
      tokenProcessing(response.data);
      
    }
  }

  function tokenProcessing(t) {

    if(Array.isArray(t)){
    for (let i = 0; i < t.length; i++) {
      t[i].bal = (Number(t[i].balance) / Number(`1E${t[i].decimals}`)).toFixed(3); //1E18
      t[i].val = ((Number(t[i].balance) / Number(`1E${t[i].decimals}`)) *Number(t[i].usd)).toFixed(2);
    }

    setTokens(t);

  }
  }

  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(Array.isArray(tokens) ? tokens.map((e) => [e.symbol, e.bal, `$${e.val}`,e.chain] ) : [])
  },[ tokens])

  const columns = useMemo(
    () => [
      {
        Header: "Currancy",
        accessor: "0",
      },
      {
        Header: "Balance",
        accessor: "1",
      },
      {
        Header: "Value",
        accessor: "2",
      },
      {
        Header: "Chain",
        accessor: "3",
      }
    ],
    []
  );


 


  const productsData = useMemo(() => [...products], [products]);



  // const productsColumns = useMemo(
  //   () =>
  //     products[0]
  //       ? Object.keys(products[0]).map((key) => {
              
  //            return { Header: key, accessor: key }
  //           })
  //       : [],
  //   [products]
  // );

  const tableInstance = useTable({columns, data:productsData});

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;







{console.log(Array.isArray(tokens) ? tokens.map((e) => [e.symbol, e.bal, `$${e.val}`,e.chain] ) : [])}

  return (
    <div className="flex overflow-hidden  flex-col">
      <div className="tabHeading flex   flex-col">
      



      <div className="px-8 bg-[#1e1f24]  rounded-3xl">

      <h2 className="text-xl flex items-center text-white py-4 pt-6 self-start gap-3 cursor-pointer font-bold">  ERC20 Coins
               <Reload onClick={getTokenBalances}/>

      </h2>


      <table className="table-fixed font-normal text-base w-full text-white">
      <thead className="p-2">
        {headerGroups.map((headerGroup) => (
          <tr className="border-b
          rounded
          border-gray-500" {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th className="border-b
            rounded
            border-gray-500
            p-2" {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
          </tr>
        ))}
        </thead>

        <tbody className="rounded divide-y divide-gray-500" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return(
              <tr {...row.getRowProps()}>
              { row.cells.map((cell,idx) => (
              <td className="divide-y text-ellipsis
              divide-gray-500 overflow-hidden
              py-5 px-2" {...cell.getCellProps()} >{cell.render("Cell")}</td>
            ))}

            </tr>
            )
          })}
          
        </tbody>
    </table>
    </div>
      </div>
    </div>
  );
}

export default Tokens;