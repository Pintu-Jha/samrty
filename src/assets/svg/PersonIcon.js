import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const PersonIcon = ({width = 24, height = 24,color='#000', ...props}) => (
  <Svg
    width={width}
    height={height}
    viewBox="0 0 32 32"
    fill={color}
    {...props}
  >
    <Path d="M16 15.503A5.041 5.041 0 1 0 16 5.42a5.041 5.041 0 0 0 0 10.083zm0 2.215c-6.703 0-11 3.699-11 5.5v3.363h22v-3.363c0-2.178-4.068-5.5-11-5.5z" />
  </Svg>
)
const Memo = memo(PersonIcon)
export default Memo
