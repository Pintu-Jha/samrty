import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import {textScale} from '../../../../styles/responsiveStyles';
import {spacing} from '../../../../styles/spacing';
import colors from '../../../../theme/colors';
import URLFileHandler from '../../../../utils/urlFileHandler';
import TextComponent from '../../../common/TextComponent';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const MAX_IMAGE_WIDTH = SCREEN_WIDTH * 0.7; // 70% of screen width

const AttachmentMessage = ({item, isIncoming, isDarkMode, selectedDomain}) => {
  // const renderImageAttachment = () => (
  //   <TouchableOpacity
  //     activeOpacity={0.8}
  //     onPress={() => {
  //       if (!selectionMode) {
  //         // Handle image tap if needed
  //       }
  //     }}
  //     style={styles.imageContainer}>
  //     {isIncoming && (
  //       <TextComponent
  //         text={`Sent by: ${item?.sent_by}`}
  //         color={isDarkMode ? colors.dark.black : colors.light.white}
  //         font={fontNames.ROBOTO_FONT_FAMILY_BOLD}
  //         size={textScale(12)}
  //         style={styles.imageSenderText}
  //       />
  //     )}
  //     <ImageZoomViewer
  //       baseUrl={selectedDomain}
  //       message={item?.attach}
  //       thumbnailStyle={styles.imageMessage}
  //       resizeMode="cover"
  //     />
  //   </TouchableOpacity>
  // );

  // const renderVideoAttachment = () => {
  //   const getFilePath = url => {
  //     if (url?.startsWith('https')) {
  //       const startIndex = url.indexOf('/files');
  //       return startIndex !== -1 ? url.slice(startIndex) : url;
  //     }
  //     return url;
  //   };

  //   return (
  //     <CommonVideoPlayer
  //       source={{uri: `${selectedDomain}${getFilePath(item?.attach)}`}}
  //       backgroundColor="#444" // or any color you want for the placeholder
  //     />
  //   );
  // };

  const renderAttachmentContent = () => {
    if (item.attach?.startsWith('/files/')) {
      return (
        <URLFileHandler
          url={`${selectedDomain}${item?.attach}`}
          isIncoming={isIncoming}
        />
      );
    }

    // if (isImageAttachment(item?.attach)) {
    //   return renderImageAttachment();
    // }

    // if (isVideoAttachment(item.attach)) {
    //   return renderVideoAttachment();
    // }

    return (
      <TextComponent
        text={'Unsupported attachment type.'}
        color={isDarkMode ? colors.dark.black : colors.light.white}
        size={textScale(14)}
      />
    );
  };

  return (
    <View
      style={[
        styles.container,
        isIncoming ? styles.incomingContainer : styles.outgoingContainer,
      ]}>
      {renderAttachmentContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: MAX_IMAGE_WIDTH,
    borderRadius: spacing.RADIUS_8,
    marginVertical: spacing.MARGIN_4,
  },
  incomingContainer: {
    alignSelf: 'flex-start',
  },
  outgoingContainer: {
    alignSelf: 'flex-end',
  },
  pdfButton: {
    backgroundColor: colors.default.grey,
    paddingVertical: spacing.PADDING_12,
    paddingHorizontal: spacing.PADDING_20,
    borderRadius: spacing.RADIUS_12,
  },
  imageContainer: {
    width: '100%',
  },
  imageSenderText: {
    flexWrap: 'wrap',
    paddingLeft: spacing.PADDING_4,
    marginBottom: spacing.MARGIN_4,
  },
  imageMessage: {
    width: '100%',
    height: undefined,
    aspectRatio: 3 / 4,
    borderRadius: spacing.RADIUS_8,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: spacing.RADIUS_8,
  },
});

export default AttachmentMessage;
