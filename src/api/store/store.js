import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { ProjectSlice } from '../slice/ProjectSlice';
import authReducer from '../slice/authSlice';
import { BroadCastGroupApiSlices } from '../slice/broadCastGroupSlice';
import { BroadCastMessageApiSlices } from '../slice/broadCastMessageSlice';
import { ChatApiSlices } from '../slice/chatSlice';
import { ComplainsApiSlice } from '../slice/complainsSlice';
import { contactApiSlices } from '../slice/contactSlice';
import { DateRemindersApiSlices } from '../slice/dateReminderSlice';
import domainReducer from '../slice/domainSlice';
import { feedBackSlice } from '../slice/feedBackSlice';
import { FormApiSlices } from '../slice/formSlice';
import { MessageApiSlices } from '../slice/messageSlice';
import { SearchApiSlices } from '../slice/searchSlice';
import { TempleteApiSlices } from '../slice/templeteSlice';
import themeReducer from '../slice/themeSlice';

const baseReducer = combineReducers({
  domains: domainReducer,
  auth: authReducer,
  theme: themeReducer,

  [ComplainsApiSlice.reducerPath]: ComplainsApiSlice.reducer,
  [feedBackSlice.reducerPath]: feedBackSlice.reducer,
  [BroadCastMessageApiSlices.reducerPath]: BroadCastMessageApiSlices.reducer,
  [BroadCastGroupApiSlices.reducerPath]: BroadCastGroupApiSlices.reducer,
  [MessageApiSlices.reducerPath]: MessageApiSlices.reducer,
  [ChatApiSlices.reducerPath]: ChatApiSlices.reducer,
  [SearchApiSlices.reducerPath]: SearchApiSlices.reducer,
  [contactApiSlices.reducerPath]: contactApiSlices.reducer,
  [FormApiSlices.reducerPath]: FormApiSlices.reducer,
  [TempleteApiSlices.reducerPath]: TempleteApiSlices.reducer,
  [ProjectSlice.reducerPath]: ProjectSlice.reducer,
  [DateRemindersApiSlices.reducerPath]: DateRemindersApiSlices.reducer,
});

const store = configureStore({
  reducer: baseReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: true,
    }).concat(
      BroadCastMessageApiSlices.middleware,
      BroadCastGroupApiSlices.middleware,
      MessageApiSlices.middleware,
      ChatApiSlices.middleware,
      SearchApiSlices.middleware,
      contactApiSlices.middleware,
      FormApiSlices.middleware,
      TempleteApiSlices.middleware,
      ProjectSlice.middleware,
      DateRemindersApiSlices.middleware,
      ComplainsApiSlice.middleware,
      feedBackSlice.middleware,
    ),
});

export default store;
