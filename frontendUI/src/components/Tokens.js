import React, {useEffect, useState, useMemo} from "react";
import axios from "axios";
import {useTable} from 'react-table'
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";

function Tokens({ wallet, tokens, setTokens }) {

  async function getTokenBalances() {
    const response = await axios.get("http://localhost:8080/tokenBalances", {
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


  const data = useMemo(
    () => [
      {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 2,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
      {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
          "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: {
          rate: 3.9,
          count: 120,
        },
      },
    ],
    []
  );


  const productsData = useMemo(() => [...products], [products]);



  const productsColumns = useMemo(
    () =>
      products[0]
        ? Object.keys(products[0]).map((key) => {
              
             return { Header: key, accessor: key }
            })
        : [],
    [products]
  );

  const tableInstance = useTable({columns, data:productsData});

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;






{console.log(Array.isArray(tokens) ? tokens.map((e) => [e.symbol, e.bal, `$${e.val}`,e.chain] ) : [])}

  return (
    <div className="flex overflow-hidden flex-col">
      <div className="tabHeading flex flex-col">
      <h2 className="text-xl flex items-center self-start gap-3 cursor-pointer font-bold">  ERC20 Coins
               <Reload onClick={getTokenBalances}/>

      </h2>



      <div className="px-8 border border-gray-500 rounded">
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

        <tbody className="rounded" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return(
              <tr {...row.getRowProps()}>
              { row.cells.map((cell,idx) => (
              <td className="border-b
              border-gray-500
              p-5" {...cell.getCellProps()} >{cell.render("Cell")}</td>
            ))}

            </tr>
            )
          })}
          
        </tbody>
    </table>
    </div>

    

      {/* {tokens.length > 0 && (
        <Table
          pageSize={6}
          noPagination={true}
          style={{ width: "740px" }}
          columnsConfig="200px 200px 200px 100px"
          className="flex self-start "
          data={Array.isArray(tokens) ? tokens.map((e) => [e.symbol, e.bal, `$${e.val}`,e.chain] ) : []}
          header={[
            <span>Currency</span>,
            <span>Balance</span>,
            <span>Value</span>,
            <span>Chain</span>,
          ]}
        />
      )} */}
      </div>
    </div>
  );
}

export default Tokens;