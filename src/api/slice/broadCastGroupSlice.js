import {createApi} from '@reduxjs/toolkit/query/react';
import {
  ADD_MEMBER_IN_GROUP,
  CREATE_NEW_GROUP,
  GET_BROADCAST_GROUP,
  GET_CRITERIA,
  GET_LOGICAL_OPERATOR,
  GET_OPERATOR,
  UPDATE_BROADCAST_GROUP_MEMEBER,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const BroadCastGroupApiSlices = createApi({
  reducerPath: 'BroadCastGroupApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['BroadCastGroup'],
  endpoints: builder => ({
    // Fetch search BroadCast group Member
    SearchBroadCastGroupMember: builder.mutation({
      query: payload => ({
        url: `api/method/frappe_whatsapp.broadcasting.search_contact_in_broadcast_group`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Fetch BroadCast group Details
    fetchBroadCastGroupDetails: builder.query({
      query: ({name}) => ({
        url: `api/method/frappe_whatsapp.broadcasting.get_broadcast_group_detail?name=${name}`,
        method: 'GET',
      }),
    }),
    // Get BroadCast group
    getBroadCastGroup: builder.query({
      query: () => ({
        url: `${GET_BROADCAST_GROUP}`,
        method: 'GET',
      }),
    }),
    // Get BroadCast group
    addMemberInGroup: builder.mutation({
      query: ({name, contact_name, contact_mobile_no}) => ({
        url: `${ADD_MEMBER_IN_GROUP}`,
        method: 'POST',
        body: {
          name,
          contact_name,
          contact_mobile_no,
        },
      }),
    }),

    addMemberInGroupMultiple: builder.mutation({
      query: payload => ({
        url: `${UPDATE_BROADCAST_GROUP_MEMEBER}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get BroadCast group
    createNewGroup: builder.mutation({
      query: payload => ({
        url: `${CREATE_NEW_GROUP}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get CRITERIA 
    getCriteria: builder.query({
      query: () => ({
        url: `${GET_CRITERIA}`,
        method: 'GET',
      }),
    }),
    // Get OPERATOR 
    getOperator: builder.query({
      query: () => ({
        url: `${GET_OPERATOR}`,
        method: 'GET',
      }),
    }),
    // Get LOGICAL OPERATOR 
    getLogicalQperator: builder.query({
      query: () => ({
        url: `${GET_LOGICAL_OPERATOR}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useSearchBroadCastGroupMemberMutation,
  useFetchBroadCastGroupDetailsQuery,
  useGetBroadCastGroupQuery,
  useAddMemberInGroupMutation,
  useCreateNewGroupMutation,
  useAddMemberInGroupMultipleMutation,
  useLazyGetCriteriaQuery,
  useLazyGetOperatorQuery,
  useLazyGetLogicalQperatorQuery
} = BroadCastGroupApiSlices;
