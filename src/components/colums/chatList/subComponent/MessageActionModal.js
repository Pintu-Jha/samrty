import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AnimatedModal from '../../../common/AnimatedModal';

const MessageActionModal = ({ isVisible, onClose, message, onReply, onDelete }) => {
    return (
        <AnimatedModal isVisible={isVisible} close={onClose}>
            <View style={styles.modalContent}>
                {message ? (
                    <>
                        <Text style={styles.messageText}>Actions for: {message.message}</Text>
                        <Button title="Reply" onPress={() => { onReply(message); onClose(); }} />
                        <Button title="Delete" onPress={() => { onDelete(message); onClose(); }} />
                    </>
                ) : (
                    <Text style={styles.messageText}>No message selected.</Text>
                )}
                <Button title="Cancel" onPress={onClose} />
            </View>
        </AnimatedModal>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        padding: 20,
        alignItems: 'center',
    },
    messageText: {
        marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default MessageActionModal;