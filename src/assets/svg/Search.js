import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const Search = ({ width = 24, height = 24,color='#000', ...props }) => (
    <Svg
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
        fill="none"
        viewBox="0 0 28 24"
        {...props}
    >
        <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.796 15.811 21 21m-3-10.5a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
        />
    </Svg>
)
const Memo = memo(Search)
export default Memo
