import React, { useEffect, useState } from "react";
import ListItem from "@material-ui/core/ListItem";
import { FixedSizeList } from "react-window";
import LocalGroceryStoreIcon from "@material-ui/icons/LocalGroceryStore";
import CloseIcon from "@material-ui/icons/Close";
import Input from "../Input.jsx";
import ShowDate from "../ShowDate.jsx";
import "./FactorProductPicker.css";
import InfoIcon from "@material-ui/icons/Info";

export default function FactorProductPicker({
  products,
  productState,
  setProductState,
  setShowProductPicker,
}) {
  const [search, setSearch] = useState("");

  const handleKeyBoardEvent = (e) => {
    if (e.key === "Escape") setShowProductPicker(false);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyBoardEvent);

    return () => {
      document.removeEventListener("keydown", handleKeyBoardEvent);
    };
  });

  if (search) {
    products = products.filter((p) =>
      (p.productName + " " + p.signHint + " " + p.owner).includes(search)
    );
  }

  const renderedItems = ({ index, style }) => (
    <ListItem
      button
      onClick={() => {
        setShowProductPicker(false);
        setProductState({
          name: products[index].productName,
          id: products[index].customeId,
        });
        document.getElementById("productAmount").focus();
      }}
      key={index}
      className={index % 2 ? "ListItemOdd" : "ListItemEven"}
      style={style}
    >
      <span className="productPicker-item">
        <div>
          {products[index].signHint === "" ||
          products[index].signHint === undefined
            ? products[index].productName + " " + products[index].owner
            : products[index].productName +
              " " +
              products[index].signHint +
              " " +
              products[index].owner}
        </div>
        <div className="hint">
          <ShowDate timestamp={products[index].arrivalDate} />
          {products[index].warningCalcs &&
          products[index].warningCalcs.averageWeigth !== 0 &&
          products[index].warningCalcs.productPrice !== 0 ? (
            <span
              title={`میانگین وزن:  ${products[index].warningCalcs.averageWeigth}
            فی حدودی: ${products[index].warningCalcs.productPrice}`}
            >
              <InfoIcon fontSize="small" />
            </span>
          ) : (
            <span></span>
          )}
        </div>
      </span>
    </ListItem>
  );

  return (
    <div
      className="customePickerWrapper"
      onClick={() => {
        setShowProductPicker(false);
      }}
    >
      <div className="product-customePicker">
        <div
          className="closeIcon"
          onClick={() => {
            setShowProductPicker(false);
          }}
        >
          <CloseIcon />
        </div>
        <p className="title">
          لیست بارها
          <LocalGroceryStoreIcon />
        </p>
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
          width={1000}
        >
          {renderedItems}
        </FixedSizeList>
      </div>
    </div>
  );
}
