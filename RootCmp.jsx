import { ContactDetails } from "./pages/ContactDetails.jsx"

const { Routes, Route } = ReactRouterDOM

export function RootCmp() {

    return (
        <section className="app">
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact/:contactId" element={<ContactDetails/>} />
                </Routes>
            </main>
        </section>
    )
}