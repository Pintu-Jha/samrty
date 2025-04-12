import * as React from "react"
import Svg, { G, Path } from "react-native-svg"
/* SVGR has dropped some elements not supported by react-native-svg: title */
import { memo } from "react"
const DomainIcon = ({width = 24, height = 24,color='#000', ...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 48 48"
    fill={color}
    {...props}
  >
    <G data-name="Layer 2">
      <Path fill="none" d="M0 0h48v48H0z" data-name="invisible box" />
      <Path
        d="M24 2a22 22 0 1 0 22 22A21.9 21.9 0 0 0 24 2Zm16.1 14h-4.9a27.8 27.8 0 0 0-3-8 18.5 18.5 0 0 1 7.9 8Zm1.9 8a17.5 17.5 0 0 1-.5 4h-5.7c.1-1.3.2-2.6.2-4s-.1-2.7-.2-4h5.7a17.5 17.5 0 0 1 .5 4ZM6 24a17.5 17.5 0 0 1 .5-4h5.7c-.1 1.3-.2 2.6-.2 4s.1 2.7.2 4H6.5a17.5 17.5 0 0 1-.5-4Zm10 0c0-1.4.1-2.7.2-4H22v8h-5.8c-.1-1.3-.2-2.6-.2-4ZM26 6.7a11.7 11.7 0 0 1 3 3.7 21.7 21.7 0 0 1 2.1 5.6H26Zm-4 0V16h-5.1a21.7 21.7 0 0 1 2.1-5.6 11.7 11.7 0 0 1 3-3.7ZM22 32v9.3a11.7 11.7 0 0 1-3-3.7 21.7 21.7 0 0 1-2.1-5.6Zm4 9.3V32h5.1a21.7 21.7 0 0 1-2.1 5.6 11.7 11.7 0 0 1-3 3.7ZM26 28v-8h5.8c.1 1.3.2 2.6.2 4s-.1 2.7-.2 4ZM15.8 8a27.8 27.8 0 0 0-3 8H7.9a18.5 18.5 0 0 1 7.9-8ZM7.9 32h4.9a27.8 27.8 0 0 0 3 8 18.5 18.5 0 0 1-7.9-8Zm24.3 8a27.8 27.8 0 0 0 3-8h4.9a18.5 18.5 0 0 1-7.9 8Z"
        data-name="icons Q2"
      />
    </G>
  </Svg>
)
const Memo = memo(DomainIcon)
export default Memo
