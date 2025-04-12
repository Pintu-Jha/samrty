import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Help = ({width = 24, height = 24, color='#000',...props}) => (
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
      strokeWidth={2}
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.5 8.677a2 2 0 1 1 1.995 3.261c-.268.068-.495.286-.495.562v.5M12 16h.01"
    />
  </Svg>
)
const Memo = memo(Help)
export default Memo
