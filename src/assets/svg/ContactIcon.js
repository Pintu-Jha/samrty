import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const ContactIcon = ({width = 24, height = 24,color='#000', ...props}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={width}
    height={height}
    viewBox="0 0 32 32"
    {...props}
  >
    <Path
      d="M27 10a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1h-1V6a3 3 0 0 0-3-3H9a3 3 0 0 0-3 3v2H4.5a.5.5 0 0 0 0 1H6v1H4.5a.5.5 0 0 0 0 1H6v10H4.5a.5.5 0 0 0 0 1H6v1H4.5a.5.5 0 0 0 0 1H6v2a3 3 0 0 0 3 3h14a3 3 0 0 0 3-3v-4h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1v-1h1zm-1-2h1v1h-1V8zm-1 18a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v20zm2-6v1h-1v-1h1zm0-4v1h-1v-1h1zm0-4v1h-1v-1h1zm-8.83 4.062a2.987 2.987 0 0 0 .768-2.676 3.01 3.01 0 0 0-2.399-2.34A3.004 3.004 0 0 0 13 14c0 .801.319 1.524.83 2.062A3.307 3.307 0 0 0 12 19.021V21a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-1.978c0-1.254-.709-2.4-1.83-2.96zM16 12c1.103 0 2 .897 2 2s-.897 2-2 2-2-.897-2-2 .897-2 2-2zm3 9h-6v-1.585c0-.986.48-1.903 1.288-2.464l.463-.231c.381.176.802.28 1.249.28s.868-.104 1.249-.28l.463.231A2.994 2.994 0 0 1 19 19.415V21z"
     fill={color}
    />
  </Svg>
)
const Memo = memo(ContactIcon)
export default Memo
