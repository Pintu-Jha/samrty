import PropTypes from 'prop-types';
import React, {memo, useCallback} from 'react';
import {ActivityIndicator, FlatList, StyleSheet, View} from 'react-native';
import {spacing} from '../../../styles/spacing';
import colors from '../../../utils/colors';
import LoadingScreen from '../../common/Loader';
import MessageListItem from '../chatList/MessageListColum';

const MessageListContent = ({
  data = [],
  loading = false,
  loadingMore = false,
  selectedMessages,
  setSelectedMessages,
  // onMessageSelect,
  onSwipeToReply,
  onLoadMore,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  contentContainerStyle,
  ListFooterComponent,
  ListHeaderComponent,
  selectedDomain,
  setSelectedMessageForAction,
}) => {
  const handleSelectMessage = item => {
    const isAlreadySelected = selectedMessages.some(
      msg => msg.message_id === item.message_id,
    );
    let updatedMessages;
    if (isAlreadySelected) {
      updatedMessages = selectedMessages.filter(
        msg => msg.message_id !== item.message_id,
      );
    } else {
      updatedMessages = [
        ...selectedMessages,
        {
          message_id: item.message_id,
          message: item.message,
          name: item.name,
        },
      ];
    }

    setSelectedMessages(updatedMessages);
  };

  const handleMessageAction = item => {
    setSelectedMessageForAction(item);
  };

  const renderItem = useCallback(
    ({item, index}) => {
      const nextItem = index < data.length - 1 ? data[index + 1] : null;
      return (
        <View>
          <MessageListItem
            item={item}
            nextItem={nextItem}
            selectedMessages={selectedMessages}
            handleSelectMessage={() => handleSelectMessage(item)}
            // onSelect={onMessageSelect}
            onSwipeToReply={onSwipeToReply}
            selectionMode={selectedMessages.length > 0}
            selectedDomain={selectedDomain}
            onLongPress={() => handleMessageAction(item)}
          />
        </View>
      );
    },
    [data, selectedMessages, handleSelectMessage, onSwipeToReply],
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <FlatList
        data={data}
        keyExtractor={item => item?.message_id.toString()}
        inverted
        renderItem={renderItem}
        onEndReached={onLoadMore}
        onEndReachedThreshold={onEndReachedThreshold}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={
          <>
            {loadingMore && (
              <ActivityIndicator color={colors.green500} size="large" />
            )}
          </>
        }
        contentContainerStyle={[styles.listContent, contentContainerStyle]}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
      />
    </>
  );
};

MessageListContent.propTypes = {
  data: PropTypes.array,
  loading: PropTypes.bool,
  loadingMore: PropTypes.bool,
  selectedMessages: PropTypes.array,
  // onMessageSelect: PropTypes.func.isRequired,
  onSwipeToReply: PropTypes.func.isRequired,
  onLoadMore: PropTypes.func.isRequired,
  ListHeaderComponent: PropTypes.node,
  ListEmptyComponent: PropTypes.node,
  ListFooterComponent: PropTypes.node,
  contentContainerStyle: PropTypes.object,
};

export default memo(MessageListContent);

const styles = StyleSheet.create({
  separator: {
    height: spacing.HEIGHT_2,
  },
  listContent: {
    flexGrow: 1,
    paddingBottom: spacing.PADDING_16,
  },
});
