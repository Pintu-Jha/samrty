import { StyleSheet, Text, View } from "react-native";
import { spacing } from "../../../../styles/spacing";
import PropTypes from 'prop-types';
import Colors from "../../../../theme/colors";

export const ReplyMessage = ({ replyData, isDarkMode, isIncoming }) => {

  const getBackgroundColor = () => {
    if (!isDarkMode) {
      return isIncoming ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.3)';
    }
    return isIncoming ? 'rgba(0, 0, 0, 0.05)' : 'rgba(0, 0, 0, 0.08)';
  };

  const getBorderColor = () => {
    if (isDarkMode) {
      return isIncoming ? Colors.dark.lightGrey : Colors.default.blue;
    }
    return isIncoming ? Colors.default.grey : Colors.default.blue;
  };

  const containerStyle = [
    styles.replyContainer,
    {
      backgroundColor: getBackgroundColor(),
      borderLeftColor: getBorderColor(),
    }
  ];

  const labelStyle = [
    styles.replyLabel,
    {
      color: isDarkMode ? Colors.dark.grey : Colors.default.blue
    }
  ];

  const contentStyle = [
    styles.replyContent,
    {
      color: !isDarkMode ? 'rgba(233, 237, 239, 0.9)' : 'rgba(17, 27, 33, 0.9)'
    }
  ];

  return (
    <View style={containerStyle}>
      <View style={styles.replyWrapper}>
        <Text style={labelStyle}>
          {isIncoming ? 'Replying to message' : 'You replied to'}
        </Text>
        <Text 
          style={contentStyle}
          numberOfLines={3}
          ellipsizeMode="tail"
        >
          {replyData.message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  replyContainer: {
    marginBottom: spacing.MARGIN_4,
    padding: spacing.PADDING_8,
    borderRadius: spacing.RADIUS_8,
    borderLeftWidth: 4,
  },
  replyLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: spacing.MARGIN_2,
    fontWeight: '500',
  },
  replyContent: {
    fontSize: 14,
    lineHeight: 18,
    numberOfLines: 2,
    ellipsizeMode: 'tail',
  },
  replyWrapper: {
    flexDirection: 'column',
    width: '100%',
  }
});

ReplyMessage.propTypes = {
  replyData: PropTypes.shape({
    message: PropTypes.string,
    message_id: PropTypes.string,
  }),
  isDarkMode: PropTypes.bool.isRequired,
  isIncoming: PropTypes.bool.isRequired,
};