import { Canvas } from "@react-three/fiber";
import { Line, OrbitControls, Box, Grid, useGLTF, useHelper, GizmoHelper, GizmoViewcube } from "@react-three/drei";
import { useRef, useEffect, useState, forwardRef } from "react";
import * as THREE from "three"; // Import THREE

const LegoModel = forwardRef((props, ref) => {
  const { scene } = useGLTF('/lego.glb');
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ color: '#F57C00', roughness: 0.3, metalness: 0.1 });
    }
  });

  return <primitive object={scene} ref={ref} />;
});

const SceneContent = ({ params }) => {
  const legoRef = useRef();
  const boxRef = useRef();
  const [linePoints, setLinePoints] = useState([]);

  useHelper(legoRef, THREE.BoxHelper, 'yellow');

  const generateLinePoints = (ref) => {
    if (ref.current) {
      const box = new THREE.Box3().setFromObject(ref.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      const center = new THREE.Vector3();
      box.getCenter(center);

      const offset = params.cutter_diameter;
      const halfWidth = (size.x / 2) + offset;
      const halfDepth = (size.z / 2) + offset;
      const yMax = params.operation_depth_max * -1;

      return [
        [0, 0, 0],
        [-halfWidth, params.operation_depth_start, -halfDepth],
        [-halfWidth, 0, -halfDepth],
        [-halfWidth, yMax, -halfDepth],
        [halfWidth, yMax, -halfDepth],
        [halfWidth, yMax, halfDepth],
        [-halfWidth, yMax, halfDepth],
        [-halfWidth, yMax, -halfDepth]
      ];
    }
    return [];
  };

  useEffect(() => {
    const newLinePoints = generateLinePoints(legoRef); // Pass the desired ref here
    setLinePoints(newLinePoints);
  }, [params]);

  useEffect(() => {
    if (legoRef.current) {
      const box = new THREE.Box3().setFromObject(legoRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);

      switch (params.y_up_position) {
        case "Below":
          legoRef.current.position.y = -size.y / 2;
          break;
        case "Above":
          legoRef.current.position.y = size.y / 2;
          break;
        case "Centered":
          legoRef.current.position.y = 0;
          break;
        default:
          legoRef.current.position.y = 0;
      }
    }
  }, [params.y_up_position]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <OrbitControls makeDefault />
      <Grid args={[10, 10]} cellSize={1} cellThickness={1} sectionSize={1} sectionThickness={1} sectionColor="gray" fadeDistance={40} infiniteGrid material-side={THREE.DoubleSide} />
      <primitive object={new THREE.AxesHelper(5)} />
      <LegoModel ref={legoRef} position={[4, 2, 4]} />
      {linePoints.length > 0 && <Line points={linePoints} color="orange" />}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
    </>
  );
};

export function CNCScene({ depth, params }) {
  return (
    <Canvas camera={{ position: [7, 5, 7], fov: 50 }} style={{ background: '#1E1E1E' }}>
      <SceneContent params={params} />
    </Canvas>
  );
}
