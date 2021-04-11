import React, { useState, useRef, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import Paper from "@material-ui/core/Paper";
import "./ProductsTable.css";

export default function ProductsTable({ products, formDispatch, pays }) {
  const fullSum = useRef(0);
  const fullSumPays = useRef(0);
  if (products) {
    fullSum.current = 0;
    for (let i = 0; i < products.length; i++) {
      fullSum.current += Math.round(100 * (products[i].weight * products[i].price)) / 100;
    }
    if(pays && pays.length > 0){
      fullSumPays.current = 0;
      for(let i2 = 0; i2 < pays.length; i2++) {
        fullSumPays.current += Math.round(100 * pays[i2].amount) / 100;
      }
      console.log(fullSumPays.current, fullSum.current);
    }
  }
  return (
    <div className="ProductsTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>شرح</th>
            <th>تعداد</th>
            <th>وزن</th>
            <th>فی</th>
            <th>مبلغ کل</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0
            ? products.map((p, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td>{p.productName}</td>
                  <td>{p.amount}</td>
                  <td>{p.weight}</td>
                  <td>{<Expense num={p.price} />}</td>
                  <td>{<Expense num={Math.round(100 * ( p.price * p.weight)) / 100} />}</td>
                  {formDispatch ? (
                    <td
                      onDoubleClick={() =>
                        formDispatch({ type: "removeProduct", payload: index })
                      }
                    >
                      {<DeleteIcon />}
                    </td>
                  ) : (
                    <td></td>
                  )}
                </tr>
              ))
            : null}
        </tbody>
      </table>
      <Divider />
      <div className="fullSum">جمع کل:‌ {<Expense num={fullSum.current} />}</div>
      <div className="fullSum">قابل پرداخت:‌ {<Expense num={fullSum.current - fullSumPays.current} />}</div>
    </div>
  );
}
