import React, {useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Welcome from './Screens/Welcome/Welcome.jsx';
import Container from '@material-ui/core/Container';
import IncludeProduct from './Screens/IncludeProduct/IncludeProduct.jsx';
import NewFactor from './Screens/NewFactor/NewFactor.jsx';
import NewCustomer from './Screens/NewCustomer/NewCustomer.jsx';
import Reports from './Screens/Reports/Reports.jsx';
import Nav from './Components/Nav.jsx';
import searchProducts from './Screens/Reports/SearchProducts.jsx';
import ShowProduct from './Screens/Reports/Components/Product/ShowProduct.jsx';
import {ProductsProvider} from './Contexts/ProductsContext.js';

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
        <ProductsProvider>
          <Nav />
          <Switch>
            <Route path='/welcome' component={Welcome} />
            <Route path='/includeProduct' component={IncludeProduct} />
            <Route path='/newFactor' component={NewFactor} />
            <Route path='/newCustomer' component={NewCustomer} />
            <Route path='/reports' component={Reports} />
            <Route path='/searchProducts' component={searchProducts} />
            <Route path='/showProduct' component={ShowProduct} />
          </Switch>
        </ProductsProvider>
      </Container>
    </Router>
  );
}