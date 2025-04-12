import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const CheckIcon = ({ width = 24, height = 24, color = '#000', ...props }) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="#080341"
      stroke={color}
      fillRule="evenodd"
      d="M17.03 8.78 9 16.81l-3.53-3.53 1.06-1.06L9 14.69l6.97-6.97 1.06 1.06Z"
      clipRule="evenodd"
    />
  </Svg>
)
const Memo = memo(CheckIcon)
export default Memo
