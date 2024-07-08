const { Link, NavLink } = ReactRouterDOM
const { useSelector } = ReactRedux

export function AppHeader() {

    const contacts = useSelector((storeState) => storeState.contactModule.contacts)

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
                <h1>React Todo App</h1>

                <nav className="app-nav">
                    <NavLink to="/" >Home</NavLink>
                    <NavLink to="/contact" >Todos</NavLink>
                </nav>
            </section>
            <UserMsg />
        </header>
    )
}
