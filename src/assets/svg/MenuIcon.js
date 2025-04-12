import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const MenuIcon = ({width = 24, height = 24,color='#000', ...props}) => (
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
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
        />
    </Svg>
)
const Memo = memo(MenuIcon)
export default Memo
