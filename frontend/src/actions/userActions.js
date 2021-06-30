import axios from 'axios';

export const login = (email,password) => (dispatch) => {

    dispatch({type:'LOGIN_REQUEST'})

    axios({
        method: "post",
        url: '/api/v1/login',
        data: {email,password},
        headers: { "Content-Type":"application/json"},
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
            type: 'LOGIN_SUCCESS',
            payload: data.user
        })
        })
        .catch(error => {
            console.log(error.response)
            dispatch({
                type: 'LOGIN_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const register = (userData) => (dispatch) => {
    dispatch({ type: 'REGISTER_USER_REQUEST' })

    axios({
        method: "post",
        url: '/api/v1/register',
        data: userData,
        headers: { "Content-Type": 'multipart/form-data' },
        })
        .then(response => {
            const {data} = response;
            
            dispatch({
            type: 'REGISTER_USER_SUCCESS',
            payload: data.user
        })
        })
        .catch(error => {
            dispatch({
                type: 'REGISTER_USER_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const loadUser = () => (dispatch) => {
    dispatch({ type: 'LOAD_USER_REQUEST' })

    axios({
        method: "get",
        url: '/api/v1/me',
    })
    .then(response => {
        const {data} = response;
        
        dispatch({
            type: 'LOAD_USER_SUCCESS',
            payload: data.user
        })
    })
    .catch(error => {
        dispatch({
            type: 'LOAD_USER_FAIL',
            payload: error.response.data.errMessage
        })
    });
}

export const logoutUser = () => (dispatch) => {

    axios({
        method: "get",
        url: '/api/v1/logout',
        })
        .then(response => {
            dispatch({
            type: 'LOGOUT_SUCCESS',
        })
        })
        .catch(error => {
            dispatch({
                type: 'LOGOUT_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const updateProfile = (userData) => (dispatch) => {

    dispatch({ type: 'UPDATE_PROFILE_REQUEST' })

    axios({
        method: "put",
        url: '/api/v1/me/update',
        data: userData,
        headers: { "Content-Type": 'multipart/form-data' },
        })
        .then(response => {
            const {data} = response;

            dispatch({
                type: 'UPDATE_PROFILE_SUCCESS',
                payload:data.success
            })
        })
        .catch(error => {
            dispatch({
                type: 'UPDATE_PROFILE_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const updatePassword = (passwords) => (dispatch) => {

    dispatch({ type: 'UPDATE_PASSWORD_REQUEST' })

    axios({
        method: "put",
        url: '/api/v1/password/update',
        data: passwords,
        headers: { "Content-Type": 'application/json' },
        })
        .then(response => {
            const {data} = response;

            dispatch({
                type: 'UPDATE_PASSWORD_SUCCESS',
                payload:data.success
            })
        })
        .catch(error => {
            dispatch({
                type: 'UPDATE_PASSWORD_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const forgotPassword = (email) => (dispatch) => {

    dispatch({ type: 'FORGOT_PASSWORD_REQUEST' })

    axios({
        method: "post",
        url: '/api/v1/password/forgot',
        data: email,
        headers: { "Content-Type": 'application/json' },
        })
        .then(response => {
            const {data} = response;

            dispatch({
                type: 'FORGOT_PASSWORD_SUCCESS',
                payload:data.message
            })
        })
        .catch(error => {
            dispatch({
                type: 'FORGOT_PASSWORD_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const resetPassword = (token,passwords) => (dispatch) => {

    dispatch({ type: 'NEW_PASSWORD_REQUEST' })

    axios({
        method: "put",
        url: `/api/v1/password/reset/${token}`,
        data: passwords,
        headers: { "Content-Type": 'application/json' },
        })
        .then(response => {
            const {data} = response;

            dispatch({
                type: 'NEW_PASSWORD_SUCCESS',
                payload:data.success
            })
        })
        .catch(error => {
            dispatch({
                type: 'NEW_PASSWORD_FAIL',
                payload: error.response.data.errMessage
            })
        });
}

export const allUsers = () => (dispatch) => {

    dispatch({ type: 'ALL_USERS_REQUEST' })

    axios({
        method:"get",
        url:"/api/v1/admin/users"
    })
    .then(response => {
        const {data} = response
        dispatch({
            type: 'ALL_USERS_SUCCESS',
            payload: data.users
        })
    })
    .catch(error => {
        dispatch({
            type: 'ALL_USERS_FAIL',
            payload: error.response.data.errMessage
        })
    })
}

// Update user - ADMIN
export const updateUser = (id, userData) => (dispatch) => {

    dispatch({ type: 'UPDATE_USER_REQUEST' })
    
    axios({
        method:"put",
        url:`/api/v1/admin/user/${id}`,
        data:userData,
        headers:{'Content-Type': 'application/json'}
    })
    .then(response => {
        const {data} = response
        dispatch({
            type: 'UPDATE_USER_SUCCESS',
            payload: data.success
        })
    })
    .catch(error => {
        dispatch({
            type: 'UPDATE_USER_FAIL',
            payload: error.response.data.errMessage
        })
    })
}

// Get user details - ADMIN
export const getUserDetails = (id) => (dispatch) => {

    dispatch({ type: 'USER_DETAILS_REQUEST' })
    
    axios({
        method:"get",
        url:`/api/v1/admin/user/${id}`
    })
    .then(response => {
        const {data} = response
        dispatch({
            type: 'USER_DETAILS_SUCCESS',
            payload: data.user
        })
    })
    .catch(error => {
        dispatch({
            type: 'USER_DETAILS_FAIL',
            payload: error.response.data.errMessage
        })
    })
}

// Delete user - ADMIN
export const deleteUser = (id) => (dispatch) => {

    dispatch({ type: 'DELETE_USER_REQUEST' })
    
    axios({
        method:"delete",
        url:`/api/v1/admin/user/${id}`
    })
    .then(response => {
        const {data} = response
        dispatch({
            type: 'DELETE_USER_SUCCESS',
            payload: data.success
        })
    })
    .catch(error => {
        dispatch({
            type: 'DELETE_USER_FAIL',
            payload: error.response.data.errMessage
        })
    })

}

export const clearErrors = () => (dispatch) => {
    dispatch({
        type:'CLEAR_ERRORS'
    })
}