const { useSelector } = ReactRedux
const { useEffect, useState } = React


export function AppFooter() {
    const contacts = useSelector((storeState) => storeState.contacts)

    // function getStyleByUser() {
    //     const prefs = {
    //         color: '',
    //         backgroundColor: ''
    //     }

    //     if (user && user.pref) {
    //         prefs.color = user.pref.color
    //         prefs.backgroundColor = user.pref.bgColor
    //     }

    //     return prefs
    // }



   
    return (
        <footer  className='full'>
        {/* <footer style={getStyleByUser()} className='full'>
            {user && contacts &&
                <section className="contacts-progress">
                    <h3>you have finished {formattedPercent}</h3>
                    <div className="progress-bar-container" >
                        <span>{formattedPercent}</span>
                        <div style={{ width: formattedPercent }}>

                        </div>
                    </div>
                </section>} */}
                <div>
                    Made by Omri & Idan
                </div>
        </footer>
    )
}
