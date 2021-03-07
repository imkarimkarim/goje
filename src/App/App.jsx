import React, {useRef, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import Welcome from './Screens/Welcome/Welcome.jsx';
import Container from '@material-ui/core/Container';
import IncludeProduct from './Screens/IncludeProduct/IncludeProduct.jsx';
import NewFactor from './Screens/NewFactor/NewFactor.jsx';
import NewCustomer from './Screens/NewCustomer/NewCustomer.jsx';
import Reports from './Screens/Reports/Reports.jsx';
import ProductReports from './Components/Product/ProductReports.jsx';
import searchProducts from './Screens/Reports/SearchProducts.jsx';

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
            <Route path='/searchProducts' component={searchProducts} />
            <Route path='/productReports/:id' component={ProductReports} />
          </Switch>
      </Container>
    </Router>
  );
}