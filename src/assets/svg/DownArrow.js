import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const DownArrow = ({ width = 24, height = 24,color='#000', ...props }) => (
    <Svg
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
            strokeWidth={1.5}
            d="m7 10 5 5 5-5"
        />
    </Svg>
)
const Memo = memo(DownArrow)
export default Memo
