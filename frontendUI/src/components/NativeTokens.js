import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { Table } from "@web3uikit/core";
import { Reload } from "@web3uikit/icons";
import { useTable } from "react-table";

function NativeTokens({ wallet, nativeBalances, setNativeBalances }) {
  const getNativeBalances = async () => {
    try {
      const response = await axios.get("http://localhost:8080/nativeBalances", {
        params: {
          address: wallet,
        },
      });
      console.log({ responses: response.data.nativeBalances });
      if (response.data) {
        setNativeBalances(response?.data?.nativeBalances ?? []);
      }
    } catch (e) {
      console.log(e.message);
    }
  };


  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(nativeBalances.map((item) => (item)))
  },[ nativeBalances])


 
  // {console.log(nativeBalances.map((item) => (item)))}





  const columns = useMemo(
    () => [
      {
        Header: "Native Tokens",
        accessor: "id",
      },
      {
        Header: "Price",
        accessor: "price",
      },
      {
        Header: "Value",
        accessor: "title",
      },
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


  const tableInstance = useTable({columns:productsColumns, data:productsData});

  const {getTableProps, getTableBodyProps, headerGroups, rows, prepareRow} = tableInstance;


  return (

    <>
    <div>
      <h2 className="text-xl  cursor-pointer flex items-center pb-3 self-start gap-3 font-medium"
      onClick={() => getNativeBalances()}
      >
        Native Coins
        <Reload className={"transition-all "}/>
      </h2>
    </div>
    <div className="px-10 border rounded">
    <table className="table-fixed text-base p-10 w-full     rounded-3xl text-white">
      <thead className="p-2">
        {headerGroups.map((headerGroup) => (
          <tr className="border-b
            rounded
          border-gray-500" {...headerGroup.getHeaderGroupProps()}>
          {headerGroup.headers.map((column) => (
            <th className=" border-b  rounded  border-gray-500 p-2"
             {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
          </tr>
        ))}
        </thead>

        <tbody className="rounded" {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return(
              <tr className="border-b border-blue-500" {...row.getRowProps()}>
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
    </>
  )

  // return (
  //   <div className="flex overflow-hidden  flex-col">
  //     <div className="flex flex-col">
  //       <h2 className="text-xl flex items-center pb-3 self-start gap-3 font-bold">
  //         Native Coins
  //         <Reload onClick={() => getNativeBalances()} />
  //       </h2>

  //       {nativeBalances.length > 0 && (
  //         <Table
  //           pageSize={6}
  //           noPagination={true}
  //           // style={{width:"740px"}}
  //           className="flex self-start border-[#16161a] border"
  //           columnsConfig="1fr 1fr 1fr 1fr "
  //           tableBackgroundColor="#16161a"
  //           customTableBorder="1"
  //           data={nativeBalances.map((item) => Object.values(item))}
  //           header={[
  //             <span>NativeToken</span>,
  //             <span>Price</span>,
  //             <span>Value</span>,
  //             <span>Chain</span>,
  //           ]}
  //         />
  //       )}
  //     </div>
  //   </div>
  // );
}

export default NativeTokens;
