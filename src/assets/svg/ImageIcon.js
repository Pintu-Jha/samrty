import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
import { memo } from "react"
const ImageIcon = ({width = 30, height = 30, color='#000',...props}) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      fill="url(#a)"
      d="M25.6 0H6.4A6.4 6.4 0 0 0 0 6.4v19.2A6.4 6.4 0 0 0 6.4 32h19.2a6.4 6.4 0 0 0 6.4-6.4V6.4A6.4 6.4 0 0 0 25.6 0Z"
    />
    <Path
      fill="#fff"
      d="M5.958 24.884a1.6 1.6 0 0 0 1.43 2.316h10.823a1.6 1.6 0 0 0 1.431-2.316l-5.411-10.822c-.59-1.18-2.272-1.18-2.862 0L5.958 24.884Z"
    />
    <Path
      fill="#fff"
      fillOpacity={0.6}
      d="M15.558 24.884a1.6 1.6 0 0 0 1.43 2.316h7.623a1.6 1.6 0 0 0 1.431-2.316l-3.811-7.622c-.59-1.18-2.273-1.18-2.862 0l-3.811 7.622Z"
    />
    <Path fill="#fff" d="M24 11.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z" />
    <Defs>
      <LinearGradient
        id="a"
        x1={16}
        x2={16}
        y1={0}
        y2={32}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#00E676" />
        <Stop offset={1} stopColor="#00C853" />
      </LinearGradient>
    </Defs>
  </Svg>
)
const Memo = memo(ImageIcon)
export default Memo
