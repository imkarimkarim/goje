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
  const sum = useRef(0);
  if (products) {
    sum.current = 0;
    for (let i = 0; i < products.length; i++) {
      sum.current += products[i].weight * products[i].price;
    }
    if(pays && pays.length > 0){
      for(let i2 = 0; i2 < pays.length; i2++) {
        sum.current -= pays[i2].amount;
      }
    }
  }
  return (
    <div className="ProductsTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>شرح بار</th>
            <th>تعداد</th>
            <th>وزن</th>
            <th>فی</th>
            <th>قیمت</th>
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
                  <td>{<Expense num={p.price * p.weight} />}</td>
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
      <div className="fullSum">جمع کل:‌ {<Expense num={sum.current} />}</div>
    </div>
  );
}
