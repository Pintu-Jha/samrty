import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const DoubleCheckIcon = ({width = 20, height = 20,color='#1C274C', ...props}) => (
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
      strokeWidth={1.5}
      d="m4 12.9 3.143 3.6L15 7.5M20 7.563l-8.572 9L11 16"
    />
  </Svg>
)
const Memo = memo(DoubleCheckIcon)
export default Memo
