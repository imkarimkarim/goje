import React, {useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Welcome from './Screens/Welcome/Welcome.jsx';
import Container from '@material-ui/core/Container';
import IncludeProduct from './Screens/IncludeProduct/IncludeProduct.jsx';
import NewFactor from './Screens/NewFactor/NewFactor.jsx';
import NewCustomer from './Screens/NewCustomer/NewCustomer.jsx';
import Reports from './Screens/Reports/Reports.jsx';
import Product from './Components/Product/Product.jsx';
import Factor from './Components/Factor/Factor.jsx';
import SearchProducts from './Screens/Reports/SearchProducts.jsx';
import SearchFactors from './Screens/Reports/SearchFactors.jsx';
import EditFactor from './Components/Factor/EditFactor.jsx';
import EditProduct from './Components/Product/EditProduct.jsx';
import PrintProduct from './Screens/Reports/PrintProduct.jsx';
import PrintFactors from './Screens/Reports/PrintFactors.jsx';

export default function App() {
  
  const redirectToIndex = useRef(true);
  
  useEffect(() => {
    if (redirectToIndex.current) {
      redirectToIndex.current = false;
    }
  });
  
  return (
    <Router>
      
      {/* redirect to / in first load */}
      {
        (redirectToIndex.current)
          ? <Redirect to='/welcome'/>
          : <div></div>
      }   
      <Container fixed>
          <Switch>
            <Route path='/welcome' component={Welcome} />
            <Route path='/includeProduct' component={IncludeProduct} />
            <Route path='/newFactor' component={NewFactor} />
            <Route path='/newCustomer' component={NewCustomer} />
            <Route path='/reports' component={Reports} />
            <Route path='/searchProducts' component={SearchProducts} />
            <Route path='/searchFactors' component={SearchFactors} />
            <Route path='/product/:id' component={Product} />
            <Route path='/factor/:id' component={Factor} />
            <Route path='/editFactor/:id' component={EditFactor} />
            <Route path='/editProduct/:id' component={EditProduct} />
            <Route path='/printProduct/:id' component={PrintProduct} />
            <Route path='/printFactors/:date/:date2' component={PrintFactors} />
          </Switch>
      </Container>
    </Router>
  );
}