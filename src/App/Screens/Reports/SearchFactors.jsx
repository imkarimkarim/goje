import React, {useContext} from 'react';
import {ProductsContext} from '../../Contexts/ProductsContext.js';

export default function SearchAllFactors() {
  const {products} = useContext(ProductsContext);
  
  console.log(products);
  return(
    <div>
      searching....
    </div>
  )
}