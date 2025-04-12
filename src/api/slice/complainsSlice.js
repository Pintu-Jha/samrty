import { createApi } from '@reduxjs/toolkit/query/react';
import {
  GET_COMPLAIN_TICKETS,
  GET_COMPLAIN_TICKETS_FILTERED,
  GET_COMPLAINTS_PANCHAYAT,
  GET_COMPLAINTS_PROFESSION,
  GET_COMPLAINTS_STATUS,
  GET_COMPLAINTS_TEHSIL,
  GET_COMPLAINTS_VILLAGES,
  SEND_TEXT_COMPLAINT_MESSAGE,
  SEND_WHATSAPP_COMPLAINT_MESSAGE_CHECK,
  UPDATE_COMPLAINTS_TICKET
} from '../../config/url';
import { customBaseQuery } from '../store/utils';

export const ComplainsApiSlice = createApi({
  reducerPath: 'ComplainsApiSlice',
  baseQuery: customBaseQuery,
  tagTypes: ['ComplainsSlice'],
  endpoints: builder => ({
    // Fetch all Complains
    fetchAllComplains: builder.query({
      query: () => ({
        url: `${GET_COMPLAIN_TICKETS}`,
        method: 'GET',
      }),
    }),

    // Fetch all Complains
    SendComments: builder.mutation({
      query: ({hd_ticket_name, message}) => ({
        url: `${SEND_TEXT_COMPLAINT_MESSAGE}`,
        method: 'POST',
        body: {
          hd_ticket_name,
          message,
        },
      }),
    }),

    // check message received more than 24 hours ago or not
    CheckSeesionForSendComment: builder.query({
      query: ({hd_ticket_name}) => ({
        url: `${SEND_WHATSAPP_COMPLAINT_MESSAGE_CHECK}?hd_ticket_name=${hd_ticket_name}`,
        method: 'GET',
      }),
    }),

    // Get all village
    GetAllVillages: builder.query({
      query: ({panchayat}) => ({
        url: `${GET_COMPLAINTS_VILLAGES}?panchayat=${panchayat}`,
        method: 'GET',
      }),
    }),

    // Get all Panchayat
    GetAllPanchayat: builder.query({
      query: ({tehsil}) => ({
        url: `${GET_COMPLAINTS_PANCHAYAT}?tehsil=${tehsil}`,
        method: 'GET',
      }),
    }),

    // Get all Tehsil
    GetAllTehsil: builder.query({
      query: () => ({
        url: `${GET_COMPLAINTS_TEHSIL}`,
        method: 'GET',
      }),
    }),

    // Get all Profession
    GetAllProfession: builder.query({
      query: () => ({
        url: `${GET_COMPLAINTS_PROFESSION}`,
        method: 'GET',
      }),
    }),

    // Get all Status
    GetAllStatus: builder.query({
      query: () => ({
        url: `${GET_COMPLAINTS_STATUS}`,
        method: 'GET',
      }),
    }),

    // Get Filter data
    GetAllFilteredComplaintsData: builder.query({
      query: ({
        page,
        limit,
        village,
        panchayat,
        tehsil,
        profession,
        mobile,
        status,
      }) => {
        const params = new URLSearchParams({
          page,
          limit,
          village,
          panchayat,
          tehsil,
          profession,
          mobile,
          status,
        });
        return {
          url: `${GET_COMPLAIN_TICKETS_FILTERED}?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    // update status
    UpdateStatus: builder.mutation({
      query: ({ticket_name, status}) => ({
        url: `${UPDATE_COMPLAINTS_TICKET}`,
        method: 'POST',
        body: {
          ticket_name,
          status,
        },
      }),
    }),
  }),
});

export const {
  useFetchAllComplainsQuery,
  useSendCommentsMutation,
  useCheckSeesionForSendCommentQuery,
  // all filters
  useLazyGetAllPanchayatQuery,
  useLazyGetAllProfessionQuery,
  useLazyGetAllStatusQuery,
  useLazyGetAllTehsilQuery,
  useLazyGetAllVillagesQuery,
  useGetAllFilteredComplaintsDataQuery,
  useLazyGetAllFilteredComplaintsDataQuery,

  useUpdateStatusMutation,
} = ComplainsApiSlice;
