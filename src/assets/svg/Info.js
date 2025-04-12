import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Info = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="-0.5 0 25 25"
    {...props}
  >
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 21.5A9.25 9.25 0 1 0 12 3a9.25 9.25 0 0 0 0 18.5Z"
    />
    <Path
      fill={color}
      d="M12.93 8.15a.92.92 0 0 1-.93.9.9.9 0 1 1 .93-.9Zm-1.64 8.38v-5.38a.7.7 0 0 1 .71-.72.689.689 0 0 1 .69.72v5.38a.701.701 0 0 1-1.4 0Z"
    />
  </Svg>
)
const Memo = memo(Info)
export default Memo
