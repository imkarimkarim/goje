import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import Input from "../Input.jsx";
import ExpenseInput from '../ExpenseInput.jsx';
import './ProductInput.css';
import ShowDate from '../ShowDate.jsx';

function CustomerPicker({
  products,
  productState,
  setProductState,
  setShowCustomerPicker,
}) {
  const [search, setSearch] = useState("");

  const handleKeyBoardEvent = (e) => {
    if(e.key === 'Escape') setShowCustomerPicker(false);
  }
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyBoardEvent);
    
    return () => {
      document.removeEventListener('keydown', handleKeyBoardEvent);
    }
  })

  if (search) {
    products = products.filter((p) => (p.productName + " " + p.owner).includes(search));
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
        document.getElementById('focusOnMe2').focus();
      }}
      key={index}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      {`${products[index].productName} ${products[index].owner} `}
      <span className="hint"><ShowDate timestamp={products[index].arrivalDate} /></span>
      <span className="hint">{products[index].plaque}</span>
    </ListItem>
  );

  return (
    <div className="customePicker">
      <input
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        value={search}
        placeholder="جستجو..."
        className="search"
        autoFocus
      ></input>
      <FixedSizeList
        className="List"
        height={400}
        itemCount={products.length}
        itemSize={30}
        width={550}
      >
        {renderedItems}
      </FixedSizeList>
    </div>
  );
}

const defaultState = { name: "", id: "" };

const ProductInput = React.memo(({ formDispatch, label }) => {
  const [productState, setProductState] = useState(defaultState);
  const [allproducts, setAllproducts] = useState();
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);
  const [amount, setAmount] = useState("");
  const [weight, setWeight] = useState("");
  const [price, setPrice] = useState("");

  const addProductToFactor = () => {
    formDispatch({
      type: "addProduct",
      payload1: productState.id,
      payload5: productState.name,
      payload2: amount,
      payload3: weight,
      payload4: price,
    });
    setProductState(defaultState);
    setAmount('');
    setWeight('');
    setPrice('');
    document.getElementById('focusOnMe1').focus();
  };

  const sendAllproducts = () => {
    ipcRenderer.send("send-allProducts");
  };

  const handleFocus = (e) => {
    sendAllproducts();
    setProductState({ name: "", id: "" });
    setShowCustomerPicker(true);
  };


  useEffect(() => {
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
        id="focusOnMe1"
        size="small"
        variant="outlined"
        value={productState.name}
        label={label}
        onFocus={handleFocus}
      />
      <Input
        id="focusOnMe2"
        value={amount}
        label="تعداد*"
        fun={(e) => {
          setAmount(e.target.value);
        }}
      />
      <Input
        value={weight}
        label="وزن*"
        fun={(e) => {
          setWeight(e.target.value);
        }}
      />
      <ExpenseInput
        value={price}
        label="فی*"
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
})

export default ProductInput;