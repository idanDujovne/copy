import { utilService } from './util.service.js'
import { storageService } from './async-storage.service.js'
import { userService } from './user.service.js'

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
    getImportanceStats,
    getDoneContactsPercent
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

            if (filterBy.isDone !== 'all') {
                contacts = contacts.filter((contact) => (filterBy.isDone === 'done' ? contact.isDone : !contact.isDone))
            }

            if (filterBy.sort) {
                if (filterBy.sort === 'fullName') {
                    contacts = contacts.sort((a, b) => a.fullName.localeCompare(b.fullName));
                } else {
                    contacts = contacts.sort((a, b) => a.createdAt - b.createdAt);
                }
            }

            const filteredContactsLength = contacts.length
            if (filterBy.pageIdx !== undefined) {
                const startIdx = filterBy.pageIdx * PAGE_SIZE;
                contacts = contacts.slice(startIdx, startIdx + PAGE_SIZE)
            }
            return Promise.all([getDoneContactsPercent(), getMaxPage(filteredContactsLength)])
                .then(([doneContactsPercent, maxPage]) => {
                    return { contacts, maxPage, doneContactsPercent }
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
            return Promise.all([getDoneContactsPercent(), getMaxPage()])
                .then(([doneContactsPercent, maxPage]) => {
                    return { maxPage, doneContactsPercent }
                })
        })
        .catch(err => {
            console.error('Cannot remove contact:', err)
            throw err
        })
}

function save(contact) {
    if (!userService.getLoggedinUser()) return Promise.reject('User is not logged in')
    return ((contact._id) ? _edit(contact) : _add(contact))
        .then((savedContact) => {
            return Promise.all([getDoneContactsPercent(), getMaxPage()])
                .then(([doneContactsPercent, maxPage]) =>
                    ({ maxPage, doneContactsPercent, savedContact })
                )
        })
}

function _add(contact) {
    contact = { ...contact }
    contact.createdAt = contact.updatedAt = Date.now()
    contact.color = utilService.getRandomColor()
    return storageService.post(CONTACT_KEY, contact)
        .catch(err => {
            console.error('Cannot add contact:', err)
            throw err
        })


}

function _edit(contact) {
    contact = { ...contact }
    contact.updatedAt = Date.now()
    return storageService.put(CONTACT_KEY, contact)
        .catch(err => {
            console.error('Cannot update contact:', err)
            throw err
        })
}

function getEmptyContact(fullName = '', phone = 5) {
    return { fullName, phone, isDone: false }
}

function getDefaultFilter() {
    return { fullName: '', isDone: 'all', phone: 0, pageIdx: 0, sort: '' }
}

function getFilterFromSearchParams(searchParams) {
    const filterBy = {
        fullName: searchParams.get('fullName') || '',
        isDone: searchParams.get('isDone') || 'all',
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
        const fullNames = ['Learn React', 'Master CSS', 'Practice Redux']
        for (let i = 0; i < 8; i++) {
            const fullName = fullNames[utilService.getRandomIntInclusive(0, fullNames.length - 1)]
            contacts.push(_createContact(fullName + (i + 1), utilService.getRandomIntInclusive(1, 10)))
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

// {
//     _id:,
//     fullName:,
//     phone:,
// }

