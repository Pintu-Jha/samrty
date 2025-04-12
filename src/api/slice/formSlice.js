import {createApi} from '@reduxjs/toolkit/query/react';
import {
  GET_FLOW_COMPLETE_JSON,
  GET_FLOW_INCOMPLETE_JSON,
  GET_WHATSAPP_FLOW_DATA,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const FormApiSlices = createApi({
  reducerPath: 'FormApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['Form'],
  endpoints: builder => ({
    // get whatsapp form data
    GetAllFromData: builder.query({
      query: () => ({
        url: `${GET_WHATSAPP_FLOW_DATA}`,
        method: 'GET',
      }),
    }),

    // Fetch All From Complete List
    GetAllCompleteFrom: builder.query({
      query: ({flow_name}) => ({
        url: `${GET_FLOW_COMPLETE_JSON}?flow_name=${flow_name}`,
        method: 'GET',
      }),
    }),
    // Fetch All From Complete List
    GetAllInCompleteFrom: builder.query({
      query: ({flow_name}) => ({
        url: `${GET_FLOW_INCOMPLETE_JSON}?flow_name=${flow_name}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLazyGetAllCompleteFromQuery,
  useLazyGetAllFromDataQuery,
  useLazyGetAllInCompleteFromQuery,
} = FormApiSlices;
