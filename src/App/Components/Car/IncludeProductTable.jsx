import React from "react";
const { ipcRenderer } = require("electron");
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import "./IncludeProductTable.css";

export default function IncludeProductTable({ products, formDispatch }) {
  console.log(products);
  return (
    <div className="IncludeProductsTable">
      <table>
        <tbody>
          {products && products.length > 0
            ? products.map((p, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{p.productName}</td>
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
              ))
            : null}
        </tbody>
      </table>
      <Divider />
    </div>
  );
}
