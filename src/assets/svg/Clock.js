import * as React from 'react';
import Svg, {Circle, Path} from 'react-native-svg';
import Colors from '../../theme/colors';
const Clock = props => {
  const {style, color = Colors.default.primaryColor, size = 24} = props;
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      {...props}>
      <Path
        stroke={color}
        strokeLinecap="round"
        strokeWidth={2}
        d="M12 8v4l3 3"
      />
      <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={2} />
    </Svg>
  );
};

export default Clock;
