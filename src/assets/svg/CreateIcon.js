import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const CreateIcon = ({width = 24, height = 24, color='#000',...props}    ) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill={color}
    {...props}
  >
    <Path fill="none" d="M0 0h24v24H0z" />
    <Path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5h2z" />
    <Path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4" />
  </Svg>
)
const Memo = memo(CreateIcon)
export default Memo
