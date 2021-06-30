import axios from 'axios'

export const createOrder = (order) => (dispatch) => {

    dispatch({ type: 'CREATE_ORDER_REQUEST' })


    axios({
        method: "post",
        url: '/api/v1/orders/new',
        data: order,
        headers: { "Content-Type":"application/json"},
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'CREATE_ORDER_SUCCESS',
                payload: data
            })
        })
        .catch(error => {
            dispatch({
                type: 'CREATE_ORDER_FAIL',
                payload: error.response.data.errMessage
            })
        });

}

// Get curretly logged in user orders
export const myOrders = () => async (dispatch) => {

    dispatch({ type: 'MY_ORDERS_REQUEST' });

    axios({
        method: "get",
        url: '/api/v1/orders/me'
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'MY_ORDERS_SUCCESS',
                payload: data.orders
            })
        })
        .catch(error => {
            dispatch({
                type: 'MY_ORDERS_FAIL',
                payload: error.response.data.message
            })
        });
}

// Get order details
export const getOrderDetails = (id) => (dispatch) => {

    dispatch({ type: 'ORDER_DETAILS_REQUEST' });

    axios({
        method: "get",
        url: `/api/v1/order/${id}`
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'ORDER_DETAILS_SUCCESS',
                payload: data.order
            })
        })
        .catch(error => {
            dispatch({
                type: 'ORDER_DETAILS_FAIL',
                payload: error.response.data.message
            })
        });
}

// Get all orders - ADMIN
export const allOrders = () => (dispatch) => {

    dispatch({ type: 'ALL_ORDERS_REQUEST'});

    axios({
        method: "get",
        url: `/api/v1/admin/orders`
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'ALL_ORDERS_SUCCESS',
                payload: data
            })
        })
        .catch(error => {
            dispatch({
                type: 'ALL_ORDERS_FAIL',
                payload: error.response.data.message
            })
        });
}

// update order
export const updateOrder = (id, orderData) => (dispatch) => {

    dispatch({ type: 'UPDATE_ORDER_REQUEST' });

    axios({
        method: "put",
        url: `/api/v1/admin/order/${id}`,
        data: orderData,
        headers: { "Content-Type":"application/json"},
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'UPDATE_ORDER_SUCCESS',
                payload: data.success
            })
        })
        .catch(error => {
            dispatch({
                type: 'UPDATE_ORDER_FAIL',
                payload: error.response.data.message
            })
        });
}

// Delete order
export const deleteOrder = (id) => (dispatch) => {

    dispatch({ type: 'DELETE_ORDER_REQUEST' });

    axios({
        method: "delete",
        url: `/api/v1/admin/order/${id}`,
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
                type: 'DELETE_ORDER_SUCCESS',
                payload: data.success
            })
        })
        .catch(error => {
            dispatch({
                type: 'DELETE_ORDER_FAIL',
                payload: error.response.data.message
            })
        });
}


// Clear Errors
export const clearErrors = () => async (dispatch) => {
    dispatch({
        type: 'CLEAR_ERRORS'
    })
}