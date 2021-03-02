import React, { useContext } from "react";
import { ProductsContext } from "../../Contexts/ProductsContext.js";
import Loading from "../../Components/Loading.jsx";
import List from "@material-ui/core/List";
import ResultsListItem from "./Components/ResultsListItem.jsx";
import {Link} from "react-router-dom";

export default function SearchProducts() {
  const { sendOneProduct, products } = useContext(ProductsContext);
  let resultsList;
  if(products.allProducts){
    resultsList = products.allProducts.map((product) => {
      return (
        <div key={product.customeId} onClick={() => {sendOneProduct(product.customeId)}}>
          <Link to='/showProduct'>
            <ResultsListItem
              productName={product.productName}
              owner={product.owner}
              customeId={product.customeId}
            />
        </Link>
      </div>
      );
    });
  }


  return <div>{products.allProducts ? <List>{resultsList}</List> : <Loading />}</div>;
}
