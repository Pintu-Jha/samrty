import {createApi} from '@reduxjs/toolkit/query/react';
import {
  CREATE_WHATSAPP_CONTACT,
  DELETE_CONTACT,
  GET_WHATSAPP_CONTACT_CATEGORY,
  GET_WHATSAPP_CONTACT_DETAILS,
  GET_WHATSAPP_CONTACTS,
  SEARCH_CONTACT,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const contactApiSlices = createApi({
  reducerPath: 'contactApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['contact'],
  endpoints: builder => ({
    // Fetch All Contacts
    GetAllContact: builder.query({
      query: ({page, limit, category}) => ({
        url: `${GET_WHATSAPP_CONTACTS}?page=${page}&limit=${limit}&category=${category}`,
        method: 'GET',
      }),
    }),

    // Search Contacts
    searchContact: builder.query({
      query: ({search_query}) => ({
        url: `${SEARCH_CONTACT}?search_query=${search_query}`,
        method: 'GET',
      }),
    }),

    // Get WhatsApp Contact Category
    getWhatsAppContactCategory: builder.query({
      query: () => ({
        url: `${GET_WHATSAPP_CONTACT_CATEGORY}`,
        method: 'GET',
      }),
    }),

    //create conatct
    createContact: builder.mutation({
      query: payload => ({
        url: `${CREATE_WHATSAPP_CONTACT}`,
        method: 'POST',
        body: payload,
      }),
    }),

    //delete conatct
    deleteContact: builder.mutation({
      query: payload => ({
        url: `${DELETE_CONTACT}`,
        method: 'POST',
        body: payload,
      }),
    }),

    //conatct details
    contactDetails: builder.query({
      query: ({contact_name, mobile}) => ({
        url: `${GET_WHATSAPP_CONTACT_DETAILS}?contact_name=${contact_name}&mobile=${mobile}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useLazyGetAllContactQuery,
  useLazySearchContactQuery,
  useLazyGetWhatsAppContactCategoryQuery,
  useCreateContactMutation,
  useDeleteContactMutation,
  useLazyContactDetailsQuery,
} = contactApiSlices;
