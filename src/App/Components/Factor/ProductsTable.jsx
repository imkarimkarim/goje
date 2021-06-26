import React, { useState, useRef, useEffect } from "react";
const { ipcRenderer } = require("electron");
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import DeleteIcon from "@material-ui/icons/Delete";
import TableRow from "@material-ui/core/TableRow";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import Notif from "../Notif.jsx";
import { Link } from "react-router-dom";
import "./ProductsTable.css";

export default function ProductsTable({ products, formDispatch, shouldLink }) {
  const [allUnFinishedProducts, setAllUnFinishedProducts] = useState();
  const [notif, setNotif] = useState(null);
  const init = useRef(true);

  const isProductInUnfinishedProducts = (productId) => {
    const aufp = allUnFinishedProducts;
    for (let i = 0; i < aufp.length; i++) {
      console.log(aufp[i].customeId, productId);
      if (aufp[i].customeId === productId) {
        return true;
      }
    }
    return false;
  };

  const getUnFinishedProducts = () => {
    ipcRenderer.send("getUnFinishedProducts");
  };

  useEffect(() => {
    if (init.current) {
      getUnFinishedProducts();
      init.current = false;
    }
    ipcRenderer.on("getUnFinishedProducts", (event, dbproducts) => {
      setAllUnFinishedProducts(dbproducts);
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getUnFinishedProducts");
    };
  });

  let notifJsx;
  if (notif === "success")
    notifJsx = <Notif type="success" message="با موفقیت حذف شد" />;
  if (notif === "error")
    notifJsx = (
      <Notif
        type="error"
        message="صافی این بار بسته شده است. امکان حذف وجود ندارد"
      />
    );

  return (
    <div className="ProductsTable">
      {notifJsx ? notifJsx : ""}
      <table>
        <thead>
          <tr>
            <th></th>
            <th>شرح بار</th>
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
                  <td>{index + 1}</td>
                  {shouldLink === true ? (
                    <td>
                      <Link to={"/product/" + p.productId}>
                        {p.productName}
                      </Link>
                    </td>
                  ) : (
                    <td>{p.productName}</td>
                  )}
                  <td>{p.amount}</td>
                  <td>{p.weight}</td>
                  <td>{<Expense num={p.price} />}</td>
                  <td>
                    {
                      <Expense
                        num={Math.round(100 * (p.price * p.weight)) / 100}
                      />
                    }
                  </td>
                  {formDispatch ? (
                    isProductInUnfinishedProducts(p.productId) ? (
                      <td
                        onDoubleClick={() => {
                          formDispatch({
                            type: "removeProduct",
                            payload: index,
                          });
                          setNotif(null);
                          setTimeout(function () {
                            setNotif("success");
                          }, 10);
                        }}
                      >
                        <DeleteIcon />
                      </td>
                    ) : (
                      <td
                        onDoubleClick={() => {
                          setNotif(null);
                          setTimeout(function () {
                            setNotif("error");                            
                          }, 10);
                        }}
                      >
                        <DeleteIcon />
                      </td>
                    )
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
