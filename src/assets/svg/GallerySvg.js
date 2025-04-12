import * as React from "react"
import Svg, { G, Path, Circle } from "react-native-svg"
import { memo } from "react"
const GallerySvg = ({width = 24, height = 24, color='#000',...props}) => (
  <Svg
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <G stroke={color} strokeWidth={1.5}>
      <Path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
      <Circle cx={16} cy={8} r={2} />
      <Path
        strokeLinecap="round"
        d="m2 10.154.98-.141C9.96 9.01 15.925 15.03 14.858 22"
      />
      <Path
        strokeLinecap="round"
        d="m22 13.385-.973-.135c-2.844-.394-5.417 1.022-6.742 3.25"
      />
    </G>
  </Svg>
)
const Memo = memo(GallerySvg)
export default Memo
