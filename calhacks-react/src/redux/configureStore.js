import { createForms } from 'react-redux-form';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { registration, accomodation, login } from './forms';

export const ConfigureStore = () => {
	const store = createStore(
		combineReducers({
			...createForms({
                Register: registration,
                Accomodate: accomodation,
                Login: login
            })
		}),
		applyMiddleware(thunk, logger)
	);

	return store;
}