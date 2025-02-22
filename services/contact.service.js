import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"


const CONTACT_KEY = 'contactDB'
const PAGE_SIZE = 3
_createContacts()

export const contactService = {
    query,
    get,
    remove,
    save,
    getEmptyContact,
    getDefaultFilter,
    getFilterFromSearchParams,

}
// For Debug (easy access from console):
window.cs = contactService

function query(filterBy = {}) {
    return storageService.query(CONTACT_KEY)
    .then(contacts => {
        

            if (filterBy.fullName) {
                const regExp = new RegExp(filterBy.fullName, 'i')
                contacts = contacts.filter(contact => regExp.test(contact.fullName))
            }

            if (filterBy.phone) {
                contacts = contacts.filter(contact => contact.phone >= filterBy.phone)
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'fullName') {
                    contacts = contacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
                }
            }

            const filteredContactsLength = contacts.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE;
                contacts = contacts.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return (getMaxPage(filteredContactsLength))
                .then(maxPage => {
                    return { contacts, maxPage }
                })
        })
}

function get(contactId) {
    return storageService.get(CONTACT_KEY, contactId)
        .then(contact => {
            contact = _setNextPrevContactId(contact)
            return contact
        })
        .catch(err => {
            console.error('Cannot get contact:', err)
            throw err
        })
}

function remove(contactId) {
    return storageService.remove(CONTACT_KEY, contactId)
        .then(() => {
            return (getMaxPage())
                .then((maxPage) => {
                    return { maxPage }
                })
        })
        .catch(err => {
            console.error('Cannot remove contact:', err)
            throw err
        })
}

function save(contact) {
    return ((contact._id) ? _edit(contact) : _add(contact))
        .then((savedContact) => {
            return (getMaxPage())
                .then((maxPage) =>
                    ({ maxPage, savedContact })
                )
        })
}

function _add(contact) {
    contact = { ...contact }
    return storageService.post(CONTACT_KEY, contact)
        .catch(err => {
            console.error('Cannot add contact:', err)
            throw err
        })
}

function _edit(contact) {
    contact = { ...contact }
    return storageService.put(CONTACT_KEY, contact)
        .catch(err => {
            console.error('Cannot update contact:', err)
            throw err
        })
}

function getEmptyContact(fullName = '', phone = '050-44879546') {
    return { fullName, phone }
}

function getDefaultFilter() {
    return { fullName: '', phone: 0, pageIdx: 0, sort: '' }
}

function getFilterFromSearchParams(searchParams) {
    const filterBy = {
        fullName: searchParams.get('fullName') || '',
        phone: +searchParams.get('phone') || 0,
        pageIdx: +searchParams.get('pageIdx') || 0,
        sort: searchParams.get('sort') || ''
    }

    return filterBy
}

function getMaxPage(filteredContactsLength) {
    if (filteredContactsLength) return Promise.resolve(Math.ceil(filteredContactsLength / PAGE_SIZE))
    return storageService.query(CONTACT_KEY)
        .then(contacts => Math.ceil(contacts.length / PAGE_SIZE))
        .catch(err => {
            console.error('Cannot get max page:', err)
            throw err
        })
}

function _createContacts() {
    let contacts = utilService.loadFromStorage(CONTACT_KEY)
    if (!contacts || !contacts.length) {
        contacts = []
        const fullNames = ['Omri', 'Idan', 'Yosi','Puki','Muki','Shuki']
        for (let i = 0; i < 8; i++) {
            const fullName = fullNames[utilService.getRandomIntInclusive(0, fullNames.length - 1)]
            contacts.push(_createContact(fullName))
        }
        utilService.saveToStorage(CONTACT_KEY, contacts)
    }
}

function _createContact(fullName, phone) {
    const contact = getEmptyContact(fullName, phone)
    contact._id = utilService.makeId()
    return contact
}

function _setNextPrevContactId(contact) {
    return storageService.query(CONTACT_KEY).then((contacts) => {
        const contactIdx = contacts.findIndex((currContact) => currContact._id === contact._id)
        const nextContact = contacts[contactIdx + 1] ? contacts[contactIdx + 1] : contacts[0]
        const prevContact = contacts[contactIdx - 1] ? contacts[contactIdx - 1] : contacts[contacts.length - 1]
        contact.nextContactId = nextContact._id
        contact.prevContactId = prevContact._id
        return contact
    })
}

