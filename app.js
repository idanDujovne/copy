const Router = ReactRouterDOM.HashRouter
// const Router = ReactRouterDOM.BrowserRouter
const { Provider } = ReactRedux;



import { RootCmp } from './RootCmp.jsx';
import { store } from './store/store.js';

const elContainer = document.getElementById('root')
const root = ReactDOM.createRoot(elContainer)
root.render(

    <Provider store={store}>
        <Router>
            <RootCmp />
        </Router>
    </Provider>
)
