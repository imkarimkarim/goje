import React from 'react';
import JDate from "jalali-date";
import Divider from "@material-ui/core/Divider";
import Grid from '@material-ui/core/Grid';

export default function Info({product}) {
  
    let tmpJdate;
    let arrivalDate;
    if (product) {
      tmpJdate = new JDate(new Date(product.arrivalDate));
      arrivalDate = tmpJdate.format("dddd DD MMMM YYYY");
    }

    if (product && product.isProductFinish) {
      tmpJdate = new JDate(product.finishDate.date);
      finishDate = tmpJdate.format("dddd DD MMMM YYYY");
    }
  
  return (
    <div className="info">
        <h3>اطلاعات بار <Divider /></h3>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <div className="customeId">کد بار: {product.customeId}</div>
            <div className="name">شرح بار: {product.productName}</div>
            <div className="owner">صاحب بار: {product.owner}</div>
            <div className="arrivalDate">تاریخ ورود: {arrivalDate}</div>
            <div className="finishDate">
              تاریخ بستن صافی: 
              {
                product.isProductFinish
                ? (
                  finishDate
                ) : (
                  'صافی هنوز باز است'
                )
              }
            </div>
          </Grid>
          <Grid item xs={4}>
            <div>باسکول: {product.basculeWeight} کیلوگرم</div>
            <div>تعداد: {product.amount}</div>
          </Grid>
          <Grid item xs={2}>
            <div className='driverInfo'>
              <div>اطلاعات راننده</div>
              <div>{product.driverInfo.name}</div>
              <div>{product.driverInfo.car}</div>
              <div>{product.driverInfo.plaque}</div>
            <div>{product.driverInfo.phoneNumber}</div>
            </div>
          </Grid>
      </Grid>
    </div>
  )
};
 