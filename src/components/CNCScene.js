import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Box } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

export function CNCScene({ depth, params }) {
  const boxRef = useRef();
  const [linePoints, setLinePoints] = useState([]);

  const generateLinePoints = () => {
    if (boxRef.current) {
      const { position, geometry } = boxRef.current;
      const offset = params.cutter_diameter;
      const halfWidth = (geometry.parameters.width / 2) + offset;
      const halfDepth = (geometry.parameters.depth / 2) + offset;
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

  useEffect(() => {
    if (boxRef.current) {
      console.log("Updating box position:", params.x_position, params.y_position);
      boxRef.current.position.x = params.x_position;
      boxRef.current.position.y = params.y_position;

      // Update the cube's position based on z_placement
      const height = boxRef.current.geometry.parameters.height;
      switch (params.z_placement) {
        case "Below":
          boxRef.current.position.y = -height / 2;
          break;
        case "Above":
          boxRef.current.position.y = height / 2;
          break;
        case "Centered":
          boxRef.current.position.y = 0;
          break;
        default:
          boxRef.current.position.y = 0;
      }

      console.log("Box new position:", boxRef.current.position.x, boxRef.current.position.y);
    } else {
      console.log("boxRef.current is null");
    }
  }, [params.x_position, params.y_position, params.z_placement]);

  return (
    <Canvas camera={{ position: [5, 5, 5], fov: 50 }} style={{ background: '#1E1E1E' }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls />
      <gridHelper args={[10, 10, '#3C3C3C', '#3C3C3C']} />

      <Box ref={boxRef} position={[2, -2, 2]} args={[3, 3, 3]}>
        <meshStandardMaterial color="#808080" /* wireframe */ />
      </Box>
      {linePoints.length > 0 && <Line points={linePoints} color="orange" />}
    </Canvas>
  );
}
