import React, {createContext, useState, useRef} from 'react';
const {ipcRenderer} = require('electron');

const ProductsContext = createContext();

const ProductsProvider = ({children}) => {
  const [products, setProducts] = useState({name: 'karim'});

  // making sure component will not get in
  // re-rendering hell
  const stopReRendering = useRef(false);
  if(!stopReRendering.current){
    ipcRenderer.send('send-allProducts');
    console.log('sending ipc');
    stopReRendering.current = true;
  }

  ipcRenderer.on('allProducts', (event, arg) => {
    console.log('catcy');
    setProducts(arg);
  })

  return (<ProductsContext.Provider value={{
      products
    }}>
    {children}
  </ProductsContext.Provider>);
};

export {
  ProductsProvider,
  ProductsContext
};