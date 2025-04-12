import {createApi} from '@reduxjs/toolkit/query/react';
import {
  GET_UPLOADED_MEDIA,
  GET_WHATSAPP_TEMPLATES,
  SEND_TEMPLATE,
  SEND_TEMPLATE_TO_MULTIPLE_NUMBERS,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const TempleteApiSlices = createApi({
  reducerPath: 'TempleteApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['Templete'],
  endpoints: builder => ({
    // get Temepete
    GetAllTemplete: builder.query({
      query: () => ({
        url: `${GET_WHATSAPP_TEMPLATES}`,
        method: 'GET',
      }),
    }),
    // Uploade media
    UploadeMedia: builder.mutation({
      query: ({header_type}) => ({
        url: `${GET_UPLOADED_MEDIA}`,
        method: 'POST',
        body: header_type,
      }),
    }),
    // Send multiple number to templete
    SendTemplateToMultipleNumber: builder.mutation({
      query: (payload) => ({
        url: `${SEND_TEMPLATE_TO_MULTIPLE_NUMBERS}`,
        method: 'POST',
        body: payload,
      }),
    }),
    // Send multiple number to templete
    SendTemplate: builder.mutation({
      query: payload => ({
        url: `${SEND_TEMPLATE}`,
        method: 'POST',
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetAllTempleteQuery,
  useUploadeMediaMutation,
  useSendTemplateToMultipleNumberMutation,
  useSendTemplateMutation,
} = TempleteApiSlices;
