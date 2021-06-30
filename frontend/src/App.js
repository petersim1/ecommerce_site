import {useEffect,useState} from 'react';
import {BrowserRouter as Router,Route} from 'react-router-dom'

import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Home from './components/layout/Home'
import ProductDetails from './components/product/ProductDetails'
import Login from './components/user/Login'
import Register from './components/user/Register'
import Profile from './components/user/Profile'
import UpdateProfile from './components/user/UpdateProfile'
import UpdatePassword from './components/user/UpdatePassword'
import ForgotPassword from './components/user/ForgotPassword'
import NewPassword from './components/user/NewPassword'
import Cart from './components/cart/Cart'
import Shipping from './components/cart/Shipping'
import ConfirmOrder from './components/cart/ConfirmOrder'
import Payment from './components/cart/Payment'
import OrderSuccess from './components/cart/OrderSuccess'
import ListOrders from './components/order/ListOrders'
import OrderDetails from './components/order/OrderDetails'

import Dashboard from './components/admin/Dashboard'
import ProductsList from './components/admin/ProductsList'
import NewProduct from './components/admin/NewProduct'
import UpdateProduct from './components/admin/UpdateProduct'
import OrdersList from './components/admin/OrdersList'
import ProcessOrder from './components/admin/ProcessOrder'
import UsersList from './components/admin/UsersList'
import UpdateUser from './components/admin/UpdateUsers'
import ProductReviews from './components/admin/ProductReviews'


import ProtectedRoute from './components/route/ProtectedRoute'

import {loadUser} from './actions/userActions'
import store from './store'

import axios from 'axios'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

import './App.css';

function App() {

  const [stripeApiKey,setStripeApiKey] = useState('')

  useEffect(() => {

    store.dispatch(loadUser())

    axios({
      method: "get",
      url: `/api/v1/stripeapi`,
      headers: { "Content-Type": 'application/json' },
      })
      .then(response => {
          const {data} = response;
          setStripeApiKey(data.stripeApiKey)
      })
      .catch(error => {
          Error(error.response.data.errMessage)
      });

  },[])

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Route path='/' component={Home} exact/>
          <Route path='/search/:keyword' component={Home} />
          <Route path='/product/:id' component={ProductDetails} exact/>
          <Route path='/login' component={Login} />
          <Route path='/register' component={Register}/>
          <ProtectedRoute path='/me' component={Profile} exact/>
          <ProtectedRoute path='/me/update' component={UpdateProfile} exact/>
          <ProtectedRoute path='/password/update' component={UpdatePassword} exact/>
          <Route path='/password/reset/:token' component={NewPassword} exact/>
          <Route path='/password/forgot' component={ForgotPassword} exact/>
          
          <Route path='/cart' component={Cart} exact/>
          <ProtectedRoute path='/shipping' component={Shipping} exact/>
          <ProtectedRoute path='/confirm' component={ConfirmOrder} exact/>
          <ProtectedRoute path='/success' component={OrderSuccess} exact/>
          {stripeApiKey &&
            <Elements stripe={loadStripe(stripeApiKey)}>
              <ProtectedRoute path="/payment" component={Payment} />
            </Elements>
          }
          <ProtectedRoute path='/orders/me' component={ListOrders} exact/>
          <ProtectedRoute path='/order/:id' component={OrderDetails} exact/>
        </div>
        <ProtectedRoute path='/dashboard' component={Dashboard} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/products' component={ProductsList} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/product' component={NewProduct} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/product/:id' component={UpdateProduct} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/orders' component={OrdersList} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/order/:id' component={ProcessOrder} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/users' component={UsersList} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/user/:id' component={UpdateUser} isAdmin={true} exact/>
        <ProtectedRoute path='/admin/reviews' component={ProductReviews} isAdmin={true} exact/>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
