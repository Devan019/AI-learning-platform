import { parseLengthAndUnit, cssValue } from "../../helper/loaders/untiConverter";
import { createAnimation } from "../../helper/loaders/animation";

const right = createAnimation(
  "RingLoader",
  "0% {transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)} 100% {transform: rotateX(180deg) rotateY(360deg) rotateZ(360deg)}",
  "right"
);

const left = createAnimation(
  "RingLoader",
  "0% {transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg)} 100% {transform: rotateX(360deg) rotateY(180deg) rotateZ(360deg)}",
  "left"
);

function RingLoader({
  loading = true,
  color = "#000000",
  speedMultiplier = 1,
  cssOverride = {},
  size = 60,
  ...additionalprops
}) {
  const { value, unit } = parseLengthAndUnit(size);

  const wrapper = {
    display: "inherit",
    width: cssValue(size),
    height: cssValue(size),
    position: "relative",
    ...cssOverride,
  };

  const style = (i) => {
    return {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: `${value}${unit}`,
      height: `${value}${unit}`,
      border: `${value / 10}${unit} solid ${color}`,
      opacity: "0.5",
      borderRadius: "100%",
      animationFillMode: "forwards",
      perspective: "800px",
      animation: `${i === 1 ? right : left} ${2 / speedMultiplier}s 0s infinite linear`,
      zIndex: 999
    };
  };

  if (!loading) {
    return null;
  }

  return (
    <span style={wrapper} {...additionalprops}>
      <span style={style(1)} />
      <span style={style(2)} />
    </span>
  );
}

export default RingLoader;