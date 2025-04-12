import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
import {memo} from 'react';
const BroadCastGroup = ({
  width = 24,
  height = 24,
  color = '#000',
  ...props
}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    className="icon icon-tabler icons-tabler-outline icon-tabler-broadcast"
    {...props}
  >
    <Path stroke="none" d="M0 0h24v24H0z" />
    <Path d="M18.364 19.364a9 9 0 1 0-12.728 0" />
    <Path d="M15.536 16.536a5 5 0 1 0-7.072 0" />
    <Path d="M11 13a1 1 0 1 0 2 0 1 1 0 1 0-2 0" />
  </Svg>
);
const Memo = memo(BroadCastGroup);
export default Memo;
