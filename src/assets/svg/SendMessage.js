import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const SendMessage = ({width = 24, height = 24,color='#000', ...props}) => (
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
      d="M22 2 2 8.667l9.583 3.75M22 2l-6.667 20-3.75-9.583M22 2 11.583 12.417"
    />
  </Svg>
)
const Memo = memo(SendMessage)
export default Memo
