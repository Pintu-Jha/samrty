import {createApi} from '@reduxjs/toolkit/query/react';
import {
  CREATE_NEW_BROADCAST_MESSAGE,
  GET_BROADCAST_MESSAGE_STATUS,
  GET_BROADCAST_MESSAGE_TEMPLATE,
  GET_CONTACTS_BY_BROADCAST_STATUS,
  GET_SENT_BROADCASTED_MESSAGE,
  GET_UPLOADED_MEDIA,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const BroadCastMessageApiSlices = createApi({
  reducerPath: 'BroadCastMessageApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['BroadCastMessages'],
  endpoints: builder => ({
    // Fetch all broadcasted messages
    fetchAllBroadcastMessages: builder.query({
      query: () => ({
        url: `${GET_SENT_BROADCASTED_MESSAGE}`,
        method: 'GET',
      }),
    }),

    // Fetch status and details of a single broadcasted message
    fetchMessageStatusAndDetails: builder.query({
      query: name => ({
        url: `${GET_BROADCAST_MESSAGE_STATUS}?name=${name}`,
        method: 'GET',
      }),
    }),

    // Fetch contacts by broadcast status
    fetchContactsByStatus: builder.query({
      query: ({broadcast_name, status}) => ({
        url: `${GET_CONTACTS_BY_BROADCAST_STATUS}?broadcast_name=${broadcast_name}&status=${status}`,
        method: 'GET',
      }),
    }),
    // Fetch contacts by Send BroadCast Message
    SendBroadCastMessage: builder.mutation({
      query: payload => ({
        url: `${CREATE_NEW_BROADCAST_MESSAGE}`,
        method: 'POST',
        body: payload,
      }),
    }),
    // Fetch BroadCast Message Template
    fetchBroadCastMessageTemplate: builder.query({
      query: () => ({
        url: `${GET_BROADCAST_MESSAGE_TEMPLATE}`,
        method: 'GET',
      }),
    }),

    // Uploade media
    UploadeMedia: builder.query({
      query: ({header_type}) => ({
        url: `${GET_UPLOADED_MEDIA}?header_type=${header_type}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useFetchAllBroadcastMessagesQuery,
  useFetchMessageStatusAndDetailsQuery,
  useFetchContactsByStatusQuery,
  useSendBroadCastMessageMutation,
  useLazyFetchBroadCastMessageTemplateQuery,
  useLazyUploadeMediaQuery,
} = BroadCastMessageApiSlices;
