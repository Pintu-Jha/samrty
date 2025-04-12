import colors from "../../utils/colors";

export const MESSAGE_RECEIVED_EVENT = 'new_whatsapp_message';
export const LIMIT = 30;
export const OPTIONS = [
  {
    name: 'Template',
    icon: 'TemplateIcon',
    iconColor: colors.orange800,
  },
  {
    name: 'Document',
    icon: 'Document',
    iconColor: colors.red800,
  },
  {
    name: 'Gallery',
    icon: 'Gallery', 
    iconColor: colors.purple800,
  },
  {
    name: 'Message',
    icon: 'ChatIcon',
    iconColor: colors.green800,
  }
];

export const DOCUMENT_TYPES = {
  DOCUMENT: 'document',
  MEDIA: 'media',
  TEMPLATE: 'template'
};