const redux = require("redux");
const createStore = redux.createStore;
const combineReducers = redux.combineReducers;

//ACTIONS
const BUY_SHOE = "BUY_SHOE";
const BUY_SHIRT = "BUY_SHIRT";

function buyShoe() {
  return {
    type: BUY_SHOE,
  };
}

function buyShirt() {
  return {
    type: BUY_SHIRT,
  };
}

//=================================================================
//REDUCERS -- (previousState, action) => newState

const initialShoeState = {
  numOfShoes: 10,
};

const initialShirtState = {
  numOfShirts: 20,
};

const shoeReducer = (state = initialShoeState, action) => {
  switch (action.type) {
    case BUY_SHOE:
      return {
        ...state,
        numOfShoes: state.numOfShoes - 1,
      };

    default:
      return state;
  }
};

const shirtReducer = (state = initialShirtState, action) => {
  switch (action.type) {
    case BUY_SHIRT:
      return {
        ...state,
        numOfShirts: state.numOfShirts - 1,
      };

    default:
      return state;
  }
};

//COMBINE THE ABOVE REDUCER

const rootReducer = combineReducers({
  shoe: shoeReducer,
  shirt: shirtReducer,
});

//CREATE STORES AND DISPATCH
const store = createStore(rootReducer);
console.log("initital state", store.getState());

const unsubscribe = store.subscribe(() =>
  console.log("updated state", store.getState())
);

store.dispatch(buyShoe());
store.dispatch(buyShirt());
store.dispatch(buyShoe());
unsubscribe();

// ===========================================ASYNC API CALLS THUNK MIDDLEWARE=====================================================

const thunkMiddleware = require("redux-thunk").default;
const axios = require("axios");

//MIDDLEWARE
const applyMiddleware = redux.applyMiddleware;

//ACTIONS
const initialState = {
  loading: false,
  users: [],
  error: "",
};

const FETCH_USERS_REQUEST = "FETCH_USERS_REQUEST";
const FETCH_USERS_SUCCESS = "FETCH_USERS_SUCCESS";
const FETCH_USERS_FAILURE = "FETCH_USERS_FAILURE";

const fetchUsersRequest = () => {
  return {
    type: FETCH_USERS_REQUEST,
  };
};

const fetchUsersSuccess = (users) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: users,
  };
};

const fetchUsersFailure = (error) => {
  return {
    type: FETCH_USERS_FAILURE,
    payload: error,
  };
};

const fetchUsers = () => {
  return function (dispatch) {
    dispatch(fetchUsersRequest());
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((response) => {
        // response.data is the users
        const users = response.data.map((user) => user.id);
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        // error.message is the error message
        dispatch(fetchUsersFailure(error.message));
      });
  };
};

const reducer = (state = initialState, action) => {
  console.log(action.type);
  switch (action.type) {
    case FETCH_USERS_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case FETCH_USERS_SUCCESS:
      return {
        loading: false,
        users: action.payload,
        error: "",
      };
    case FETCH_USERS_FAILURE:
      return {
        loading: false,
        users: [],
        error: action.payload,
      };
  }
};

const asyncStore = createStore(reducer, applyMiddleware(thunkMiddleware));
asyncStore.subscribe(() => {
  console.log(asyncStore.getState());
});
asyncStore.dispatch(fetchUsers());
