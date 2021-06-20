import React, { useState, useEffect } from "react";
import { FixedSizeList } from "react-window";
import CloseIcon from '@material-ui/icons/Close';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import ListItem from "@material-ui/core/ListItem";


const CustomePicker = React.memo(({ customers, onPick, setShowCustomerPicker }) => {
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
    <div className="customePicker">
      <div className="closeIcon" onClick={() => {setShowCustomerPicker(false)}}><CloseIcon /></div>
      <p className="title">لیست مشتری ها<SupervisorAccountIcon /></p>
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
        width={600}
      >
        {renderedItems}
      </FixedSizeList>
    </div>
  );
})

export default CustomePicker;
