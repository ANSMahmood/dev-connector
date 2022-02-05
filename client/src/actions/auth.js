import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    USER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    Clear_PROFILE
     } from './Types';
     //Load User basically from the auth route it will return user and also isAuthenticated to true by token
     export const loadUser = () => async dispatch => {
         if(localStorage.token) {
             setAuthToken(localStorage.token);
         }
         try {
             const res = await axios.get('/api/auth');
             dispatch({
                 type: USER_LOADED,
                 payload: res.data
             })
         } catch (err) {
             dispatch({
                 type: AUTH_ERROR
             })
         }
     }
     // user Registration
     export const register = ( { name, email, password }) => async (dispatch) => {
      const config = {
          headers: {
              "Content-Type": "application/json"
          } 
      };
      const body = JSON.stringify( {name, email, password});
      try {
          const res = await axios.post('/api/users', body, config);
          // if response comes from request then type will be success
          dispatch({
              type: REGISTER_SUCCESS,
              payload: res.data
          })
          // ???????? why loadUser here
          dispatch(loadUser());
      } catch (err) {
          // if errors comes in response then 
          const errors = err.response.data.error;
          if(errors) {
              // then just loop through the errors 
              errors.forEach(error => {
                  dispatch(setAlert(error.msg, 'danger'))
              });
          }
          // if response not comes then 
          dispatch({
              type: REGISTER_FAIL
          })
      }
     }

     // Login User
     export const login = ( email, password ) => async (dispatch) => {
      const config = {
          headers: {
              "Content-Type": "application/json"
          } 
      };
      const body = JSON.stringify( { email, password});
      try {
          const res = await axios.post('/api/auth', body, config);
          // if response comes from request then type will be success
          dispatch({
              type: LOGIN_SUCCESS,
              payload: res.data
          })
          // this logic is for immediate user data load
          dispatch(loadUser())
      } catch (err) {
          // if errors comes in response then 
          const errors = err.response.data.error;
          if(errors) {
              // then just loop through the errors 
              errors.forEach(error => {
                  dispatch(setAlert(error.msg, 'danger'))
              });
          }
          // if response not comes then 
          dispatch({
              type: LOGIN_FAIL
          })
      }
     }

     // Logout / clear profile
    export const logout = () => dispatch => {
        dispatch({
            type: Clear_PROFILE
        }) 
        dispatch({
             type: LOGOUT
         })
     } 