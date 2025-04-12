import React from 'react';
import {View} from 'react-native';
import * as SvgIcon from '../../../assets';
import Colors from '../../../theme/colors';
import THEME_COLOR from '../../../utils/constant';
import CustomInput from '../../common/CustomInput';
import {useTheme} from '../../hooks';
import {styles} from './styles';

const GroupInfo = ({groupName, title, setCreateGroup}) => {
  const {theme} = useTheme();
  const isDark = theme === THEME_COLOR;
  return (
    <View style={styles.groupInfoContainer}>
      <CustomInput
        placeholder="Group Name"
        value={groupName}
        onChange={text =>
          setCreateGroup(prevState => ({...prevState, groupName: text}))
        }
        showFirstChildren={true}
        FirstChildren={
          <SvgIcon.GroupIcon
            color={isDark ? Colors.dark.black : Colors.light.white}
          />
        }
      />
      <CustomInput
        placeholder="Title"
        value={title}
        onChange={text =>
          setCreateGroup(prevState => ({...prevState, title: text}))
        }
        showFirstChildren={true}
        FirstChildren={
          <SvgIcon.Artical
            color={isDark ? Colors.dark.black : Colors.light.white}
          />
        }
      />
    </View>
  );
};

export default GroupInfo;

