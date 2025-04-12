import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const EmailIcon = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m4 7 6.94 4.338a2 2 0 0 0 2.12 0L20 7M5 18h14a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z"
    />
  </Svg>
)
const Memo = memo(EmailIcon)
export default Memo
