import { ContactIndex } from "./pages/ContactIndex.jsx"

const { Routes, Route } = ReactRouterDOM

export function RootCmp() {

    return (
        <section className="app">
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/contact" element={<ContactIndex />} />
                </Routes>
            </main>
        </section>
    )
}