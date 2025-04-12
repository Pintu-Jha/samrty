import { createApi } from '@reduxjs/toolkit/query/react';
import {
  CREATE_PROJECT,
  CREATE_PROJECT_SCHEME,
  GET_PROJECT,
  GET_PROJECT_ALL_PANCHAYAT,
  GET_PROJECT_ALL_VILLAAGES,
  GET_PROJECT_PANCHAYAT,
  GET_PROJECT_SCHEME,
  GET_PROJECT_STATUS,
  GET_PROJECT_TEHSIL,
  GET_PROJECT_TYPE,
  GET_PROJECT_VILLAGES,
  Update_PROJECT_Details,
  UPDATE_PROJECT_STATUS,
} from '../../config/url';
import { customBaseQuery } from '../store/utils';

export const ProjectSlice = createApi({
  reducerPath: 'ProjectSlice',
  baseQuery: customBaseQuery,
  tagTypes: ['ProjectSlice'],
  endpoints: builder => ({
    // Get all Project
    GetAllProject: builder.query({
      query: ({page, limit, village, panchayat, tehsil, status}) => {
        const params = new URLSearchParams({
          page,
          limit,
          village,
          panchayat,
          tehsil,
          status,
        });
        return {
          url: `${GET_PROJECT}?${params.toString()}`,
          method: 'GET',
        };
      },
    }),
    // Get Villages
    GetProjectVillages: builder.query({
      query: ({panchayat}) => ({
        url: `${GET_PROJECT_VILLAGES}?panchayat=${panchayat}`,
        method: 'GET',
      }),
    }),

    // Get Panchayat
    GetProjectPanchayat: builder.query({
      query: ({tehsil}) => ({
        url: `${GET_PROJECT_PANCHAYAT}?tehsil=${tehsil}`,
        method: 'GET',
      }),
    }),

    // Get all Tehsil
    GetProjectTehsil: builder.query({
      query: () => ({
        url: `${GET_PROJECT_TEHSIL}`,
        method: 'GET',
      }),
    }),
    // Get all Status
    GetProjectStatus: builder.query({
      query: () => ({
        url: `${GET_PROJECT_STATUS}`,
        method: 'GET',
      }),
    }),
    // Create Project
    CreateProject: builder.mutation({
      query: payload => ({
        url: `${CREATE_PROJECT}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get Project type
    GetProjectType: builder.query({
      query: () => ({
        url: `${GET_PROJECT_TYPE}`,
        method: 'GET',
      }),
    }),

    // Get Project Scheme
    GetProjectScheme: builder.query({
      query: () => ({
        url: `${GET_PROJECT_SCHEME}`,
        method: 'GET',
      }),
    }),
    // Get all Panchayat
    GetProjectAllPanchayat: builder.query({
      query: () => ({
        url: `${GET_PROJECT_ALL_PANCHAYAT}`,
        method: 'GET',
      }),
    }),

    // Get All Villages
    GetProjectAllVillages: builder.query({
      query: () => ({
        url: `${GET_PROJECT_ALL_VILLAAGES}`,
        method: 'GET',
      }),
    }),
    // create project scheme
    CreateProjectScheme: builder.mutation({
      query: ({scheme_name}) => ({
        url: `${CREATE_PROJECT_SCHEME}?scheme_name=${scheme_name}`,
        method: 'POST',
      }),
    }),
    // update project status
    updateProjectStatus: builder.mutation({
      query: ({project_name, project_status}) => ({
        url: `${UPDATE_PROJECT_STATUS}`,
        method: 'PUT',
        body: {
          project_name,
          project_status,
        },
      }),
    }),

    // update project Details
    updateProjectDetails: builder.mutation({
      query: (payload) => ({
        url: `${Update_PROJECT_Details}`,
        method: 'PUT',
        body: payload,
      }),
    }),
  }),
});

export const {
  useLazyGetProjectPanchayatQuery,
  useLazyGetProjectStatusQuery,
  useLazyGetProjectTehsilQuery,
  useLazyGetProjectVillagesQuery,
  useLazyGetAllProjectQuery,
  useCreateProjectMutation,
  useLazyGetProjectTypeQuery,
  useLazyGetProjectAllPanchayatQuery, 
  useLazyGetProjectAllVillagesQuery,
  useLazyGetProjectSchemeQuery,
  useCreateProjectSchemeMutation,
  useUpdateProjectStatusMutation,
  useUpdateProjectDetailsMutation,
} = ProjectSlice;
