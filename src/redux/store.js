import { legacy_createStore, combineReducers } from 'redux';
import { searchKeywordReducer } from './reducers/SearchKeywordReducer';
import { itemCountChangedReducer } from './reducers/ItemCountChangedReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

const persistConfig = {
    key: 'ksnsourcing_reducers',
    storage,
    whitelist: [
        // 'searchKeywordReducer'
    ]
}

const reducer = combineReducers({
    searchKeywordReducer,
    itemCountChangedReducer,
});

//reducer进行持久化处理
const persistedReducer = persistReducer(persistConfig, reducer)

const store = legacy_createStore(persistedReducer);
const persistor = persistStore(store);

export { store, persistor };