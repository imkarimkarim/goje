import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/SearchBox.jsx";
import JDate from 'jalali-date';

const oneMonth = 2419200000;

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: false,
  fromm: Date.now() - oneMonth,
  till: Date.now()
};

export default function SearchProducts() {
  const [products, setProducts] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const init = useRef(true);
  
  const handleNewSearch = (newSearchState) => {
    setSearchState(newSearchState);
    searchProducts(newSearchState);
  }

  const searchProducts = (newSearchState) => {
    ipcRenderer.send("search-products", newSearchState);
  };
  
  useEffect(() => {
    if (init.current) {
      searchProducts(defalutSearchState);
      init.current = false;
    }
    
    ipcRenderer.on("search-products", (event, allProducts) => {
      setProducts(allProducts);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("search-products");
    };
  });

  let resultsList;
  if (products) {
    resultsList = products.map((product) => {
      let tmpShowDate = new JDate(new Date(product.arrivalDate));
      let arrivalDate = tmpShowDate.format("dddd DD MMMM YYYY");
      return (
        <Link
          key={product.customeId}
          to={`/productReports/${product.customeId}`}
        >
          <SearchResultItem
            itemTitle={product.productName + ' ' + product.owner}
            titleHint={arrivalDate + '   ' + product.customeId}
            customeId={product.customeId}
          />
        </Link>
      );
    });
  }

  return (
    <div>
      <Nav title="/گزارش گیری/صافی ها" />
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {handleNewSearch(newSearchState)}}
        label1="صافی های باز"
        label2="صافی های بسته"
      />
      {products ? <List>{resultsList}</List> : <Loading />}
    </div>
  );
}
