import React from 'react';
import TextComponent from '../../common/TextComponent';
import { textScale } from '../../../styles/responsiveStyles';
import { spacing } from '../../../styles/spacing';
import Colors from '../../../theme/colors';

const ContactListEmpty = ({ contactsError, isDarkMode }) => {
    return (
            <TextComponent
                text={contactsError || 'No contacts found.'}
                color={isDarkMode ? Colors.dark.black : Colors.light.white}
                size={textScale(16)}
                style={{ marginTop: spacing.MARGIN_20 }}
                textAlign={'center'}
        />
    );
};

export default ContactListEmpty;