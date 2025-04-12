import * as React from "react"
import Svg, { Path } from "react-native-svg"
import { memo } from "react"
const XLSX = ({size=24}) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    viewBox="0 0 512 512"
    width={size}
    height={size}
  >
    <Path
      d="M455.736 0v444.484l-56.263 22.505L421.978 0z"
      style={{
        fill: "#a0f6fa",
      }}
    />
    <Path
      d="M56.264 0v512H388.22l33.758-56.264V0z"
      style={{
        fill: "#d0fbfd",
      }}
    />
    <Path
      d="M388.22 67.516v61.891l-56.264 22.505 22.506-84.396z"
      style={{
        fill: "#ffcd60",
      }}
    />
    <Path
      d="M354.462 67.516v61.891l-81.583 22.505-81.582-22.505 22.505-61.891zM388.22 129.407v61.89l-56.264 22.505 22.506-84.395z"
      style={{
        fill: "#ffdb8a",
      }}
    />
    <Path
      d="M354.462 129.407v61.89l-81.583 22.505-81.582-22.505 22.505-61.89z"
      style={{
        fill: "#ffeab5",
      }}
    />
    <Path
      d="M455.736 444.484 388.22 512v-67.516h33.758z"
      style={{
        fill: "#50d1dd",
      }}
    />
    <Path
      d="M388.22 191.297v61.89l-56.264 22.505 22.506-84.395z"
      style={{
        fill: "#ffcd60",
      }}
    />
    <Path
      d="M354.462 191.297v61.89l-81.583 22.505-81.582-22.505 22.505-61.89zM388.22 315.077v-61.89h-33.758l-22.506 84.395z"
      style={{
        fill: "#ffdb8a",
      }}
    />
    <Path
      d="M354.462 315.077v-61.89h-140.66l-22.505 61.89 81.582 22.505z"
      style={{
        fill: "#ffeab5",
      }}
    />
    <Path
      d="M213.802 315.077h140.659v61.89H213.802z"
      style={{
        fill: "#ffdb8a",
      }}
    />
    <Path
      d="M354.462 315.077h33.758v61.89h-33.758z"
      style={{
        fill: "#ffcd60",
      }}
    />
    <Path
      d="M213.802 67.516v61.891l-45.011 22.505-45.011-22.505V67.516z"
      style={{
        fill: "#ff9269",
      }}
    />
    <Path
      d="M213.802 129.407v61.89l-45.011 22.505-45.011-22.505v-61.89z"
      style={{
        fill: "#ffb082",
      }}
    />
    <Path
      d="M213.802 191.297v61.89l-45.011 22.505-45.011-22.505v-61.89z"
      style={{
        fill: "#ff9269",
      }}
    />
    <Path
      d="M213.802 253.187v61.89l-45.011 22.505-45.011-22.505v-61.89z"
      style={{
        fill: "#ffb082",
      }}
    />
    <Path
      d="M123.78 315.077h90.022v61.89H123.78z"
      style={{
        fill: "#ff9269",
      }}
    />
    <Path
      d="M303.824 419.165H132.22a8.44 8.44 0 0 1 0-16.88h171.604a8.44 8.44 0 0 1 8.44 8.44 8.44 8.44 0 0 1-8.44 8.44zM213.802 452.923H132.22a8.44 8.44 0 0 1 0-16.88h81.582a8.44 8.44 0 0 1 0 16.88z"
      style={{
        fill: "#25bbcc",
      }}
    />
  </Svg>
)
const Memo = memo(XLSX)
export default Memo
