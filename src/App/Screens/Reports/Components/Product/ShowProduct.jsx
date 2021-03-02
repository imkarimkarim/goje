import React, { useContext } from "react";
import { ProductsContext } from "../../../../Contexts/ProductsContext.js";
import Loading from '../../../../Components/Loading.jsx';

export default function ShowProduct() {
  
  const { products } = useContext(ProductsContext);
  
  let jsx;
  if(products.oneProduct) {
    jsx = products.oneProduct.productName;
  }  

  
  return (
    <div>
        i will show factor 
        {
          (jsx) ? jsx : <Loading />
        }
    </div>
  )
}