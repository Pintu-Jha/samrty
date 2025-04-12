import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Feedback = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    stroke={color}
    {...props}
  >
    <Path
      fill="#0F0F0F"
      d="M16 1a3 3 0 0 1 3 3 1 1 0 1 1-2 0 1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 1 1 2 0v1a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3h12Z"
    />
    <Path
      fill="#0F0F0F"
      fillRule="evenodd"
      d="M20.8 8.2c-.3-.299-.787-.299-1.087 0l-7.796 7.798a1 1 0 0 0-.28.542l-.164.987.987-.164a1 1 0 0 0 .542-.28L20.8 9.288c.3-.3.3-.786 0-1.086Zm-2.5-1.413a2.768 2.768 0 0 1 3.913 3.914l-7.796 7.797a3 3 0 0 1-1.629.837l-.986.165A2 2 0 0 1 9.5 17.198l.164-.986a3 3 0 0 1 .838-1.629L18.3 6.787Z"
      clipRule="evenodd"
    />
    <Path
      fill="#0F0F0F"
      d="M5 7a1 1 0 0 1 1-1h8a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM5 11a1 1 0 0 1 1-1h4a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1ZM5 15a1 1 0 0 1 1-1h1a1 1 0 1 1 0 2H6a1 1 0 0 1-1-1Z"
    />
  </Svg>
)
const Memo = memo(Feedback)
export default Memo
