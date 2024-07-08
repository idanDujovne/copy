import { ContactIndex } from "./pages/ContactIndex.jsx"
import { ContactDetails } from "./pages/ContactDetails.jsx"
import { Home } from "./pages/Home.jsx"

const { Routes, Route } = ReactRouterDOM

export function RootCmp() {

    return (
        <section className="app">
            <main>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="/contact" element={<ContactIndex />} />
                    <Route path="/contact/:contactId" element={<ContactDetails/>} />
                </Routes>
            </main>
        </section>
    )
}