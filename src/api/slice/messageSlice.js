import {createApi} from '@reduxjs/toolkit/query/react';
import {customBaseQuery} from '../store/utils';
import {GET_WHATSAPP_MESSAGE} from '../../config/url';

export const MessageApiSlices = createApi({
  reducerPath: 'MessageApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['Message'],
  endpoints: builder => ({
    // Fetch All Message List
    GetAllMessageList: builder.query({
      query: ({page, page_size}) => ({
        url: `${GET_WHATSAPP_MESSAGE}?page=${page}&page_size=${page_size}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {useLazyGetAllMessageListQuery} = MessageApiSlices;
