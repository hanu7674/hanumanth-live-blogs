import { applyMiddleware,legacy_createStore as createStore } from 'redux';
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import monitorReducersEnhancer from '../enhancers/monitorReducer'
import loggerMiddleware from '../middleware/logger'
import rootReducer from '../reducers';
import { env } from '../assets/constants';
export default function configureStore(preloadedState) {
  const middlewares = [thunkMiddleware]
  if (env !== 'production') {
    middlewares.push(loggerMiddleware);
  }

  const middlewareEnhancer = applyMiddleware(...middlewares);

  const enhancers = [middlewareEnhancer];
  if (env !== 'production') {
    enhancers.push(monitorReducersEnhancer);
  }
  const composedEnhancers = composeWithDevTools({ trace: true })(...enhancers);  
  const store = createStore(rootReducer, preloadedState, composedEnhancers)
    if (env !== 'production' && module.hot) {
        module.hot.accept('../reducers', () => store.replaceReducer(rootReducer))
      }
  return store
}
