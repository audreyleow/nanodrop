"use client";

import {
  ConvexPolyhedronProps,
  CylinderProps,
  Physics,
  PlaneProps,
  Triplet,
  useConvexPolyhedron,
  usePlane,
} from "@react-three/cannon";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import { BufferGeometry, CylinderGeometry, Mesh } from "three";
import { Geometry } from "three-stdlib/deprecated/Geometry";

const positions = Array.from({ length: 20 }, () => [
  Math.random(),
  Math.random() * 10 + 10,
  0,
]);

export default function LandingPageBackground() {
  return (
    <Canvas
      shadows
      camera={{ position: [0, 2, 7] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} />
      <Physics>
        {typeof window !== "undefined" && navigator.maxTouchPoints === 0 && (
          <Mouse />
        )}
        <Borders />
        {positions.map((position, i) => (
          <Pyramid key={i} position={position as Triplet} />
        ))}
      </Physics>
    </Canvas>
  );
}

function Borders() {
  const { viewport } = useThree();
  return (
    <>
      <Plane
        position={[0, -viewport.height / 2 + 2, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <Plane
        position={[-viewport.width / 2 - 1, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
      />
      <Plane
        position={[viewport.width / 2 + 1, 0, 0]}
        rotation={[0, -Math.PI / 2, 0]}
      />
      <Plane position={[0, 0, -2]} rotation={[0, 0, 0]} />
      <Plane position={[0, 0, 3]} rotation={[0, -Math.PI, 0]} />
    </>
  );
}

function Plane(props: PlaneProps) {
  usePlane(() => ({ ...props }));
  return null;
}

function Pyramid(props: CylinderProps) {
  const pyramidGeometryArgs = [0, 1, 1.5, 4, 1];
  const pyramidGeometry = new CylinderGeometry(...pyramidGeometryArgs);
  const args = toConvexProps(pyramidGeometry);
  const [ref] = useConvexPolyhedron(
    () => ({ args, mass: 0.5, position: props.position }),
    useRef<Mesh>(null)
  );

  return (
    <mesh
      castShadow
      {...{ geometry: pyramidGeometry, position: props.position, ref }}
    >
      <cylinderGeometry args={[0, 1, 1, 4, 1]} />
      <meshStandardMaterial />
    </mesh>
  );
}

function toConvexProps(
  bufferGeometry: BufferGeometry
): ConvexPolyhedronProps["args"] {
  const geo = new Geometry().fromBufferGeometry(bufferGeometry);
  // Merge duplicate vertices resulting from glTF export.
  // Cannon assumes contiguous, closed meshes to work
  geo.mergeVertices();
  return [
    geo.vertices.map((v) => [v.x, v.y, v.z]),
    geo.faces.map((f) => [f.a, f.b, f.c]),
    [],
  ];
}

function Mouse() {
  const { viewport } = useThree();
  const pyramidGeometryArgs = [0, 1, 2, 4, 1];
  const pyramidGeometry = new CylinderGeometry(...pyramidGeometryArgs);
  const args = toConvexProps(pyramidGeometry);
  const [ref, api] = useConvexPolyhedron(
    () => ({ args, mass: 1, position: [0, 0, 0], type: "Kinematic" }),
    useRef<Mesh>(null)
  );

  useFrame((state) =>
    api.position.set(
      (state.mouse.x * viewport.width) / 2,
      -viewport.height / 2 + 2,
      -((state.mouse.y * viewport.height) / 2)
    )
  );

  return (
    <mesh castShadow {...{ geometry: pyramidGeometry, ref }}>
      <cylinderGeometry args={[0, 1, 1, 4, 1]} />
      <meshStandardMaterial color="#ef5350" />
    </mesh>
  );
}
