import {createApi} from '@reduxjs/toolkit/query/react';
import {SEARCH_CONTACT, SEARCH_MESSAGE} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const SearchApiSlices = createApi({
  reducerPath: 'SearchApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['search'],
  endpoints: builder => ({
    // search message
    searchMessage: builder.query({
      query: ({search_query, action, status_date}) => ({
        url: `${SEARCH_MESSAGE}?search_query=${search_query}&action=${action}&status_date=${status_date}`,
        method: 'GET',
      }),
    }),
    // search Contact
    searchConatct: builder.query({
      query: ({search_query}) => ({
        url: `${SEARCH_CONTACT}?search_query=${search_query}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {useLazySearchMessageQuery, useLazySearchConatctQuery} =
  SearchApiSlices;
