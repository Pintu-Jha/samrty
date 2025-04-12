import React from 'react';
import { textScale } from '../../../styles/responsiveStyles';
import { spacing } from '../../../styles/spacing';
import Colors from '../../../theme/colors';
import TextComponent from '../../common/TextComponent';


const GroupListEmpty = ({ isErrorGetBroadCast, isDarkMode }) => {
    return (
        <TextComponent
            text={isErrorGetBroadCast || 'No Broadcast Groups Available'}
            color={isDarkMode ? Colors.dark.black : Colors.light.white}
            size={textScale(16)}
            style={{ marginTop: spacing.MARGIN_20 }}
            textAlign={'center'}
        />
    );
};

export default GroupListEmpty;