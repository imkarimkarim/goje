import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/SearchBox.jsx";
import JDate from "jalali-date";
import ShowDate from "../../Components/ShowDate.jsx";

const oneMonth = 2419200000;
const oneYear = oneMonth * 12;

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: false,
  fromm: Date.now() - oneYear,
  till: Date.now(),
};

const toggleItems = (items, newItem, callback) => {
  if(!items && !newItem) return;
  const index = items.indexOf(newItem);
  if(index < 0){
    items = [...items, newItem]
  } else {
    items.splice(index, 1);
  }
  if (typeof callback === "function") {
    console.log(items);
    callback(items);
  }
}

export default function SearchProducts() {
  const [products, setProducts] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const [checkeds, setCheckeds] = useState([""]);
  const init = useRef(true);

  const handleNewSearch = (newSearchState) => {
    setSearchState(newSearchState);
    searchProducts(newSearchState);
  };

  const searchProducts = (newSearchState) => {
    ipcRenderer.send("search-products", newSearchState);
  };

  useEffect(() => {
    if (init.current) {
      searchProducts(defalutSearchState);
      init.current = false;
    }

    ipcRenderer.on("search-products", (event, findedProducts) => {
      setProducts(findedProducts);
    });

    // clean up
    return () => {
      ipcRenderer.removeAllListeners("search-products");
    };
  });

  let resultsList;
  let filteredProducts;
  filteredProducts = products;
  if (products) {
    if (searchState.text.length > 0) {
      filteredProducts = products.filter((p) =>
        (p.productName + " " + p.owner).includes(searchState.text)
      );
    }
    resultsList = filteredProducts.map((product) => {
      return (
        <div key={product.customeId}>
          <SearchResultItem
            itemTitle={product.productName + " " + product.owner}
            titleHint={<ShowDate timestamp={product.arrivalDate} />}
            customeId={product.customeId}
            onChecked={(checked) => {
              toggleItems(checkeds, checked, (newCheckeds) => {
                setCheckeds(newCheckeds);
              })
            }}
            to={`/product/${product.customeId}`}
          />
        </div>
      );
    });
  }

  return (
    <div>
      <Nav title="/گزارشات/جستجوی صافی" />
      <SearchBox
        defaultState={searchState}
        onSubmit={(newSearchState) => {
          handleNewSearch(newSearchState);
        }}
        label1="صافی های باز"
        label2="صافی های بسته"
        placeholder="مثال: آناناس پلنگ صورتی"
      />
      {products ? (
        <div>
          <p className="hint">{`${products.length} صافی پیدا شد.`}</p>
          <List>{resultsList}</List>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
