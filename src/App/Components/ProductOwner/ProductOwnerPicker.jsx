import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import CloseIcon from "@material-ui/icons/Close";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import ListItem from "@material-ui/core/ListItem";
import "./ProductOwnerPicker.css";

const ProductOwnerPicker = React.memo(
  ({ productOwners, onPick, setShowProductOwnerPicker }) => {
    const [search, setSearch] = useState("");

    const handleKeyBoardEvent = (e) => {
      if (e.key === "Escape") setShowProductOwnerPicker(false);
    };

    useEffect(() => {
      document.addEventListener("keydown", handleKeyBoardEvent);

      return () => {
        document.removeEventListener("keydown", handleKeyBoardEvent);
      };
    });

    if (search) {
      productOwners = productOwners.filter((c) => c.name.includes(search));
    }

    const renderedItems = ({ index, style }) => (
      <ListItem
        button
        onClick={() => {
          onPick(productOwners[index].name, productOwners[index].customeId);
          setShowProductOwnerPicker(false);
          document.getElementById("plaque").focus();
        }}
        key={index}
        className={index % 2 ? "ListItemOdd" : "ListItemEven"}
        style={style}
      >
        {productOwners[index].name}
      </ListItem>
    );

    return (
      <div
        className="customePickerWrapper"
        onClick={() => {
          setShowProductOwnerPicker(false);
        }}
      >
        <div className="productOwner-customePicker">
          <div
            className="closeIcon"
            onClick={() => {
              setShowProductOwnerPicker(false);
            }}
          >
            <CloseIcon />
          </div>
          <p className="title">
            لیست صاحب بار ها
            <SupervisorAccountIcon />
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
            itemCount={productOwners.length}
            itemSize={35}
            width={500}
          >
            {renderedItems}
          </FixedSizeList>
        </div>
      </div>
    );
  }
);

export default ProductOwnerPicker;
