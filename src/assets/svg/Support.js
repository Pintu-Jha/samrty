import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Support = ({width = 24, height = 24, color='#000',...props}) => (
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
      d="M6.723 5.48a5.251 5.251 0 1 1 8.265 4.802"
    />
    <Path
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M7.44 3.353a8.71 8.71 0 0 0 6.26 2.65 8.706 8.706 0 0 0 3.347-.666M10.823 9.753a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM4.823 7.175v1.078a3 3 0 0 0 3 3h1.423M21.7 23.253a9.74 9.74 0 0 0-5.23-8.634M2.2 23.253a9.741 9.741 0 0 1 5.225-8.632"
    />
  </Svg>
)
const Memo = memo(Support)
export default Memo
