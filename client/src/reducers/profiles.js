import { 
    Clear_PROFILE,
    GET_PROFILE,
    GET_PROFILES,
    PROFILE_ERROR,
    UPDATE_PROFILE
 } from "../actions/Types";

const initialState = {
profile: null,
profiles: [],
repos: [],
loading: true,
error: {}
}
export default function(state = initialState, {type, payload}) {
switch (type) {
    case GET_PROFILE:
    case UPDATE_PROFILE:
        return {
         ...state,
         profile: payload,
         loading: false
        };
        case GET_PROFILES:
            return {
                ...state,
                profiles: payload,
                loading: false
            }
        case PROFILE_ERROR:
            return {
                ...state,
                error: payload,
                loading: false
            }
            case Clear_PROFILE: 
            return {
                ...state,
                profile: null,
                repos: [],
                loading: false
            }
    default:
        return state;
}
}