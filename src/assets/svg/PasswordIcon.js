import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const PasswordIcon = ({width = 24, height = 24,color="#000", ...props}) => (
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
      strokeWidth={1.5}
      d="M12 10v4m-1.732-3 3.464 2m0-2-3.465 2M6.732 10v4M5 11l3.464 2m0-2L5 13M17.268 10v4m-1.732-3L19 13m0-2-3.465 2M22 12c0 3.771 0 5.657-1.172 6.828C19.657 20 17.771 20 14 20h-4c-3.771 0-5.657 0-6.828-1.172C2 17.657 2 15.771 2 12c0-3.771 0-5.657 1.172-6.828C4.343 4 6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172.654.653.943 1.528 1.07 2.828"
    />
  </Svg>
)
const Memo = memo(PasswordIcon)
export default Memo
