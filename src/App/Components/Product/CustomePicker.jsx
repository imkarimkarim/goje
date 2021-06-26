import React, { useEffect, useState } from 'react';
import ListItem from "@material-ui/core/ListItem";
import { FixedSizeList } from "react-window";
import LocalGroceryStoreIcon from '@material-ui/icons/LocalGroceryStore';
import CloseIcon from '@material-ui/icons/Close';
import Input from "../Input.jsx";
import ShowDate from '../ShowDate.jsx';
import './CustomePicker.css';

export default function CustomerPicker({
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
      <span className="hint">{products[index].plaque} - <ShowDate timestamp={products[index].arrivalDate} /></span>
    </ListItem>
  );

  return (
    <div className="product-customePicker">
      <div className="closeIcon" onClick={() => {setShowCustomerPicker(false)}}><CloseIcon /></div>
      <p className="title">لیست بارها<LocalGroceryStoreIcon /></p>
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
        height={300}
        itemCount={products.length}
        itemSize={35}
        width={800}
      >
        {renderedItems}
      </FixedSizeList>
    </div>
  );
}
