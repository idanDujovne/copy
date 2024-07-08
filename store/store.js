import { contactService } from "../services/contact.service.js"

contactService

const { createStore, compose } = Redux


export const SET_IS_LOADING = 'SET_IS_LOADING'

export const SET_CONTACTS = 'SET_CONTACTS'
export const SET_MAX_PAGE = 'SET_MAX_PAGE'
export const ADD_CONTACT = 'ADD_CONTACT'
export const REMOVE_CONTACT = 'REMOVE_CONTACT'
export const UPDATE_CONTACT = 'UPDATE_CONTACT'
export const SET_FILTER_BY = 'SET_FILTER_BY'


const initialState = {
    contacts: [],
    filterBy: contactService.getDefaultFilter(),
    sortBy: 'fullName',
    isLoading: false,
}

export function appReducer(state = initialState, action) {

    switch (action.type) {

        case SET_CONTACTS:
            return { ...state, contacts: action.contacts }
        case ADD_CONTACT:
            return { ...state, contacts: [action.contact, ...state.contacts] }
        case REMOVE_CONTACT:
            return { ...state, contacts: state.contacts.filter(contact => contact._id !== action.contactId) }
        case UPDATE_CONTACT:
            return { ...state, contacts: state.contacts.map(contact => contact._id === action.contact._id ? action.contact : contact) }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy }
            }
        case SET_MAX_PAGE:
            return { ...state, maxPage: action.maxPage }

        default:
            return state
    }

}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(appReducer, composeEnhancers())
