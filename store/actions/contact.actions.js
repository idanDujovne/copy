

import { contactService } from '../../services/contact.service.js'
import { SET_IS_LOADING, ADD_CONTACT, REMOVE_CONTACT, SET_CONTACTS, UPDATE_CONTACT, store, SET_MAX_PAGE } from '../store.js'



export function loadContacts(filterSort) {
    store.dispatch({ type: SET_IS_LOADING, isLoading: true })
    return contactService.query(filterSort)
        .then(({ contacts, maxPage }) => {
            store.dispatch({
                type: SET_CONTACTS,
                contacts
            })
            _setContactsData(maxPage)
            return contacts
        })
        .catch(err => {
            console.error('Cannot load contacts:', err)
            throw err
        })
        .finally(() => {
            store.dispatch({ type: SET_IS_LOADING, isLoading: false })
        })
}

export function saveContact(contact) {
    const type = (contact._id) ? UPDATE_CONTACT : ADD_CONTACT
    return contactService.save(contact)
        .then(({ maxPage, savedContact }) => {
            store.dispatch({
                type,
                contact: savedContact
            })
            _setContactsData(maxPage)
            return savedContact
        })
        .catch(err => {
            console.error('Cannot save contact:', err)
            throw err
        })
}

export function removeContact(contactId) {
    return contactService.remove(contactId)
        .then(({ maxPage }) => {
            store.dispatch({
                type: REMOVE_CONTACT,
                contactId
            })
            _setContactsData(maxPage)
        })
        .catch(err => {
            console.error('Cannot remove contact:', err)
            throw err
        })
}


export function updateContact(contact) {
    return contactService.save(contact)
        .then((savedContact) => {
            store.dispatch({
                type: UPDATE_CONTACT,
                contact: savedContact
            })
        })


}

function _setContactsData(maxPage) {
    store.dispatch({
        type: SET_MAX_PAGE,
        maxPage
    })
}
