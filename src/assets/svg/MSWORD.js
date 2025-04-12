import * as React from 'react';
import Svg, {Path} from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: title */
import {memo} from 'react';
const MSWORD = ({size = 24}) => (
  <Svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
    <Path d="M28.5 11.25c-2.902.294-5.125 2.765-5.125 5.75v94c0 3.184 2.535 5.75 5.719 5.75h69.812c3.184 0 5.719-2.566 5.719-5.75V40.375H83.594c-4.306 0-8.063-3.141-8.063-7.313V11.25H29.094c-.2 0-.4-.02-.594 0zm51.031 0v21.813c0 1.714 1.632 3.312 4.063 3.312h21.031L79.531 11.25zM35.72 60.375H50.75V61.5h-.719c-1.057 0-1.878.24-2.437.719-.56.479-.844 1.04-.844 1.718 0 .699.434 2.298 1.313 4.813l8 22.781 6.75-19.344-1.22-3.437-.937-2.719a14.722 14.722 0 0 0-1.406-2.625c-.26-.379-.59-.709-.969-.968a5.414 5.414 0 0 0-1.5-.782c-.379-.12-.963-.156-1.781-.156v-1.125h15.781V61.5H69.72c-1.118 0-1.95.24-2.469.719-.519.479-.75 1.119-.75 1.937 0 1.018.446 2.778 1.344 5.313l7.781 22.062 7.719-22.344c.878-2.474 1.312-4.198 1.312-5.156 0-.459-.138-.882-.437-1.281a2.27 2.27 0 0 0-1.094-.844c-.758-.28-1.751-.406-2.969-.406v-1.125h12.125V61.5c-1.058 0-1.904.183-2.562.563-.659.379-1.277 1.087-1.875 2.124-.4.699-1.048 2.366-1.906 5l-11.313 32.72h-1.188l-9.25-25.97L55 101.907h-1.094l-12.062-33.72c-.898-2.514-1.448-4.01-1.688-4.468a3.794 3.794 0 0 0-1.656-1.657c-.679-.379-1.604-.562-2.781-.562v-1.125z" />
  </Svg>
);
const Memo = memo(MSWORD);
export default Memo;
