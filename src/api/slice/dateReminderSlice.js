import { createApi } from '@reduxjs/toolkit/query/react';
import {
  CREATE_NEW_DATE_ALERT,
  GET_ALL_DATE_ALERTS,
  GET_DATE_FIELD,
  GET_DOC_FEILDS_FOR_VARIABLE,
  GET_DOCTYPE,
  GET_PHONE_FIELDS,
  GET_REPETITION_FREQUENCY,
  GET_SINGLE_DATE_ALERTS,
  GET_TIME_UNIT,
  GET_TRIIGER_TIME,
  GET_WHATSAPP_TEMPLATES,
  SUMBIT_ALERT_MESSAGE,
  Update_DATE_ALERT,
} from '../../config/url';
import { customBaseQuery } from '../store/utils';

export const DateRemindersApiSlices = createApi({
  reducerPath: 'DateRemindersApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['dateReminders'],
  endpoints: (builder) => ({
    // Fetch All reminders List
    getAllReminders: builder.query({
      query: ({ page, limit }) => ({
        url: `${GET_ALL_DATE_ALERTS}?page=${page}&limit=${limit}`,
        method: 'GET',
      }),
    }),

    // Get All Doctype List
    getAllDoctype: builder.query({
      query: () => ({
        url: GET_DOCTYPE,
        method: 'GET',
      }),
    }),

    // Get Trigger Time
    getTriggerTime: builder.query({
      query: () => ({
        url: GET_TRIIGER_TIME,
        method: 'GET',
      }),
    }),

    // Get Time Unit
    getTimeUnit: builder.query({
      query: ({ doctype }) => ({
        url: `${GET_TIME_UNIT}?doctype=${doctype}`,
        method: 'GET',
      }),
    }),

    // Get Repetition Frequency
    getRepetitionFrequency: builder.query({
      query: ({ doctype }) => ({
        url: `${GET_REPETITION_FREQUENCY}?doctype=${doctype}`,
        method: 'GET',
      }),
    }),

    // Get Date Field
    getDateField: builder.query({
      query: ({ doctype }) => ({
        url: `${GET_DATE_FIELD}?doctype=${doctype}`,
        method: 'GET',
      }),
    }),

    // Get Phone Fields
    getPhoneFields: builder.query({
      query: ({ doctype }) => ({
        url: `${GET_PHONE_FIELDS}?doctype=${doctype}`,
        method: 'GET',
      }),
    }),

    // Get WhatsApp Template
    getWhatsappTemplate: builder.query({
      query: () => ({
        url: GET_WHATSAPP_TEMPLATES,
        method: 'GET',
      }),
    }),

    // Get Single Date Alert
    getSingleDateAlert: builder.query({
      query: (name) => ({
        url: `${GET_SINGLE_DATE_ALERTS}?name=${name}`,
        method: 'GET',
      }),
    }),

    // Create New Date Alert
    createNewDateAlert: builder.mutation({
      query: (payload) => ({
        url: CREATE_NEW_DATE_ALERT,
        method: 'POST',
        body: payload,
      }),
    }),

    // Update Date Field
    updateNewDateAlert: builder.mutation({
      query: (payload) => ({
        url: `${Update_DATE_ALERT}`,
        method: 'PUT',
        body: payload,
      }),
    }),

    // Submit New Date Alert
    submitNewDateAlert: builder.query({
      query: ({ name }) => ({
        url: `${SUMBIT_ALERT_MESSAGE}?name=${name}`,
        method: 'GET',
      }),
    }),

    // Get Document Fields for Variable
    getDocFieldForVariable: builder.query({
      query: ({ doctype }) => ({
        url: `${GET_DOC_FEILDS_FOR_VARIABLE}?doctype=${doctype}`,
        method: 'GET',
      }),
    }),
  }),
});

// Export Hooks
export const {
  useLazyGetAllRemindersQuery,
  useLazyGetAllDoctypeQuery,
  useLazyGetTriggerTimeQuery,
  useLazyGetTimeUnitQuery,
  useLazyGetRepetitionFrequencyQuery,
  useLazyGetDateFieldQuery,
  useLazyGetPhoneFieldsQuery,
  useLazyGetWhatsappTemplateQuery,
  useCreateNewDateAlertMutation,
  useLazyGetSingleDateAlertQuery,
  useLazyGetDocFieldForVariableQuery,
  useUpdateNewDateAlertMutation, 
  useLazySubmitNewDateAlertQuery, 
} = DateRemindersApiSlices;
