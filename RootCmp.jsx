import { ContactIndex } from "./pages/ContactIndex.jsx"
import { ContactDetails } from "./pages/ContactDetails.jsx"
import { Home } from "./pages/Home.jsx"
import { AppFooter } from "./cmps/AppFooter.jsx"
import { ContactEdit } from "./pages/ContactEdit.jsx"
import { AppHeader } from "./cmps/AppHeader.jsx"

const { Routes, Route } = ReactRouterDOM

export function RootCmp() {

    return (
        <section className="app">
            <AppHeader />
            <main>
                <Routes>
                    <Route path="/" element={<Home  />} />
                    <Route path="/contact" element={<ContactIndex />} />
                    <Route path="/contact/:contactId" element={<ContactDetails />} />
                    <Route path="/contact/edit/:contactId" element={<ContactEdit />} />
                    <Route path="/contact/edit" element={<ContactEdit  />} />
                </Routes>
            </main>
            <AppFooter />
        </section>
    )
}