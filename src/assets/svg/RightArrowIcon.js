import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
const RightArrowIcon = ({
  width = 24,
  height = 24,
  color = '#000',
  ...props
}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 30 30"
    fill={color}
    {...props}>
    <Path d="M5.536 21.886a1.004 1.004 0 0 0 1.033-.064l13-9a1 1 0 0 0 0-1.644l-13-9A1 1 0 0 0 5 3v18a1 1 0 0 0 .536.886z" />
  </Svg>
);
const Memo = memo(RightArrowIcon);
export default Memo;
