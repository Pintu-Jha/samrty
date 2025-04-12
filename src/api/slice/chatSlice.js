import {createApi} from '@reduxjs/toolkit/query/react';
import {
  ADD_ACTION_TO_WA_MESSAGE,
  CREATE_NEW_ACTION,
  DELETE_ALL_CHAT,
  DELETE_CHAT,
  GET_CHAT_WITH_WHATSAPP_NUMBER,
  GET_NEXT_ACTIONS,
  LIST_WHATSAPP_FLOWS,
  LIST_WHATSAPP_INTERACTIVE_MESSAGES,
  LIST_WHATSAPP_KEYWORD_MESSAGES,
  LIST_WHATSAPP_OPTION_MESSAGES,
  MARK_ALL_MESSAGE_READ,
  SEND_OUTGOING_MEDIA,
  SEND_OUTGOING_TEXT_MESSAGE,
  SEND_WHATSAPP_KEYWORD_MESSAGE,
  WHATSAPP_CHAT_KEYWORD_DOCTYPES,
} from '../../config/url';
import {customBaseQuery} from '../store/utils';

export const ChatApiSlices = createApi({
  reducerPath: 'ChatApiSlices',
  baseQuery: customBaseQuery,
  tagTypes: ['chat'],
  endpoints: builder => ({
    // Get All chat
    GetAllChat: builder.query({
      query: ({page, limit, mobile}) => ({
        url: `${GET_CHAT_WITH_WHATSAPP_NUMBER}?page=${page}&limit=${limit}&mobile=${mobile}`,
        method: 'GET',
      }),
    }),

    // Send Text Message
    SendOutGoingTextMessage: builder.mutation({
      query: payload => ({
        url: `${SEND_OUTGOING_TEXT_MESSAGE}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // send Keyword Message
    SendOutGoingKeyWordMessage: builder.mutation({
      query: payload => ({
        url: `${SEND_WHATSAPP_KEYWORD_MESSAGE}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Send Media Message
    SendOutGoingMediaMessage: builder.mutation({
      query: payload => ({
        url: `${SEND_OUTGOING_MEDIA}`,
        method: 'POST',
        body: payload,
      }),
    }),

    GetWhatsAppMessageKeywordList: builder.query({
      query: () => ({
        url: `${LIST_WHATSAPP_KEYWORD_MESSAGES}`,
        method: 'GET',
      }),
    }),

    GetWhatsAppFlows: builder.query({
      query: () => ({
        url: `${LIST_WHATSAPP_FLOWS}`,
        method: 'GET',
      }),
    }),

    GetWhatsAppInteractiveMessages: builder.query({
      query: () => ({
        url: `${LIST_WHATSAPP_INTERACTIVE_MESSAGES}`,
        method: 'GET',
      }),
    }),

    GetWhatsAppOptionMessages: builder.query({
      query: () => ({
        url: `${LIST_WHATSAPP_OPTION_MESSAGES}`,
        method: 'GET',
      }),
    }),
    // send whatsapp keyword message
    SendWhatsappKeyWordMessage: builder.mutation({
      query: payload => ({
        url: `${SEND_WHATSAPP_KEYWORD_MESSAGE}`,
        method: 'POST',
        body: payload,
      }),
    }),
    // get MARK ALL MESSAGE READ
    chatMarkAsRead: builder.query({
      query: ({number}) => ({
        url: `${MARK_ALL_MESSAGE_READ}?number=${number}`,
        method: 'GET',
      }),
    }),
    // Delete Chats
    DeleteChats: builder.mutation({
      query: ({record_names}) => ({
        url: `${DELETE_CHAT}?record_names=${record_names}`,
        method: 'POST',
      }),
    }),
    // all Delete Chats
    AlldeleteChat: builder.mutation({
      query: contacts => ({
        url: `${DELETE_ALL_CHAT}`,
        method: 'POST',
        body: contacts,
      }),
    }),
    // all Delete Chats
    AddActionToWaMessage: builder.mutation({
      query: payload => ({
        url: `${ADD_ACTION_TO_WA_MESSAGE}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // get next actions
    GetNextActions: builder.query({
      query: () => ({
        url: `${GET_NEXT_ACTIONS}`,
        method: 'GET',
      }),
    }),

    // create new action
    CreateNewAction: builder.mutation({
      query: payload => ({
        url: `${CREATE_NEW_ACTION}`,
        method: 'POST',
        body: payload,
      }),
    }),

    // GET KEYWORD DOCTYPE
    GetDocTypeKeyWord: builder.query({
      query: () => ({
        url: `${WHATSAPP_CHAT_KEYWORD_DOCTYPES}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetAllChatQuery,
  useLazyGetWhatsAppMessageKeywordListQuery,
  useLazyGetWhatsAppFlowsQuery,
  useLazyGetWhatsAppInteractiveMessagesQuery,
  useLazyGetWhatsAppOptionMessagesQuery,
  useSendOutGoingMediaMessageMutation,
  useSendOutGoingTextMessageMutation,
  useSendOutGoingKeyWordMessageMutation,
  useSendWhatsappKeyWordMessageMutation,
  useLazyChatMarkAsReadQuery,
  useDeleteChatsMutation,
  useAlldeleteChatMutation,
  useAddActionToWaMessageMutation,
  useLazyGetNextActionsQuery,
  useCreateNewActionMutation,
  useLazyGetDocTypeKeyWordQuery
} = ChatApiSlices;
