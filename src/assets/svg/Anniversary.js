import * as React from "react"
import Svg, { Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
import { memo } from "react"
const Anniversary = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    stroke={color}
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={2}
    aria-labelledby="calendarEventIconTitle"
    color={color}
    viewBox="0 0 24 24"
    {...props}
  >
    <Path d="M3 5h18v16H3V5ZM21 9H3M7 5V3M17 5V3" />
    <Path d="M15 15h2v2h-2z" />
  </Svg>
)
const Memo = memo(Anniversary)
export default Memo
