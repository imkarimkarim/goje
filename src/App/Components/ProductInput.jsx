import React, { useState, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { FixedSizeList } from "react-window";
import Button from "@material-ui/core/Button";
import Input from "./Input.jsx";
import ExpenseInput from './ExpenseInput.jsx';

function CustomerPicker({
  products,
  productState,
  setProductState,
  setShowCustomerPicker,
}) {
  const [search, setSearch] = useState("");

  if (search) {
    products = products.filter((p) => p.productName.includes(search));
  }

  const renderedItems = ({ index, style }) => (
    <ListItem
      button
      onClick={() => {
        setShowCustomerPicker(false);
        setProductState({
          name: products[index].productName,
          id: products[index].customeId,
        });
      }}
      key={index}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      {products[index].productName}
    </ListItem>
  );

  return (
    <div className="customerPicker">
      <input
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        value={search}
        placeholder="جستجو..."
        className="search"
      ></input>
      <FixedSizeList
        className="List"
        height={400}
        itemCount={products.length}
        itemSize={30}
        width={300}
      >
        {renderedItems}
      </FixedSizeList>
    </div>
  );
}

export default function ProductInput({ formDispatch, label }) {
  const [productState, setProductState] = useState({ name: "", id: "" });
  const [allproducts, setAllproducts] = useState();
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  const addProductToFactor = () => {
    formDispatch({
      type: "addProduct",
      payload1: productState.id,
      payload2: amount,
      payload3: weight,
      payload4: price,
    });
  };

  const sendAllproducts = () => {
    ipcRenderer.send("send-allProducts");
  };

  const handleFocus = (e) => {
    sendAllproducts();
    setProductState({ name: "", id: "" });
    setShowCustomerPicker(true);
  };

  const test = (e) => {
    console.log(e.target.value);
  };

  useEffect(() => {
    console.log("log");
    // if (allproducts || productState.id !== '') {
    //   let theProduct = allproducts.filter((p) => p.customeId === productState.id);
    //   if (theProduct.length > 0) {
    //     setProductState({...productState, name: theProduct[0].productName});
    //     setAllproducts();
    //   }
    // }
    ipcRenderer.on("allProducts", (event, dbproducts) => {
      setAllproducts(dbproducts);
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("allproducts");
    };
  });

  return (
    <div className="productInput-wrapper">
      {showCustomerPicker && allproducts ? (
        <CustomerPicker
          products={allproducts}
          setProductState={setProductState}
          productState={productState}
          setShowCustomerPicker={setShowCustomerPicker}
        />
      ) : (
        ""
      )}
      <TextField
        id="outlined-basic"
        size="small"
        variant="outlined"
        value={productState.name}
        label={label}
        onFocus={handleFocus}
      />
      <Input
        value={amount}
        label="تعداد"
        fun={(e) => {
          setAmount(e.target.value);
        }}
      />
      <Input
        value={weight}
        label="وزن"
        fun={(e) => {
          setWeight(e.target.value);
        }}
      />
      <ExpenseInput
        value={price}
        label="فی"
        fun={(e) => {
          setPrice(e.target.value);
        }}
      />
      <Button
        className="newFactorAddProductInputButton"
        disabled={!(productState && amount && weight && price)}
        onClick={addProductToFactor}
        variant="outlined"
        color="primary"
      >
        اضافه
      </Button>
    </div>
  );
}
