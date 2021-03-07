import React, { useState, useReducer, useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Expense from "../Expense.jsx";
import Paper from "@material-ui/core/Paper";
import "./ProductsTable.css";

export default function ProductsTable({ products }) {
  return (
    <div className="ProductsTable">
      <table>
        <thead>
          <tr>
            <th>شرح بار</th>
            <th>تعداد</th>
            <th>وزن</th>
            <th>فی</th>
            <th>قیمت</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0
            ? products.map((p) => (
                <tr key={p.customeId}>
                  <td>{p.productId}</td>
                  <td>{p.amount}</td>
                  <td>{p.weight}</td>
                  <td>{<Expense num={p.price} />}</td>
                  <td>{<Expense num={p.price * p.weight} />}</td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  );
}
