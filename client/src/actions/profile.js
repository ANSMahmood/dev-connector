import axios from "axios";
import { setAlert } from "./alert";
import {
    ACCOUNT_DELETED,
    Clear_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE
} from './Types';
// Get current user profile

export const getCurrentProfile = () => async dispatch => {
    try {
        const res = await axios.get('/api/profiles/me');
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Get all profiles hit /profiles

export const getAllProfiles = () => async dispatch => {
    dispatch({type: Clear_PROFILE});
    try {
        const res = await axios.get('/api/profiles');
        console.log(res.data);
        dispatch({
            type: GET_PROFILES,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Get Profile by User ID hit /profiles/user/:userId

export const getProfileById = userId => async dispatch => {
    try {
        const res = await axios.get(`/api/profiles/user/${userId}`);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        })
    } catch (err) {
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
}

// Create or Update profile 
export const createProfile = ( formData, history, edit=false) => async dispatch => {
try {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    }
    const res = await axios.post('/api/profiles', formData, config);
    dispatch({
        type: GET_PROFILE,
        payload: res.data
    });
    dispatch(setAlert(edit ? 'Profile Updated': 'Profile Created', 'success'));
    if(!edit) {
        history.push('/dashboard');
    }
} catch (err) {
    const errors = err.response.data.error;
    if(errors) {
        // then just loop through the errors 
        errors.forEach(error => {
            dispatch(setAlert(error.msg, 'danger'))
        });
    }
    dispatch({
        type: PROFILE_ERROR,
        payload: { msg: err.response.statusText, status: err.response.status}
    })
}
}

// Add experience

export const addExperience = ( formData, history) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.put('/api/profiles/experience', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added', 'success'));
            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.error;
        if(errors) {
            // then just loop through the errors 
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
    }
    
// Add Education
export const addEducation = ( formData, history, edit=false) => async dispatch => {
    try {
        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }
        const res = await axios.put('/api/profiles/education', formData, config);
        dispatch({
            type: GET_PROFILE,
            payload: res.data
        });
        dispatch(setAlert('Experience Added', 'success'));
            history.push('/dashboard');
    } catch (err) {
        const errors = err.response.data.error;
        if(errors) {
            // then just loop through the errors 
            errors.forEach(error => {
                dispatch(setAlert(error.msg, 'danger'))
            });
        }
        dispatch({
            type: PROFILE_ERROR,
            payload: { msg: err.response.statusText, status: err.response.status}
        })
    }
    }
    
    // Delete experience
    export const deleteExperience = id => async dispatch => {
        try {
            const res = await axios.delete(`/api/profiles/experience/${id}`);
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert('Experience Removed', 'success'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status}
            })
        }
    }
    // Delete education
    export const deleteEducation = id => async dispatch => {
        try {
            const res = await axios.delete(`/api/profiles/education/${id}`);
            dispatch({
                type: UPDATE_PROFILE,
                payload: res.data
            });
            dispatch(setAlert('Education Removed', 'success'));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status}
            })
        }
    }
    // Delete Acount & profile
    export const deleteAccount = id => async dispatch => {
        if(window.confirm('Are you sure ? This can NOT be undone!'));
        try {
            const res = await axios.delete(`/api/profiles`);
            dispatch({type: Clear_PROFILE});
            dispatch({type: ACCOUNT_DELETED});

            dispatch(setAlert("Your Account has been permanantly deleted"));
        } catch (err) {
            dispatch({
                type: PROFILE_ERROR,
                payload: { msg: err.response.statusText, status: err.response.status}
            })
        }
    }