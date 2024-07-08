const { Routes, Route } = ReactRouterDOM

export function RootCmp() {

    return (
        <section className="app">
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </main>
        </section>
    )
}