## createStore

```js
function createStore(reducer, preloadState, enhance) {
  if (
    (typeof preloadState === 'function' && typeof enhance === 'function') ||
    (typeof enhance === 'function' && arguments[3] === 'function')
  ) {
    throw new Error('paramas error');
  }

  if (typeof preloadState === 'function' && typeof enhance === 'undefined') {
    enhance = preloadState;
    preloadState = undefined;
  }

  if (typeof enhance !== 'undefined') {
    if (typeof enhance !== 'function') {
      throw new Error('enhance is not a function');
    }
    return enhance(createStore)(reducer, preloadState);
  }

  if (typeof reducer !== 'function') {
    throw new Error('reducer is not a function');
  }

  let currentReducer = reducer;
  let currentState = preloadState;
  let currentListeners = [];
  let nextListeners = currentListeners;
  let isDispatching = false;

  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice();
    }
  }

  function getState() {
    if (isDispatching) {
      throw new Error('reducer is excuting');
    }

    return currentState;
  }

  function subscribe(listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener expect a function');
    }

    if (isDispatching) {
      throw new Error('reducer is excuting');
    }

    let isSubscribed = true;

    ensureCanMutateNextListeners();
    nextListeners.push(listener);

    return function unsubscribe() {
      if (!isSubscribed) return;

      if (isDispatching) {
        throw new Error('reducer is excuting')
      }

      isSubscribed = false;

      ensureCanMutateNextListeners();
      const index = nextListeners.indexOf(listener);
      nextListeners.splice(index, 1);
      currentListeners = null;
    }
  }

  function dispatch(action) {
    // 简化
    if (typeof action !== 'object') {
      throw new Error('action expect a plain object');
    }

    if (typeof action.type === 'undefined') {
      throw new Error('action type must be a string');
    }

    if (isDispatching) {
      throw new Error('reducer is excuting');
    }

    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }

    const listeners = (currentListeners = nextListeners);
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i];
      listener();
    }

    return action;
  }

  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('nextReducer expect a function');
    }

    currentReducer = nextReducer;
    dispatch({ type: 'build-in action' });

    return store;
  }

  function observable() {
    const outerSubscribe = subscribe;
    return {
      subscribe(observer) {
        if (typeof observer !== 'object' || observer == null) {
          throw new Error('expect observer to be a object');
        }

        function observeState() {
          const observerAsObserver = observer;
          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }

        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return { unsubscribe };
      },
      ['@@observable']() {
        return this;
      }
    }
  }

  dispatch({ type: 'built-in init' });

  const store = {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    ['$$observabel']: observable
  };
  return store;
}
```

## combineReducers

```js
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];

    if (typeof reducers[key] === 'undefined') {
      throw new Error('key is not undefined');
    }

    if (typeof reducers[key] === 'function') {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);

  return function combination(state, action) {
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === 'undefined') {
        throw new Error('do not return undefined instead of null');
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || previousStateForKey !== nextStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  }
}
```

## bindActionCreators

```js
function bindActionCreator (actionCreator, dispatch) {
  return function(this, ...args) {
    dispatch(actionCreator.apply(this, args));
  }
}

function bindActionCreators (actionCreators, dispatch) {
  if (typeof actionCreators === 'function') {
    return bindActionCreator(actionCreators, dispatch);
  }

  if (typeof actionCreators !== 'object' || actionCreators === null) {
    throw new Error('expect actionCreators to be a object or function');
  }

  const boundActionCreators = {};
  for (const key in actionCreators) {
    const actionCreator = actionCreators[key];
    if (typeof actionCreator === 'function') {
      boundActionCreators[key] = bindActionCreator(actionCreator, dispatch);
    }
  }
  return boundActionCreators;
}

```

## applyMiddleware

```js
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, preloadState) => {
    const store = createStore(reducer, preloadState);
    let dispatch = () => {
      throw new Error('dispatching while construct your middleware is not allowed');
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  }
}
```

## compose

```js
function compose(...fn) {
  if (fn.length === 0) {
    return args => args;
  }
  if (fn.length === 1) {
    return fn[0];
  }
  return fn.reduce((a, b) => (...args) => a(b(...args)));
}
```