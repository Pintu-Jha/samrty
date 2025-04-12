import {createApi} from '@reduxjs/toolkit/query/react';
import {
  GET_FEEDBACK_PANCHAYAT,
  GET_FEEDBACK_PROFESSION,
  GET_FEEDBACK_STATUS,
  GET_FEEDBACK_TEHSIL,
  GET_FEEDBACK_TICKETS_FILTERED,
  GET_FEEDBACK_VILLAGES,
  SEND_TEXT_FEEDBACK_MESSAGE,
  SEND_WHATSAPP_FEEDBACK_MESSAGE_CHECK,
  UPDATE_FEEDBACK_TICKETS,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const feedBackSlice = createApi({
  reducerPath: 'feedBackSlice',
  baseQuery: customBaseQuery,
  tagTypes: ['feedBackSlice'],
  endpoints: builder => ({
    // Fetch all Complains
    SendComments: builder.mutation({
      query: ({hd_ticket_name, message}) => ({
        url: `${SEND_TEXT_FEEDBACK_MESSAGE}`,
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
        url: `${SEND_WHATSAPP_FEEDBACK_MESSAGE_CHECK}?hd_ticket_name=${hd_ticket_name}`,
        method: 'GET',
      }),
    }),

    // Get all village
    GetAllVillages: builder.query({
      query: ({panchayat}) => ({
        url: `${GET_FEEDBACK_VILLAGES}?panchayat=${panchayat}`,
        method: 'GET',
      }),
    }),

    // Get all Panchayat
    GetAllPanchayat: builder.query({
      query: ({tehsil}) => ({
        url: `${GET_FEEDBACK_PANCHAYAT}?tehsil=${tehsil}`,
        method: 'GET',
      }),
    }),

    // Get all Tehsil
    GetAllTehsil: builder.query({
      query: () => ({
        url: `${GET_FEEDBACK_TEHSIL}`,
        method: 'GET',
      }),
    }),

    // Get all Profession
    GetAllProfession: builder.query({
      query: () => ({
        url: `${GET_FEEDBACK_PROFESSION}`,
        method: 'GET',
      }),
    }),

    // Get all Status
    GetAllStatus: builder.query({
      query: () => ({
        url: `${GET_FEEDBACK_STATUS}`,
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
          url: `${GET_FEEDBACK_TICKETS_FILTERED}?${params.toString()}`,
          method: 'GET',
        };
      },
    }),

    // update status
    UpdateStatus: builder.mutation({
      query: ({ticket_name, status}) => ({
        url: `${UPDATE_FEEDBACK_TICKETS}`,
        method: 'PUT',
        body: {
          ticket_name,
          status,
        },
      }),
    }),
  }),
});

export const {
  useSendCommentsMutation,
  useCheckSeesionForSendCommentQuery,
  // all filters
  useLazyGetAllPanchayatQuery,
  useLazyGetAllProfessionQuery,
  useLazyGetAllStatusQuery,
  useLazyGetAllTehsilQuery,
  useLazyGetAllVillagesQuery,
  useLazyGetAllFilteredComplaintsDataQuery,
  useUpdateStatusMutation,
} = feedBackSlice;
