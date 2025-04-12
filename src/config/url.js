import {
  DATE_ALERTS,
  MLA_docType,
  whatsapp_broadCast_docType,
  whatsapp_chat_docType,
  whatsapp_chat_mobile_docType,
  whatsapp_chat_smarty_flow_docType1,
  whatsapp_chat_task_docType,
  whatsapp_chat_wa_task_management_docType,
} from './docType';


//whatsapp chat
export const GET_WHATSAPP_MESSAGE = `${whatsapp_chat_docType}get_whatsapp_message_with_pagination`;
export const GET_CHAT_WITH_WHATSAPP_NUMBER = `${whatsapp_chat_docType}get_chat_with_whatsapp_number`;
export const SEND_OUTGOING_TEXT_MESSAGE = `${whatsapp_chat_docType}send_outgoing_text_message`;
export const SEND_OUTGOING_MEDIA = `${whatsapp_chat_docType}send_outgoing_media_message`;
export const GET_WHATSAPP_TEMPLATES = `${whatsapp_chat_docType}get_whatsapp_templates`;
export const GET_UPLOADED_MEDIA = `${whatsapp_chat_docType}get_uploaded_media`;
export const SEND_TEMPLATE = `${whatsapp_chat_docType}send_template`;
export const SEND_TEMPLATE_TO_MULTIPLE_NUMBERS = `${whatsapp_chat_docType}send_template_to_multiple_numbers`;
export const LIST_WHATSAPP_KEYWORD_MESSAGES = `${whatsapp_chat_docType}list_whatsapp_keyword_messages`;
export const LIST_WHATSAPP_FLOWS = `${whatsapp_chat_docType}list_whatsapp_flows`;
export const LIST_WHATSAPP_INTERACTIVE_MESSAGES = `${whatsapp_chat_docType}list_whatsapp_interactive_messages`;
export const LIST_WHATSAPP_OPTION_MESSAGES = `${whatsapp_chat_docType}list_whatsapp_option_messages`;
export const SEND_WHATSAPP_KEYWORD_MESSAGE = `${whatsapp_chat_docType}send_keyword_message`;
export const MARK_ALL_MESSAGE_READ = `${whatsapp_chat_docType}mark_all_message_read`;
export const SEARCH_MESSAGE = `${whatsapp_chat_docType}search_whatsapp_message`;
export const DELETE_CHAT = `${whatsapp_chat_docType}delete_chats`;
export const DELETE_CONTACT = `${whatsapp_chat_docType}delete_contacts`;
export const DELETE_ALL_CHAT = `${whatsapp_chat_docType}delete_all_chats`;
export const ADD_ACTION_TO_WA_MESSAGE = `${whatsapp_chat_docType}add_action_to_wa_message`;
export const GET_NEXT_ACTIONS = `${whatsapp_chat_docType}get_next_actions`;
export const CREATE_NEW_ACTION = `${whatsapp_chat_docType}create_new_next_action`;
export const WHATSAPP_CHAT_KEYWORD_DOCTYPES = `${whatsapp_chat_docType}get_keyword_message_doctype`

// Contact APIs
export const GET_WHATSAPP_CONTACTS = `${whatsapp_chat_mobile_docType}get_contacts`;
export const GET_WHATSAPP_CONTACT_CATEGORY = `${whatsapp_chat_mobile_docType}get_contact_category`;
export const GET_WHATSAPP_CONTACT_DETAILS = `${whatsapp_chat_mobile_docType}get_contact_details`;
export const CREATE_WHATSAPP_CONTACT = `${whatsapp_chat_mobile_docType}create_contact`;
export const SEARCH_CONTACT = `${whatsapp_chat_mobile_docType}search_contact`;

// Task Management APIs
export const GET_TODAY_TASK = `${whatsapp_chat_wa_task_management_docType}get_todays_tasks`;
export const GET_YESTERDAY_TASK = `${whatsapp_chat_wa_task_management_docType}get_yesterdays_tasks`;
export const GET_THIS_WEEKS_TASK = `${whatsapp_chat_wa_task_management_docType}get_this_weeks_tasks`;
export const GET_LAST_WEEKS_TASK = `${whatsapp_chat_wa_task_management_docType}get_last_weeks_tasks`;
export const GET_THIS_MONTHS_TASK = `${whatsapp_chat_wa_task_management_docType}get_this_months_tasks`;
export const GET_LAST_MONTHS_TASK = `${whatsapp_chat_wa_task_management_docType}get_last_months_tasks`;
export const GET_THIS_YEARS_TASK = `${whatsapp_chat_wa_task_management_docType}get_this_years_tasks`;
export const GET_ALL_TIME_TASK = `${whatsapp_chat_wa_task_management_docType}get_all_tasks`;

// Flow APIs
export const GET_WHATSAPP_FLOW_DATA = `${whatsapp_chat_mobile_docType}get_whatsapp_flow_data`;
export const GET_FLOW_COMPLETE_JSON = `${whatsapp_chat_mobile_docType}get_completed_whatsapp_flow_data`;
export const GET_FLOW_INCOMPLETE_JSON = `${whatsapp_chat_mobile_docType}get_incomplete_whatsapp_flow_data`;

// Task APIs
export const GET_TASK_CATEGORY = `${whatsapp_chat_task_docType}get_category`;
export const GET_TASK_FREQUENCY = `${whatsapp_chat_task_docType}get_frequency`;
export const GET_TASK_HOUR = `${whatsapp_chat_task_docType}get_start_hour`;
export const GET_TASK_MINUTES = `${whatsapp_chat_task_docType}get_start_minutes`;
export const GET_TASK_EXPECTED_TIME = `${whatsapp_chat_task_docType}get_expected_time_options`;
export const GET_TASK_PRIORITY = `${whatsapp_chat_task_docType}get_priority`;
export const GET_TASK_IMPORTANCE = `${whatsapp_chat_task_docType}get_importance`;
export const GET_TASK_SELECT_TEAM_MEMBER = `${whatsapp_chat_task_docType}get_user`;
export const GET_TASK_MONTH = `${whatsapp_chat_task_docType}get_month_options`;
export const GET_TASK_DAY = `${whatsapp_chat_task_docType}get_day_options`;
export const GET_TASK_DATE_OF_MONTH = `${whatsapp_chat_task_docType}get_date_options`;
export const CREATE_REPEAT_TASK = `${whatsapp_chat_task_docType}create_repeat_task`;
export const CREATE_TASK = `${whatsapp_chat_task_docType}create_task`;
export const UPDATE_TASK_STATUS = `${whatsapp_chat_task_docType}update_task_status`;
export const GET_PENDING_TASK_ASSIGNED_BY_ME = `${whatsapp_chat_task_docType}get_pending_task_assigned_by_me`;
export const GET_PENDING_TASK_ASSIGNED_TO_ME = `${whatsapp_chat_task_docType}get_pending_task_assigned_to_me`;
export const GET_OVERDUE_TASK_ASSIGNED_BY_ME = `${whatsapp_chat_task_docType}get_overdue_task_assigned_by_me`;
export const GET_OVERDUE_TASK_ASSIGNED_TO_ME = `${whatsapp_chat_task_docType}get_overdue_task_assigned_to_me`;
export const GET_COMPLETED_TASK_ASSIGNED_BY_ME = `${whatsapp_chat_task_docType}get_completed_task_assigned_by_me`;
export const GET_COMPLETED_TASK_ASSIGNED_TO_ME = `${whatsapp_chat_task_docType}get_completed_task_assigned_to_me`;
export const GET_TASK_COMMENT = `${whatsapp_chat_task_docType}get_task_comments`;
export const GET_TASK_STATUS = `${whatsapp_chat_task_docType}get_task_status`;
export const CHANGE_TASK_STATUS = `${whatsapp_chat_task_docType}change_task_status`;
export const ATTACH_FILE_TO_TASK = `${whatsapp_chat_task_docType}attach_file_to_task`;
export const GET_FILE_ATTACHMENT_TO_TASK = `${whatsapp_chat_task_docType}get_files_attached_to_task`;
export const SEND_COMMENTS_TO_TASK = `${whatsapp_chat_task_docType}add_comments_to_task`;

// BroadCast APIs
export const GET_BROADCAST_GROUP = `${whatsapp_broadCast_docType}get_broadcast_groups`;
export const GET_BROADCAST_GROUP_DETAILS = `${whatsapp_broadCast_docType}get_broadcast_group_detail`;
export const CREATE_NEW_GROUP = `${whatsapp_broadCast_docType}create_new_group`;
export const ADD_MEMBER_IN_GROUP = `${whatsapp_broadCast_docType}add_contact_to_broadcast_group`;
export const GET_CRITERIA = `${whatsapp_broadCast_docType}get_criteria`;
export const GET_OPERATOR = `${whatsapp_broadCast_docType}get_operator`;
export const GET_LOGICAL_OPERATOR = `${whatsapp_broadCast_docType}get_logical_operator`;
export const GET_SENT_BROADCASTED_MESSAGE = `${whatsapp_broadCast_docType}get_sent_broadcasted_messages`;
export const GET_BROADCAST_MESSAGE_STATUS = `${whatsapp_broadCast_docType}get_broadcast_message_status`;
export const GET_CONTACTS_BY_BROADCAST_STATUS = `${whatsapp_broadCast_docType}get_contacts_by_broadcast_status`;
export const CREATE_NEW_BROADCAST_MESSAGE = `${whatsapp_broadCast_docType}create_new_broadcast`;
export const GET_BROADCAST_MESSAGE_TEMPLATE = `${whatsapp_broadCast_docType}get_whatsapp_templates`;
export const UPDATE_BROADCAST_GROUP_MEMEBER = `${whatsapp_broadCast_docType}update_group`;

// project APIs
export const Update_PROJECT_Details = `${MLA_docType}update_project_details`;
export const GET_PROJECT = `${MLA_docType}get_projects`;
export const GET_PROJECT_VILLAGES = `${MLA_docType}get_project_villages`;
export const GET_PROJECT_PANCHAYAT = `${MLA_docType}get_project_panchayat`;
export const GET_PROJECT_TEHSIL = `${MLA_docType}get_project_tehsil`;
export const GET_PROJECT_STATUS = `${MLA_docType}get_project_status`;
export const CREATE_PROJECT = `${MLA_docType}create_project`;
export const GET_PROJECT_TYPE = `${MLA_docType}get_project_type`;
export const GET_PROJECT_SCHEME = `${MLA_docType}get_project_scheme`;
export const GET_PROJECT_ALL_PANCHAYAT = `${MLA_docType}get_all_panchayat`;
export const GET_PROJECT_ALL_VILLAAGES = `${MLA_docType}get_all_villages`;
export const CREATE_PROJECT_SCHEME = `${MLA_docType}create_project_scheme`;
export const UPDATE_PROJECT_STATUS = `${MLA_docType}update_project_status`;

//complaints APIs
export const GET_COMPLAIN_TICKETS = `${MLA_docType}get_complain_tickets`;
export const SEND_TEXT_COMPLAINT_MESSAGE = `${MLA_docType}send_text_message`;
export const SEND_WHATSAPP_COMPLAINT_MESSAGE_CHECK = `${MLA_docType}send_whatsapp_message_check`;
export const GET_COMPLAINTS_VILLAGES = `${MLA_docType}get_villages`;
export const GET_COMPLAINTS_PANCHAYAT = `${MLA_docType}get_panchayat`;
export const GET_COMPLAINTS_TEHSIL = `${MLA_docType}get_tehsil`;
export const GET_COMPLAINTS_PROFESSION = `${MLA_docType}get_profession`;
export const GET_COMPLAINTS_STATUS = `${MLA_docType}get_status`;
export const GET_COMPLAIN_TICKETS_FILTERED = `${MLA_docType}get_complain_tickets_filtered`;
export const UPDATE_COMPLAINTS_TICKET = `${MLA_docType}update_ticket`;

// feedBack APIs
export const SEND_TEXT_FEEDBACK_MESSAGE = `${MLA_docType}send_text_message`;
export const SEND_WHATSAPP_FEEDBACK_MESSAGE_CHECK= `${MLA_docType}send_whatsapp_message_check`;
export const GET_FEEDBACK_VILLAGES= `${MLA_docType}get_villages`;
export const GET_FEEDBACK_PANCHAYAT= `${MLA_docType}get_panchayat`;
export const GET_FEEDBACK_TEHSIL= `${MLA_docType}get_tehsil`;
export const GET_FEEDBACK_PROFESSION= `${MLA_docType}get_profession`;
export const GET_FEEDBACK_STATUS= `${MLA_docType}get_status`;
export const GET_FEEDBACK_TICKETS_FILTERED= `${MLA_docType}get_feedback_tickets_filtered`;
export const UPDATE_FEEDBACK_TICKETS= `${MLA_docType}update_ticket`;


//date alerts
export const GET_ALL_DATE_ALERTS = `${DATE_ALERTS}get_all_date_alerts`;
export const GET_DOCTYPE = `${DATE_ALERTS}get_doctype_for_date_alert`;
export const GET_TRIIGER_TIME = `${DATE_ALERTS}get_trigger_time`;
export const GET_TIME_UNIT = `${DATE_ALERTS}get_time_unit`;
export const GET_REPETITION_FREQUENCY = `${DATE_ALERTS}get_repetition_frequency`;
export const GET_DATE_FIELD = `${DATE_ALERTS}get_date_field`;
export const GET_PHONE_FIELDS = `${DATE_ALERTS}get_phone_fields`;
export const CREATE_NEW_DATE_ALERT = `${DATE_ALERTS}create_new_date_alert`;
export const GET_SINGLE_DATE_ALERTS = `${DATE_ALERTS}get_single_date_alerts`;
export const GET_DOC_FEILDS_FOR_VARIABLE = `${DATE_ALERTS}get_doc_fields_for_variable`;
export const SUMBIT_ALERT_MESSAGE = `${DATE_ALERTS}submit_alert_message`;
export const Update_DATE_ALERT = `${DATE_ALERTS}update_date_alert`;

