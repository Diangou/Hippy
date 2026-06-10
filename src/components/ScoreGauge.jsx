import Svg, { Circle, Text as SvgText } from 'react-native-svg'

const SIZE = 140
const CX = SIZE / 2
const CY = SIZE / 2
const RADIUS = 55
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function gaugeColor(score) {
  if (score >= 75) return '#2E7D32'
  if (score >= 50) return '#E65100'
  return '#C62828'
}

export default function ScoreGauge({ score }) {
  const color = gaugeColor(score)
  const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

  return (
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {/* Track */}
      <Circle cx={CX} cy={CY} r={RADIUS} stroke="#E5E7EB" strokeWidth={12} fill="none" />
      {/* Progress */}
      <Circle
        cx={CX} cy={CY} r={RADIUS}
        stroke={color}
        strokeWidth={12}
        fill="none"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={offset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${CX}, ${CY}`}
      />
      {/* Score text */}
      <SvgText x={CX} y={CY - 6} textAnchor="middle" fontSize={30} fontWeight="bold" fill={color}>
        {score}
      </SvgText>
      <SvgText x={CX} y={CY + 16} textAnchor="middle" fontSize={13} fill="#9CA3AF">
        / 100
      </SvgText>
    </Svg>
  )
}
