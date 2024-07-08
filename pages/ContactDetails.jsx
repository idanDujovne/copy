
import { contactService } from "../services/contact.service.js"
import { showErrorMsg } from "../services/event-bus.service.js"


const { useState, useEffect } = React
const { useParams, useNavigate, Link } = ReactRouterDOM

export function ContactDetails() {

    const [contact, setContact] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadContact()
    }, [params.contactId])


    function loadContact() {
        contactService.get(params.contactId)
            .then(setContact)
            .catch(err => {
                console.error('err:', err)
                showErrorMsg('Cannot load contact')
                navigate('/contact')
            })
    }

    function onBack() {
        // If nothing to do here, better use a Link
        navigate('/')
        // navigate(-1)
    }

    if (!contact) return <div>Loading...</div>
    return (
        <section className="contact-details">


            <h1>Contact Name: {contact.fullName}</h1>
            <h2>Contact Phone: {contact.phone}</h2>
            <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Enim rem accusantium, itaque ut voluptates quo? Vitae animi maiores nisi, assumenda molestias odit provident quaerat accusamus, reprehenderit impedit, possimus est ad?</p>
            <button onClick={onBack}>Back to home</button>
            <div>
                {/* <Link to={`//${contact.nextContactId}`}>Next Contact</Link> |
                <Link to={`//${contact.prevContactId}`}>Previous Contact</Link> */}
            </div>
        </section>
    )
}