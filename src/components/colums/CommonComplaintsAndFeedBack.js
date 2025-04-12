import React, {useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TextInput,
  View,
  Button,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useTheme} from '../hooks';
import THEME_COLOR from '../../utils/constant';
import colors from '../../utils/colors';
import {CommonToastMessage, goBack} from '../../utils/helperFunctions';
import {
  useCheckSeesionForSendCommentQuery,
  useFetchAllComplainsQuery,
  useSendCommentsMutation,
} from '../../api/slice/complainsSlice';
import {textScale} from '../../styles/responsiveStyles';
import {spacing} from '../../styles/spacing';
import RegularText from '../common/RegularText';
import CommoneHeader from '../common/CommoneHeader';
import * as SvgIcon from '../../assets';

const RendercommentsItem = ({item, theme}) => {
  return (
    <View
      style={[
        styles.commentItem,
        {
          backgroundColor:
            theme === THEME_COLOR ? colors.grey100 : colors.grey800,
          shadowColor: theme === THEME_COLOR ? '#000' : '#fff',
        },
      ]}>
      <RegularText
        style={[
          styles.commentContent,
          {color: theme === THEME_COLOR ? colors.black : colors.white},
        ]}>
        {item.content}
      </RegularText>
      <RegularText
        style={[
          styles.commentTimestamp,
          {color: theme === THEME_COLOR ? colors.grey700 : colors.grey400},
        ]}>
        {item.creation}
      </RegularText>
    </View>
  );
};

const CommonComplaintsAndFeedBack = ({route}) => {
  const {comments, id} = route.params;

  const {data: CheckSeesion} = useCheckSeesionForSendCommentQuery({
    hd_ticket_name: id,
  });

  const [commentsList, setCommentList] = useState(comments || []);
  const [sendComments] = useSendCommentsMutation();
  const {theme} = useTheme();
  const [commentText, setCommentText] = useState('');
  const {refetch} = useFetchAllComplainsQuery();

  const sendComment = async () => {
    if (!commentText.trim()) {
      return;
    }
    if (CheckSeesion?.data?.send_text_message === 0) {
      CommonToastMessage('info', CheckSeesion?.message);
    }

    try {
      await sendComments({
        hd_ticket_name: String(id),
        message: commentText.trim(),
      });

      setCommentList(prev => [
        ...prev,
        {
          content: commentText.trim(),
          creation: new Date().toLocaleString(),
        },
      ]);
      refetch();
      setCommentText('');
    } catch (error) {
      console.error('Error sending comment:', error);
      alert('Unable to send comment. Please try again.');
    }
  };

  return (
    <>
      <CommoneHeader
        title="Comments"
        showLeftIcon={true}
        leftIcon={SvgIcon.BackIcon}
        onLeftIconPress={() => goBack()}
        showRightIcons={true}
        rightIcons={[SvgIcon.Filter, SvgIcon.ReloadIcon]}
        onRightIconPress={() => refetch()}
      />
      <KeyboardAvoidingView
        style={{
          flex: 1,
          backgroundColor: THEME_COLOR === theme ? colors.white : colors.black,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 70}>
        <View style={styles.container}>
          {commentsList.length > 0 ? (
            <FlatList
              data={commentsList}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({item}) => (
                <RendercommentsItem item={item} theme={theme} />
              )}
              contentContainerStyle={styles.commentsList}
              inverted
            />
          ) : (
            <RegularText
              style={{
                color: THEME_COLOR === theme ? colors.black : colors.white,
                textAlign: 'center',
                fontSize: textScale(16),
                marginVertical: spacing.MARGIN_16,
              }}>
              no comments found
            </RegularText>
          )}
        </View>
        {CheckSeesion?.data?.send_text_message === 1 ? (
          <View
            style={[
              styles.footer,
              {
                backgroundColor:
                  theme === THEME_COLOR ? colors.white : colors.grey900,
              },
            ]}>
            <TextInput
              style={[
                styles.input,
                {
                  color: theme === THEME_COLOR ? colors.black : colors.white,
                  backgroundColor:
                    theme === THEME_COLOR ? colors.white : colors.grey800,
                },
              ]}
              placeholder="Add a comment"
              placeholderTextColor="#888"
              value={commentText}
              onChangeText={text => setCommentText(text)}
            />
            <Button title="Send" onPress={sendComment} color="#007BFF" />
          </View>
        ) : (
          <View
            style={[
              styles.stylesCheckSeesionTextContainer,
              {
                backgroundColor:
                  theme === THEME_COLOR ? colors.white : colors.grey900,
              },
            ]}>
            <RegularText
              style={[
                styles.CheckSeesionTextStyle,
                {color: theme === THEME_COLOR ? colors.black : colors.white},
              ]}>
              {CheckSeesion?.message}
            </RegularText>
          </View>
        )}
      </KeyboardAvoidingView>
    </>
  );
};

export default CommonComplaintsAndFeedBack;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: spacing.PADDING_54,
  },
  commentsList: {
    paddingTop: spacing.PADDING_54,
  },
  commentItem: {
    marginVertical: spacing.MARGIN_8,
    marginHorizontal: spacing.MARGIN_16,
    padding: spacing.PADDING_16,
    borderRadius: 12,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  commentContent: {
    fontSize: textScale(15),
    marginBottom: spacing.MARGIN_8,
  },
  commentTimestamp: {
    fontSize: textScale(12),
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    paddingHorizontal: spacing.PADDING_6,
    paddingVertical: spacing.PADDING_6,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  CheckSeesionTextStyle: {
    textAlign: 'center',
    fontSize: textScale(14),
  },
  stylesCheckSeesionTextContainer: {
    paddingVertical: spacing.PADDING_16,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
});
