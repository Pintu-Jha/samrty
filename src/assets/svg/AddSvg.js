import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const AddICon = ({width = 24, height = 24,color='#000', ...props}) => (
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
      d="M8 12h4m0 0h4m-4 0v4m0-4V8m0 13a9 9 0 1 1 0-18 9 9 0 0 1 0 18Z"
    />
  </Svg>
)
const Memo = memo(AddICon)
export default Memo
