
import { contactService } from "../services/contact.service.js"
import {showErrorMsg, showSuccessMsg  } from "../services/event-bus.service.js"
// import { saveTodo } from '../store/actions/todo.actions.js'

const { useState, useEffect } = React
const { useNavigate, useParams } = ReactRouterDOM

export function ContactEdit() {

    const [contactToEdit, setContactToEdit] = useState(contactService.getEmptyContact())
    const navigate = useNavigate()
    const params = useParams()

    useEffect(() => {
        if (params.contactId) loadContact()
    }, [])

    function loadContact() {
        contactService.get(params.contactId)
            .then(setContactToEdit)
            .catch(err => console.log('err:', err))
    }

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setContactToEdit(prevContactToEdit => ({ ...prevContactToEdit, [field]: value }))
    }

    function onSaveContact(ev) {
        ev.preventDefault()
        saveContact(contactToEdit)
            .then((savedContact) => {
                navigate('/contact')
                showSuccessMsg(`Contact Saved (id: ${savedContact._id})`)
            })
            .catch(err => {
                showErrorMsg('Cannot save contact')
                console.log('err:', err)
            })
    }

    const { fullName, phone } = contactToEdit
    return (
        <section className="contact-edit">
            <form onSubmit={onSaveContact} >
                <label htmlFor="fullName">Full Name:</label>
                <input onChange={handleChange} value={fullName} type="text" name="fullName" id="fullName" />

                <label htmlFor="phone">phone:</label>
                <input onChange={handleChange} value={phone} type="number" name="phone" id="phone" />
                <button>Save</button>
            </form>
        </section>
    )
}