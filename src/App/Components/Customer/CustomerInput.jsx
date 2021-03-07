import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import "./CustomerInput.css";


function CustomerPicker({ customers, formDispatch, setShowCustomerPicker }) {
  const [search, setSearch] = useState("");

  if (search) {
    customers = customers.filter((c) => c.name.includes(search));
  }

  const renderedItems = ({ index, style }) => (
    <ListItem
      button
      onClick={() => {
        formDispatch({ type: "setOwner", payload: customers[index].customeId });
        setShowCustomerPicker(false);
      }}
      key={index}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      {customers[index].name + ' ' + customers[index].address}
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
        itemCount={customers.length}
        itemSize={30}
        width={300}
      >
        {renderedItems}
      </FixedSizeList>
    </div>
  );
}

const CustomerInput = React.memo(({ owner, formDispatch, label }) => {
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [allCustomers, setAllCustomers] = useState();
  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const sendAllCustomers = () => {
    ipcRenderer.send("allCustomers");
  };

  const handleFocus = (e) => {
    sendAllCustomers();
    setShowCustomerPicker(true);
  };

  useEffect(() => {
    console.log('log');
    if (allCustomers) {
      let theCustomer = allCustomers.filter((c) => c.customeId === owner);
      if(theCustomer.length > 0){
        setCustomerName(theCustomer[0].name);
        setCustomerAddress(theCustomer[0].address)
      }
    }
    ipcRenderer.on("allCustomers", (event, dbCustomers) => {
      setAllCustomers(dbCustomers);
    });
    // clean up
    return () => {
      ipcRenderer.removeAllListeners("allCustomers");
    };
  });

  return (
    <span className="customerInput">
      {showCustomerPicker && allCustomers ? (
        <CustomerPicker
          customers={allCustomers}
          formDispatch={formDispatch}
          setShowCustomerPicker={setShowCustomerPicker}
        />
      ) : (
        ""
      )}
      <TextField
        id="outlined-basic"
        size="small"
        variant="outlined"
        value={customerName}
        label={label}
        onFocus={handleFocus}
      />
    <span className="customer-input-sub hint">{owner} | {customerAddress}</span>
    </span>
  );
})

export default CustomerInput;
