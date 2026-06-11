import Svg, { Circle, Text as SvgText } from 'react-native-svg'

const SIZE = 180
const CX = SIZE / 2
const CY = SIZE / 2
const RADIUS = 68
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const STROKE = 10

function gaugeColor(score) {
  if (score >= 75) return '#00C853'
  if (score >= 50) return '#FF8F00'
  return '#F50057'
}

export default function ScoreGauge({ score }) {
  const color = gaugeColor(score)
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Circle cx={CX} cy={CY} r={RADIUS} stroke="#F0F4F1" strokeWidth={STROKE} fill="none" />
      <Circle
        cx={CX} cy={CY} r={RADIUS}
        stroke={color}
        strokeWidth={STROKE}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${CX}, ${CY}`}
      />
      <SvgText x={CX} y={CY + 4} textAnchor="middle" fontSize={48} fontWeight="900" fill={color}>
        {score}
      </SvgText>
      <SvgText x={CX} y={CY + 24} textAnchor="middle" fontSize={11} fontWeight="700" fill="#BBCCC0" letterSpacing={3}>
        / 100
      </SvgText>
    </Svg>
  )
}
