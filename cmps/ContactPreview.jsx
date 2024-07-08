export function ContactPreview({ contact }) {
    return (
        <article className="contact-preview" >
            <h2>
                Contact: {contact.fullName}
            </h2>
            <h4>Phone: {contact.phone}</h4>
        </article>
    )
}
