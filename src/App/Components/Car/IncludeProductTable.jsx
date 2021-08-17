import React from "react";
const { ipcRenderer } = require("electron");
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import "./IncludeProductTable.css";

export default function IncludeProductTable({ products, formDispatch }) {
  return (
    <div className="IncludeProductsTable">
      <table>
        <thead>
          <tr>
            <th></th>
            <th>شرح بار</th>
            <th>علامت</th>
            <th>تعداد</th>
            <th>وزن</th>
            <th>فی حدودی</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0
            ? products.map((p, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{p.productName}</td>
                    <td>{p.signHint}</td>
                    <td>{p.amount}</td>
                    <td>{p.weight}</td>
                    <td>{<Expense num={p.price} />}</td>
                    <td
                      onDoubleClick={() => {
                        formDispatch({
                          type: "removeProduct",
                          payload: index,
                        });
                      }}
                    >
                      <DeleteIcon />
                    </td>
                  </tr>
                );
              })
            : ""}
        </tbody>
      </table>
      <Divider />
    </div>
  );
}
