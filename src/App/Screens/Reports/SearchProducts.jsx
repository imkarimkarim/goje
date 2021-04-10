import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
const { ipcRenderer } = require("electron");
import List from "@material-ui/core/List";
import Button from "@material-ui/core/Button";
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DescriptionIcon from '@material-ui/icons/Description';
import CloseIcon from '@material-ui/icons/Close';
import SearchResultItem from "../../Components/SearchResultItem.jsx";
import Loading from "../../Components/Loading.jsx";
import Nav from "../../Components/Nav.jsx";
import SearchBox from "../../Components/SearchBox.jsx";
import JDate from "jalali-date";
import ShowDate from "../../Components/ShowDate.jsx";
import './SearchProducts.css';
import {cleanTime, oneDay, oneYear} from '../../util.js';

const defalutSearchState = {
  text: "",
  checked1: true,
  checked2: false,
  fromm: cleanTime(Date.now() - oneYear),
  till: cleanTime(Date.now()) + oneDay,
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
    callback(items);
  }
}

export default function SearchProducts() {
  const [products, setProducts] = useState(false);
  const [searchState, setSearchState] = useState(defalutSearchState);
  const [checkeds, setCheckeds] = useState([]);
  const [productsToReport, setProductsToReport] = useState();
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
      if(product.isProductFinish){
        return (
          <div key={product.customeId}>
            <SearchResultItem
              itemTitle={product.productName + " " + product.owner + " (" + product.basculeWeight + ")"}
              titleHint={<span><ShowDate timestamp={product.arrivalDate} /> {product.plaque ? <span>- {product.plaque}</span> : <span></span>}  <DoneAllIcon style={{ color: 'green' }}/></span>}
              customeId={product.customeId}
              onChecked={(checked) => {
                toggleItems(checkeds, checked, (newCheckeds) => {
                  setCheckeds(newCheckeds);
                  setProductsToReport(newCheckeds.toString());
                })
              }}
              to={`/product/${product.customeId}`}
            />
          </div>
        )        
      } else {
        return (
          <div key={product.customeId}>
            <SearchResultItem
              itemTitle={product.productName + " " + product.owner + " (" + product.basculeWeight + ")"}
              titleHint={<span><ShowDate timestamp={product.arrivalDate} /> {product.plaque ? <span>- {product.plaque}</span> : <span></span>}  <CloseIcon style={{ color: 'red' }}/></span>}
              customeId={product.customeId}
              to={`/product/${product.customeId}`}
            />
          </div>
        )    
      }

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
          {
            checkeds.length > 0 ?
              <div className="advanceProductsPrint">
                <Link to={'printProducts/' + productsToReport}>
                  <Button
                    className="newProductAddProductInputButton"
                    variant="contained"
                    color="primary"
                  >                  
                  گزارش پیشرفته
                  <DescriptionIcon />
                </Button>
                </Link>
              </div>
              : <span></span>
          }

          <p className="hint">{`${resultsList.length} صافی پیدا شد.`}</p>
          <List>{resultsList}</List>
          <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
}
