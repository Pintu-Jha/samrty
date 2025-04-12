import React from 'react';
import { CommonPopupModal } from '../../Common/CommonPopupModal';
import { MediaPreviewModal } from '../../common/MediaPreviewModal';
import colors from '../../../utils/colors';

export const MessageModals = ({
  modals,
  handlers
}) => {
  const {
    isSubscribe,
    confirmationModalDocument,
    isDeleteMode,
    isClearChat,
    showPreviewModal,
    openChatTemplate,
  } = modals;

  return (
    <>
      <CommonPopupModal
        isVisible={isSubscribe}
        buttons={[
          {
            text: 'OK',
            color: colors.red600,
            onPress: handlers.handleSubscribeClose,
          },
        ]}
        message={modals.modalMessage}
        messageColor={colors.red600}
      />

      <CommonPopupModal
        isVisible={confirmationModalDocument}
        buttons={[
          {
            text: 'Cancel',
            color: colors.red600,
            onPress: handlers.handleCancelDocument,
          },
          {
            text: 'Confirm',
            color: colors.green600,
            onPress: handlers.handleConfirmDocument,
          },
        ]}
        message="Are you sure you want to attach a document?"
        messageColor="#4B0082"
      />

      {/* Add other modals here */}

      <MediaPreviewModal
        visible={showPreviewModal}
        media={modals.previewMedia}
        onConfirm={handlers.handleConfirmMedia}
        onCancel={handlers.handleCancelMedia}
      />
    </>
  );
};