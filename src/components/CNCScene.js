import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Box } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

export function CNCScene({ depth, params }) {
  const boxRef = useRef();
  const [linePoints, setLinePoints] = useState([]);

  const generateLinePoints = () => {
    if (boxRef.current) {
      const { position, scale } = boxRef.current;
      const offset = params.cutter_diameter;
      const halfWidth = (scale.x / 2) + offset;
      const halfDepth = (scale.z / 2) + offset;
      const yMax = params.operation_depth_max * -1;

      return [
        [0,0,0],
        [position.x - halfWidth, params.operation_depth_start, position.z - halfDepth],
        [position.x - halfWidth, 0, position.z - halfDepth],
        [position.x - halfWidth, yMax, position.z - halfDepth],
        [position.x + halfWidth, yMax, position.z - halfDepth],
        [position.x + halfWidth, yMax, position.z + halfDepth],
        [position.x - halfWidth, yMax, position.z + halfDepth],
        [position.x - halfWidth, yMax, position.z - halfDepth]
      ];
    }
    return [];
  };

  useEffect(() => {
    const newLinePoints = generateLinePoints();
    setLinePoints(newLinePoints);
  }, [params]);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: '#1E1E1E' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />
      <gridHelper args={[10, 10, '#3C3C3C', '#3C3C3C']} />

      <Box ref={boxRef} position={[2, -2, 2]} args={[3, 3, 3]}>
        <meshStandardMaterial color="#808080" wireframe />
      </Box>
      {linePoints.length > 0 && <Line points={linePoints} color="orange" />}
    </Canvas>
  );
}
