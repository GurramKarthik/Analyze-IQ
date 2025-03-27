import {combineReducers,configureStore} from "@reduxjs/toolkit"
import userSlice from "./User"
import chatSlice from "./chat"
import dataframeSlice from "./Dataframe"
import dashboardDataSlice from "./Dashboard"
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
  } from 'redux-persist'
  import storage from 'redux-persist/lib/storage'
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2"

  const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    stateReconciler: autoMergeLevel2,
  }

  const rootReducer = combineReducers({
    user: userSlice,
    chat: chatSlice,
    fileURL: dataframeSlice,
    dashboardHtml : dashboardDataSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)


export const store = configureStore({ 
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        //  serializableCheck: {
        //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        // },
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
          immutableCheck: false,  
          serializableCheck: false 
        },
    }),
});


