import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import * as SvgIcon from '../../../assets';
import { spacing } from '../../../styles/spacing';
import colors from '../../../utils/colors';
import { styles } from './styles';

const ContactListHeader = ({ isDarkMode, resetSearch, contactRef, searchText, handleSearch }) => {
    return (
        <View style={[styles.searchHeader, { backgroundColor: isDarkMode ? colors.white : colors.black }]}>
            <TouchableOpacity
                onPress={() => {
                    resetSearch();
                    contactRef.current?.dismiss();
                }}
                style={styles.backButton}
            >
                <SvgIcon.BackIcon
                    width={spacing.WIDTH_24}
                    height={spacing.WIDTH_24}
                    color={isDarkMode ? colors.grey800 : colors.white}
                />
            </TouchableOpacity>
            <TextInput
                placeholder="Search contacts by Name or Number"
                placeholderTextColor={colors.grey800}
                value={searchText}
                onChangeText={handleSearch}
                style={styles.searchInput}
            />
        </View>
    );
};

export default ContactListHeader;