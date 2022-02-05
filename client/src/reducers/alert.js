// this data will be in state
// const initialState = [
//     {
//         id: 1,
//         msg: "please log in",
//         alertType: 'Success'
//     },
// {},
//{}
// ]
import { SET_ALERT, REMOVE_ALERT } from "../actions/Types";
const initialState = [];
export default function(state = initialState, action) {
    // pull out type and payload from action object through destructuring
    const {type, payload} = action;
    switch (type) {
        case SET_ALERT:
            // as we know state is immutable so we have to copy the previous state first 
            return [...state, payload]; // payload will have payload.msg etc
            case REMOVE_ALERT:
                return state.filter(alert => alert.id !== payload) // now payload will be the id 
                default:
                return state;
    }
}