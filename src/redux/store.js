import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { totalReducers } from "./reducers/combiners";

export const store = createStore(
    totalReducers,
    compose(  
        applyMiddleware(thunk),
         window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
 
    )  
)
