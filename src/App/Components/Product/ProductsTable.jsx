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
import "./ProductsTable.css";

export default function ProductsTable({ products, formDispatch }) {
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
    </div>
  );
}
