import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const XLS = ({size=24}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width={size}
    height={size}
    viewBox="0 0 512 512"
  >
    <Path
      d="M128 0c-17.6 0-32 14.4-32 32v448c0 17.6 14.4 32 32 32h320c17.6 0 32-14.4 32-32V128L352 0H128z"
      style={{
        fill: "#e2e5e7",
      }}
    />
    <Path
      d="M384 128h96L352 0v96c0 17.6 14.4 32 32 32z"
      style={{
        fill: "#b0b7bd",
      }}
    />
    <Path
      d="m480 224-96-96h96z"
      style={{
        fill: "#cad1d8",
      }}
    />
    <Path
      d="M416 416c0 8.8-7.2 16-16 16H48c-8.8 0-16-7.2-16-16V256c0-8.8 7.2-16 16-16h352c8.8 0 16 7.2 16 16v160z"
      style={{
        fill: "#84bd5a",
      }}
    />
    <Path
      d="m144.336 326.192 22.256-27.888c6.656-8.704 19.584 2.416 12.288 10.736-7.664 9.088-15.728 18.944-23.408 29.04l26.096 32.496c7.04 9.6-7.024 18.8-13.936 9.328l-23.552-30.192-23.152 30.848c-6.528 9.328-20.992-1.152-13.696-9.856l25.712-32.624c-8.064-10.112-15.872-19.952-23.664-29.04-8.048-9.6 6.912-19.44 12.8-10.464l22.256 27.616zM197.36 303.152c0-4.224 3.584-7.808 8.064-7.808 4.096 0 7.552 3.6 7.552 7.808v64.096h34.8c12.528 0 12.8 16.752 0 16.752H205.44c-4.48 0-8.064-3.184-8.064-7.792v-73.056h-.016zM272.032 314.672c2.944-24.832 40.416-29.296 58.08-15.728 8.704 7.024-.512 18.16-8.192 12.528-9.472-6-30.96-8.816-33.648 4.464-3.456 20.992 52.192 8.976 51.296 43.008-.896 32.496-47.968 33.248-65.632 18.672-4.24-3.456-4.096-9.072-1.792-12.544 3.328-3.312 7.024-4.464 11.392-.88 10.48 7.152 37.488 12.528 39.392-5.648-1.648-18.912-54.864-7.536-50.896-43.872z"
      style={{
        fill: "#fff",
      }}
    />
    <Path
      d="M400 432H96v16h304c8.8 0 16-7.2 16-16v-16c0 8.8-7.2 16-16 16z"
      style={{
        fill: "#cad1d8",
      }}
    />
  </Svg>
)
const Memo = memo(XLS)
export default Memo
