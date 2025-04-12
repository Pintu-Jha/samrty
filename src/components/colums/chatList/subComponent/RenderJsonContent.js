import {StyleSheet, View} from 'react-native';
import Colors from '../../../../theme/colors';
import colors from '../../../../utils/colors';
import THEME_COLOR from '../../../../utils/constant';
import {openLink, openPhoneDialer} from '../../../../utils/helperFunctions';
import TextComponent from '../../../common/TextComponent';
import {useTheme} from '../../../hooks';

const JsonKeyValue = ({jsonKey, value, isDarkMode}) => (
  <View style={styles.keyValueContainer}>
    {jsonKey && (
      <TextComponent
        text={`${jsonKey.replace(/_/g, ' ').toUpperCase()}:`}
        style={[
          styles.keyTextStyle,
          {color: isDarkMode ? colors.black : colors.white},
        ]}
      />
    )}
    <TextComponent
      text={String(value)}
      style={[
        styles.valueTextStyle,
        {color: isDarkMode ? colors.black : colors.white},
      ]}
    />
  </View>
);

const JsonArray = ({jsonKey, value, isDarkMode}) => (
  <View style={styles.arrayContainer}>
    {jsonKey && (
      <TextComponent
        text={`${jsonKey.replace(/_/g, ' ').toUpperCase()}:`}
        style={[
          styles.keyTextStyle,
          {color: isDarkMode ? colors.black : colors.white},
        ]}
      />
    )}
    {value.map((item, index) => (
      <View key={index} style={styles.arrayItemContainer}>
        <TextComponent
          text={`${index + 1}.`}
          style={[
            styles.listNumber,
            {color: isDarkMode ? colors.black : colors.white},
          ]}
        />
        <View style={styles.nestedContainer}>
          {renderNestedKeyValuePairs('', item, isDarkMode)}
        </View>
      </View>
    ))}
  </View>
);

const renderNestedKeyValuePairs = (key, value, isDarkMode) => {
  if (typeof value === 'object' && value !== null) {
    if (Array.isArray(value)) {
      return <JsonArray jsonKey={key} value={value} isDarkMode={isDarkMode} />;
    } else {
      return (
        <View style={styles.nestedContainer}>
          {key && (
            <TextComponent
              text={`${key.replace(/_/g, ' ').toUpperCase()}:`}
              style={[
                styles.keyTextStyle,
                {color: isDarkMode ? colors.black : colors.white},
              ]}
            />
          )}
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <View key={nestedKey}>
              {renderNestedKeyValuePairs(nestedKey, nestedValue, isDarkMode)}
            </View>
          ))}
        </View>
      );
    }
  } else {
    return <JsonKeyValue jsonKey={key} value={value} isDarkMode={isDarkMode} />;
  }
};

const renderJsonContent = (jsonString, isDarkMode) => {
  try {
    const parsedContent = JSON.parse(jsonString);

    return (
      <View style={styles.jsonContentContainer}>
        <TextComponent
          text="Flow Response Details"
          style={[
            styles.headerText,
            {color: isDarkMode ? colors.black : colors.white},
          ]}
        />
        {Object.entries(parsedContent).map(([key, value]) => (
          <View key={key} style={styles.jsonSection}>
            {renderNestedKeyValuePairs(key, value, isDarkMode)}
          </View>
        ))}
      </View>
    );
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return (
      <TextComponent text="Error parsing JSON data" style={styles.errorText} />
    );
  }
};

const parseMessage = text => {
  const phoneRegex = /\b(?:\+91|91)?\d{10}\b/g; // Matches phone numbers
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)/gi; // Matches URLs

  const combinedRegex = new RegExp(
    `${phoneRegex.source}|${urlRegex.source}`,
    'gi',
  );
  const parts = [];
  let lastIndex = 0;
  let match;

  // Iterate through all matches
  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      // Add plain text before the matched part
      parts.push({
        text: text.substring(lastIndex, match.index),
        type: 'text',
      });
    }

    const matchedText = match[0];

    // Determine type: 'phone' or 'url'
    const type = phoneRegex.test(matchedText) ? 'phone' : 'url';

    // Add matched part
    parts.push({
      text: matchedText,
      type: type,
    });

    lastIndex = match.index + matchedText.length;

    // Reset regex lastIndex for consistent matching
    phoneRegex.lastIndex = 0;
    urlRegex.lastIndex = 0;
  }

  // Add any remaining plain text after the last match
  if (lastIndex < text.length) {
    parts.push({
      text: text.substring(lastIndex),
      type: 'text',
    });
  }

  return parts;
};

const RenderMessageContent = message => {
  const {theme} = useTheme();
  const isDarkMode = theme === THEME_COLOR;
  if (typeof message?.message === 'string') {
    const trimmedMessage = message?.message.trim();

    // Render JSON content if message starts with '{'
    if (trimmedMessage.startsWith('{')) {
      return renderJsonContent(trimmedMessage, isDarkMode);
    }

    // Parse and render regular message with links and phone numbers
    const messageParts = parseMessage(trimmedMessage);

    return (
      <View style={styles.messageContainer}>
        {messageParts.map((part, index) => {
          if (part.type === 'text') {
            return (
              <TextComponent
                key={index}
                text={part.text}
                style={[styles.textStyle]}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
              />
            );
          } else if (part.type === 'phone') {
            return (
              <TextComponent
                key={index}
                text={part.text}
                style={styles.phoneLink}
                onPress={() => openPhoneDialer(part.text)}
              />
            );
          } else if (part.type === 'url') {
            const url = part.text.startsWith('http')
              ? part.text
              : `http://${part.text}`;
            return (
              <TextComponent
                key={index}
                text={part.text}
                style={styles.urlLink}
                onPress={() => openLink(url)}
              />
            );
          }
        })}
      </View>
    );
  }

  return (
    <TextComponent
      text={String(message)}
      style={[
        styles.textStyle,
        {color: isDarkMode ? colors.black : colors.white},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  jsonContentContainer: {
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jsonSection: {
    marginBottom: 12,
  },
  keyValueContainer: {
    marginBottom: 8,
  },
  keyTextStyle: {
    fontSize: 14,
    fontWeight: '600',
  },
  valueTextStyle: {
    fontSize: 14,
    marginLeft: 10,
  },
  arrayContainer: {
    marginBottom: 12,
  },
  arrayItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  listNumber: {
    marginRight: 8,
    fontWeight: 'bold',
  },
  nestedContainer: {
    marginLeft: 16,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
  },
  textStyle: {
    fontSize: 14,
    marginBottom: 4,
  },
  phoneLink: {
    fontSize: 14,
    color: colors.linkBlue,
    textDecorationLine: 'underline',
  },
  urlLink: {
    fontSize: 14,
    color: colors.linkBlue,
    textDecorationLine: 'underline',
  },
  errorText: {
    color: colors.error,
  },
});

export default RenderMessageContent;
