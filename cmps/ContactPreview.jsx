export function ContactPreview({ contact }) {
    return (
        <article className="contact-preview" >
            <h2>
                Contact: {contact.fullName}
            </h2>
            <img src={`https://robohash.org/${contact._id}?set=set1`} alt="robot pic.."></img>
            <h4>Phone: {contact.phone}</h4>
        </article>
    )
}
