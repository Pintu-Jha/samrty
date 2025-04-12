import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const DeleteIcon = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
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
      d="M10 12v5M14 12v5M4 7h16M6 10v8a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-8M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2H9V5Z"
    />
  </Svg>
)
const Memo = memo(DeleteIcon)
export default Memo
