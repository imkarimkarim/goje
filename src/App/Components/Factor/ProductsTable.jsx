import React, { useState, useRef, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import ProductInputEditor from "../Product/ProductInputEditor.jsx";
import { Link } from "react-router-dom";
import "./ProductsTable.css";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { isRangeOk } from "../../utils";

// // TODO: calcs[] for factor(goje vision for not calculating over and over)

export default function ProductsTable({ products, formDispatch, shouldLink }) {
  const [allUnFinishedProducts, setAllUnFinishedProducts] = useState();
  const { pushNotif } = useContext(NotifContext);
  const init = useRef(true);
  const [productToEdit, setProductToEdit] = useState();

  const isProductInUnfinishedProducts = (productId) => {
    const aufp = allUnFinishedProducts;
    for (let i = 0; i < aufp.length; i++) {
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

  return (
    <div className="ProductsTable">
      {productToEdit ? (
        <ProductInputEditor
          formDispatch={formDispatch}
          label="شرح بار*"
          state={productToEdit}
        />
      ) : (
        <span></span>
      )}
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
            ? products.map((p, index) => {
                const currentProduct = allUnFinishedProducts.filter(
                  (product) => product.customeId == p.productId
                )[0];
                return (
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
                    {currentProduct &&
                    currentProduct.warningCalcs &&
                    currentProduct.warningCalcs.productPriceLength != 0 ? (
                      currentProduct.warningCalcs.productPriceLength !=
                        p.price.toString().length &&
                      !isRangeOk(
                        p.price,
                        currentProduct.warningCalcs.productPrice -
                          (currentProduct.warningCalcs.productPrice * 1.5 -
                            currentProduct.warningCalcs.productPrice),
                        currentProduct.warningCalcs.productPrice * 1.5
                      ) ? (
                        <td className="notif-error">
                          {<Expense num={p.price} />}
                        </td>
                      ) : (
                        <td>{<Expense num={p.price} />}</td>
                      )
                    ) : (
                      <td>{<Expense num={p.price} />}</td>
                    )}

                    <td>
                      {
                        <Expense
                          num={Math.round(100 * (p.price * p.weight)) / 100}
                        />
                      }
                    </td>
                    {formDispatch ? (
                      isProductInUnfinishedProducts(p.productId) ? (
                        <td>
                          <span
                            onDoubleClick={() => {
                              formDispatch({
                                type: "removeProduct",
                                payload: index,
                              });
                            }}
                          >
                            <DeleteIcon />
                          </span>
                          <span
                            onDoubleClick={() => {
                              setProductToEdit({
                                name: p.productName,
                                id: p.productId,
                                amount: p.amount,
                                weight: p.weight,
                                price: p.price,
                                index: index,
                              });
                            }}
                          >
                            <EditIcon />
                          </span>
                        </td>
                      ) : (
                        <td
                          onDoubleClick={() => {
                            setTimeout(function () {
                              pushNotif(
                                "error",
                                "صافی این بار بسته شده است. امکان حذف یا ویرایش وجود ندارد"
                              );
                            }, 10);
                          }}
                        >
                          <DeleteIcon />
                          <EditIcon />
                        </td>
                      )
                    ) : (
                      <td></td>
                    )}
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>
      <Divider />
    </div>
  );
}
