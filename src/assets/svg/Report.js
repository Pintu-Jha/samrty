import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Report = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 16 16"
    {...props}
  >
    <Path
     fill={color}
      fillRule="evenodd"
      d="M1.5 1h13l.5.5v10l-.5.5H7.707l-2.853 2.854L4 14.5V12H1.5l-.5-.5v-10l.5-.5zm6 10H14V2H2v9h2.5l.5.5v1.793l2.146-2.147L7.5 11zm0-8h1v5h-1V3zm0 7h1V9h-1v1z"
      clipRule="evenodd"
    />
  </Svg>
)
const Memo = memo(Report)
export default Memo
