import React, {createContext, useState, useRef} from 'react';
const {ipcRenderer} = require('electron');

const ProductsContext = createContext();

const ProductsProvider = ({children}) => {
  const [products, setProducts] = useState({allProducts: false, oneProduct: false});

  const sendAllProducts = () => {
    ipcRenderer.send('send-allProducts');
  }
  ipcRenderer.on('allProducts', (event, allProducts) => {
    console.log('allProducts');
    setProducts({...products, allProducts: allProducts});
  })
  
  const sendOneProduct = (id) => {
    ipcRenderer.send('send-oneProduct', id);
  }
  ipcRenderer.on('oneProduct', (event, oneProduct) => {
    console.log('oneProduct');
    setProducts({...products, oneProduct: oneProduct});
  })

  return (<ProductsContext.Provider value={{
      products, sendAllProducts, sendOneProduct
    }}>
    {children}
  </ProductsContext.Provider>);
};

export {
  ProductsProvider,
  ProductsContext
};