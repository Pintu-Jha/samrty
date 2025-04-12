import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Projects = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill="none"
      stroke={color}
      strokeWidth={2}
      d="M9 15v8H1v-8h8Zm14 0v8h-8v-8h8ZM9 1v8H1V1h8Zm14 0v8h-8V1h8Z"
    />
  </Svg>
)
const Memo = memo(Projects)
export default Memo
