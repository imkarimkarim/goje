import React, { useState, useRef, useEffect } from "react";
import Loading from "../../Components/Loading.jsx";
import List from "@material-ui/core/List";
import ResultsListItem from "./Components/ResultsListItem.jsx";
import {Link} from "react-router-dom";
const {ipcRenderer} = require('electron');

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
        <Link key={product.customeId} to={`/showProduct/${product.customeId}`}>
          <ResultsListItem
            productName={product.productName}
            owner={product.owner}
            customeId={product.customeId}
          />
      </Link>
      );
    });
  }


  return <div>{products ? <List>{resultsList}</List> : <Loading />}</div>;
}
