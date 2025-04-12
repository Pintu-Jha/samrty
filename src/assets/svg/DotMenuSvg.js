import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const DotMenuSvg = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <Path
      fill={color}
      fillRule="evenodd"
      d="M12 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 1a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-3 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm3 1a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 7a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm1 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
      clipRule="evenodd"
    />
  </Svg>
)
const Memo = memo(DotMenuSvg)
export default Memo
