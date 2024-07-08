import { utilService } from "../services/util.service.js"

const { useState, useEffect, useRef } = React

export function ContactFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })
    const debouncedSetFilterRef = useRef(utilService.debounce(onSetFilterBy, 500))


    useEffect(() => {
        // Notify parent
        debouncedSetFilterRef.current(filterByToEdit)
    }, [filterByToEdit])

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

            default: break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    // Optional support for LAZY Filtering with a button
    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    const { fullName, phone, isDone } = filterByToEdit

    return (
        <section className="contact-filter">
            <h2>Filter Contacts</h2>
            <form onSubmit={onSubmitFilter}>
                <select value={isDone} className="flex justify-center align-center" name="isDone" onChange={(ev) => handleChange(ev)}>
                    <option value="all" >All</option>
                    <option value="done" >Done</option>
                    <option value="undone" >Active</option>

                </select>

                <input value={fullName} onChange={handleChange}
                    type="search" placeholder="By Name" id="fullName" name="fullName"
                />
                <label htmlFor="phone">Phone: </label>
                <input value={phone} onChange={handleChange}
                    type="number" placeholder="By Phone" id="phone" name="phone"
                />

                <button hidden>Set Filter</button>
            </form>
        </section>
    )
}