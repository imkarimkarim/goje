import React, {useContext} from 'react';
import ScreenTitle from '../../Components/ScreenTitle.jsx';
import {Link} from "react-router-dom";
import Button from '@material-ui/core/Button';
import { ProductsContext } from "../../Contexts/ProductsContext.js";


export default function Reports() {
  
  const { sendAllProducts } = useContext(ProductsContext);
  
  return (
    <div>
      <ScreenTitle title='گزارش گیری' />
      <div onClick={sendAllProducts}><Button variant="outlined"><Link to='/searchProducts'>صافی ها</Link></Button></div>
      صافی |‌ نسیه ها |‌ نقدی ها
    </div>
  )
}