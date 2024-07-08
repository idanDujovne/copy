const { useEffect, useState } = React
const { useSelector, useDispatch } = ReactRedux
const { Link, useSearchParams } = ReactRouterDOM

import { ContactFilter } from "../cmps/ContactFilter.jsx"
import { ContactList } from "../cmps/ContactList.jsx"
import { loadContacts, removeContact, saveContact } from '../store/actions/contact.actions.js'
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"
import { ContactSort } from '../cmps/ContactSort.jsx'
import { contactService } from '../services/contact.service.js'
import { PaginationBtns } from "../cmps/PaginationBtns.jsx"
import { SET_FILTER_BY } from "../store/reducers/contact.reducer.js"

export function ContactIndex() {
        const contacts = useSelector((storeState) => storeState.contactModule.contacts)
        const isLoading = useSelector(storeState => storeState.contactModule.isLoading)


    //     // Special hook for accessing search-params:
        const [searchParams, setSearchParams] = useSearchParams()
        const defaultFilter = contactService.getFilterFromSearchParams(searchParams)
        const filterBy = useSelector((storeState) => storeState.contactModule.filterBy)
        const maxPage = useSelector((storeState) => storeState.contactModule.maxPage)
        const dispatch = useDispatch()

        useEffect(() => {
            setFilterSort({ ...defaultFilter })
        }, [])

        useEffect(() => {
            setSearchParams(filterBy)
            loadContacts(filterBy)
                .catch(() => {
                    showErrorMsg('Could not load contacts')
                })

        }, [filterBy])

        function onRemoveContact(contactId) {
            const ans = confirm('Do you want to delete this contact?')
            if (!ans) return
            removeContact(contactId)
                .then(() => {
                    console.log('removed contact ' + contactId);
                    showSuccessMsg(`Removed contact with ${contactId} id successfully`)
                })
                .catch(() => showErrorMsg('Had trouble removing the contact'))
        }

        function setFilterSort(filterBy) {
            const action = {
                type: SET_FILTER_BY,
                filterBy,
            }
            dispatch(action)
        }

        function onChangePageIdx(diff) {
            let newPageIdx = +filterBy.pageIdx + diff
            if (newPageIdx < 0) newPageIdx = maxPage - 1
            if (newPageIdx >= maxPage) newPageIdx = 0
            setFilterSort({ ...filterBy, pageIdx: newPageIdx, })
        }

    return (
            <section className="contact-index">
                <ContactFilter filterBy={defaultFilter} onSetFilterBy={setFilterSort} />
                <ContactSort filterBy={defaultFilter} onSetFilterBy={setFilterSort} />

                <Link to="/contact/edit" className="add-contact-btn btn" >Add Contact</Link>
                <h2>Contacts List</h2>
                <PaginationBtns filterSortBy={filterBy} onChangePageIdx={onChangePageIdx} />
                {!isLoading ?
                    <ContactList contacts={contacts} onRemoveContact={onRemoveContact} onToggleContact={onToggleContact} />
                    : <div>Loading...</div>
                }
            </section>
    )
}