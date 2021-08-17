import React, { useState, useRef, useEffect, useContext } from "react";
const { ipcRenderer } = require("electron");
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Divider from "@material-ui/core/Divider";
import Expense from "../Expense.jsx";
import IncludeProductInputEditor from "./IncludeProductInputEditor.jsx";
import "./IncludeProductTable.css";
import { NotifContext } from "../../Contexts/NotifContext.jsx";
import { isRangeOk } from "../../utils";

export default function EditCarTable({ products, formDispatch, handleSubmit }) {
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

  const handleRemove = (productId) => {
    ipcRenderer.send("isProductHasDependency", productId);
  };

  const removeProduct = (productId) => {
    ipcRenderer.send("removeProduct", productId);
  };

  useEffect(() => {
    if (init.current) {
      getUnFinishedProducts();
      init.current = false;
    }

    ipcRenderer.on("getUnFinishedProducts", (event, dbproducts) => {
      setAllUnFinishedProducts(dbproducts);
    });

    ipcRenderer.on("isProductHasDependency", (event, dependencyStatus) => {
      if (dependencyStatus.status === true) {
        pushNotif("error", dependencyStatus.message);
      } else if (dependencyStatus.status === false) {
        removeProduct(dependencyStatus.productId);
        formDispatch({
          type: "removeProduct",
          payload: dependencyStatus.productId,
        });
        handleSubmit();
      }
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("getUnFinishedProducts");
      ipcRenderer.removeAllListeners("isProductHasDependency");
    };
  });

  return (
    <div className="IncludeProductsTable">
      {productToEdit ? (
        <IncludeProductInputEditor
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
            <th>علامت</th>
            <th>تعداد</th>
            <th>وزن</th>
            <th>فی حدودی</th>
          </tr>
        </thead>
        <tbody>
          {products && products.length > 0 ? (
            products.map((p, index) => {
              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{p.productName}</td>
                  <td>{p.signHint}</td>
                  <td>{p.amount}</td>
                  <td>{p.weight}</td>
                  <td>{<Expense num={p.price} />}</td>
                  {formDispatch && products.length !== 1 ? (
                    formDispatch &&
                    isProductInUnfinishedProducts(p.customeId) ? (
                      <td>
                        <span onDoubleClick={() => handleRemove(p.customeId)}>
                          <DeleteIcon />
                        </span>
                        <span
                          onDoubleClick={() =>
                            setProductToEdit({
                              index: index,
                              name: p.productName,
                              id: p.customeId,
                              signHint: p.signHint,
                              amount: p.amount,
                              weight: p.weight,
                              price: p.price,
                            })
                          }
                        >
                          <EditIcon />
                        </span>
                      </td>
                    ) : p.customeId && p.customeId.length > 0 ? (
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
                        <span
                          onDoubleClick={() =>
                            setProductToEdit({
                              index: index,
                              name: p.productName,
                              id: p.customeId,
                              signHint: p.signHint,
                              amount: p.amount,
                              weight: p.weight,
                              price: p.price,
                            })
                          }
                        >
                          <EditIcon />
                        </span>
                      </td>
                    ) : (
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
                          onDoubleClick={() =>
                            setProductToEdit({
                              index: index,
                              name: p.productName,
                              id: p.customeId,
                              signHint: p.signHint,
                              amount: p.amount,
                              weight: p.weight,
                              price: p.price,
                            })
                          }
                        >
                          <EditIcon />
                        </span>
                      </td>
                    )
                  ) : (
                    <td>
                      <span
                        onDoubleClick={() => {
                          setTimeout(function () {
                            pushNotif(
                              "error",
                              "حداقل باید یک بار باقی بماند. امکان حذف ندارد"
                            );
                          }, 10);
                        }}
                      >
                        <DeleteIcon />
                      </span>
                      <span
                        onDoubleClick={() =>
                          setProductToEdit({
                            index: index,
                            name: p.productName,
                            id: p.customeId,
                            signHint: p.signHint,
                            amount: p.amount,
                            weight: p.weight,
                            price: p.price,
                          })
                        }
                      >
                        <EditIcon />
                      </span>
                    </td>
                  )}
                </tr>
              );
            })
          ) : (
            <tr></tr>
          )}
        </tbody>
      </table>
      <Divider />
    </div>
  );
}
