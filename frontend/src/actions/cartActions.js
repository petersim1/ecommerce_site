import axios from 'axios'


export const addItemToCart = (id, quantity) => async (dispatch, getState) => {

    axios({
        method: "get",
        url: `/api/v1/product/${id}`,
        })
        .then(response => {
            const {data} = response;

            dispatch({
                type: 'ADD_TO_CART',
                payload: {
                    product: data.product._id,
                    name: data.product.name,
                    price: data.product.price,
                    image: data.product.images[0].url,
                    stock: data.product.stock,
                    quantity
                }
            })
        })
        .then(() => {
            localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
        })
        .catch(error => {
            return console.log(error.response.data.errMessage)
        });

}

export const removeItemFromCart = (id) => async (dispatch, getState) => {

    dispatch({
        type: 'REMOVE_ITEM_CART',
        payload: id
    })

    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))

}

export const saveShippingInfo = (data) => async (dispatch) => {

    dispatch({
        type: 'SAVE_SHIPPING_INFO',
        payload: data
    })

    localStorage.setItem('shippingInfo', JSON.stringify(data))

}