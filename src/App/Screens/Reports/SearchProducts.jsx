import React, { useState, useRef, useEffect } from "react";
import {Link} from "react-router-dom";
const {ipcRenderer} = require('electron');
import List from "@material-ui/core/List";
import SearchResultItem from '../../Components/SearchResultItem.jsx';
import Loading from "../../Components/Loading.jsx";

export default function SearchProducts() {
  const [products, setProducts] = useState(false);
  const init = useRef(true);
  
  const sendAllProducts = () => {
    ipcRenderer.send('send-allProducts');
  }
  
  useEffect(() => {
    if(init.current){
      sendAllProducts();
      ipcRenderer.on('allProducts', (event, allProducts) => {
        init.current = false;
        setProducts(allProducts);
      })
    }
    
    // clean up
    return () => {
      ipcRenderer.removeAllListeners('allProducts');
    }
  })
  
  
  let resultsList;
  if(products){
    resultsList = products.map((product) => {
      return (
        <Link key={product.customeId} to={`/productReports/${product.customeId}`}>
          <SearchResultItem
            itemTitle={product.productName}
            titleHint={product.owner}
            customeId={product.customeId}
          />
      </Link>
      );
    });
  }


  return <div>{products ? <List>{resultsList}</List> : <Loading />}</div>;
}
