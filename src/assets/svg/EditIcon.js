import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const EditIcon = ({width = 24, height = 24,color='#000', ...props}) => (
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
      strokeWidth={1.5}
      d="m14.444 5.687-8.998 8.999c-.659.659-1.179 1.458-1.337 2.376-.16.927-.213 2.077.335 2.625.549.549 1.699.496 2.626.336.918-.158 1.717-.678 2.376-1.337l8.998-8.999m-4-4s3-3 5-1-1 5-1 5m-4-4 4 4"
    />
  </Svg>
)
const Memo = memo(EditIcon)
export default Memo
