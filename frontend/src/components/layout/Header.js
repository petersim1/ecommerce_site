import React, { Fragment } from 'react'
import { Route, Link } from 'react-router-dom'
import {Dropdown} from 'react-bootstrap';

import { useDispatch, useSelector } from 'react-redux'
import { useAlert } from 'react-alert'
import { logoutUser } from '../../actions/userActions'

import Search from './Search'


const Header = () => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { user, loading } = useSelector(state => state.auth)
    const { cartItems } = useSelector(state => state.cart)

    const logoutHandler = () => {
        dispatch(logoutUser());
        alert.success('Logged out successfully.')
    }

    return (
        <Fragment>
            <nav className="navbar row">
                <div className="col-12 col-md-3">
                    <div className="navbar-brand">
                        <Link to="/">
                            <img src="/images/logo.png" alt='logo'/>
                        </Link>
                    </div>
                </div>

                <div className="col-12 col-md-6 mt-2 mt-md-0">
                    <Route render={({ history }) => <Search history={history} />} />
                </div>

                <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
                    <Link to="/cart" style={{ textDecoration: 'none' }} >
                        <span id="cart" className="ml-3">Cart</span>
                        <span className="ml-1" id="cart_count">{cartItems.length}</span>
                    </Link>

                    {user ? (
                        <Dropdown className="ml-4 d-inline">
                            <Dropdown.Toggle
                                as='div'
                                className="btn text-white mr-4" 
                                id="dropDownMenuButton" 
                                aria-haspopup="true" 
                                aria-expanded="false">

                                <figure className="avatar avatar-nav">
                                    <img
                                        src={user.avatar && user.avatar.url}
                                        alt={user && user.name}
                                        className="rounded-circle"
                                    />
                                </figure>
                                <span>{user && user.name}</span>
                            </Dropdown.Toggle>

                            <Dropdown.Menu className="dropdown-menu" aria-labelledby="dropDownMenuButton">

                                {user && user.role === 'admin' ? (
                                    <Dropdown.Item className="dropdown-item" href="/dashboard">Dashboard</Dropdown.Item>
                                ) : (
                                    <Dropdown.Item className="dropdown-item" href="/orders/me">Orders</Dropdown.Item>
                                )}
                                <Dropdown.Item className="dropdown-item" href="/me">Profile</Dropdown.Item>
                                <Dropdown.Item className="dropdown-item text-danger" href="/" onClick={logoutHandler}>
                                    Logout
                                </Dropdown.Item>

                            </Dropdown.Menu>
                        </Dropdown>

                    ) : !loading && <Link to="/login" className="btn ml-4" id="login_btn">Login</Link>}


                </div>
            </nav>
        </Fragment>
    )
}

export default Header