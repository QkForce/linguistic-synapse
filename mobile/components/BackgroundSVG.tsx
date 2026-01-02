import Background from "@/assets/images/bg.svg";

export function BackgroundSVG() {
  return (
    <Background
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
      }}
    />
  );
}
