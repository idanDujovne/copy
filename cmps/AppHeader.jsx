const { Link, NavLink } = ReactRouterDOM
const { useSelector } = ReactRedux

export function AppHeader() {

    const contacts = useSelector((storeState) => storeState.contacts)

    // function getStyleByUser() {
    //     const prefs = {}
    //     if (user && user.pref) {
    //         prefs.color = user.pref.color
    //         prefs.backgroundColor = user.pref.bgColor
    //     }
    //     return prefs
    // }

    return (
        <header className="app-header full main-layout">
            <section className="header-container">
                <h1>React Contact App</h1>

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/contact" >Contacts</NavLink>
                </nav>
            </section>
        </header>
    )
}
