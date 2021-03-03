import React from 'react';
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";

export default function Info({product}) {
  
    let tmpJdate;
    let arrivalDate;
    if (product) {
      tmpJdate = new JDate(product.arrivalDate.date);
      arrivalDate = tmpJdate.format("dddd DD MMMM YYYY");
    }

    if (product && product.isProductFinish) {
      tmpJdate = new JDate(product.finishDate.date);
      finishDate = tmpJdate.format("dddd DD MMMM YYYY");
    }
  
  return (
    <div className="info">
      <h3>اطلاعات بار <Divider /></h3>
      <div className="customeId">کد بار: {product.customeId}</div>
      <div className="name">شرح بار: {product.productName}</div>
      <div className="owner">صاحب بار: {product.owner}</div>
      <div className="arrivalDate">تاریخ ورود: {arrivalDate}</div>
      <div className="finishDate">
        تاریخ بستن سافی: 
        {
          product.isProductFinish
          ? (
            finishDate
          ) : (
            'سافی هنوز باز است'
          )
        }
      </div>
    </div>
  )
};
 