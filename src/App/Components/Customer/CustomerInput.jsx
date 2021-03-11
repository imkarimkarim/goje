import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
const { ipcRenderer } = require("electron");
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import "./CustomerInput.css";


const CustomerPicker = React.memo(({ customers, onPick, setShowCustomerPicker }) => {
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
    customers = customers.filter((c) => c.name.includes(search));
  }

  const renderedItems = ({ index, style }) => (
    <ListItem
      button
      onClick={() => {
        onPick(customers[index].customeId, customers[index].name);
        setShowCustomerPicker(false);
      }}
      key={index}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      {customers[index].name}
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
        autoFocus
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
})

const CustomerInput = React.memo(({ owner, onPick, label }) => {
  const [customerName, setCustomerName] = useState('');
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
    if (allCustomers) {
      let theCustomer = allCustomers.filter((c) => c.customeId === owner);
      console.log(allCustomers[0].customeId, owner);
      if(theCustomer.length > 0){
        setCustomerName(theCustomer[0].name);
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
          onPick={onPick}
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
    <span className="customer-input-sub hint">{owner}</span>
    </span>
  );
})

export default CustomerInput;
