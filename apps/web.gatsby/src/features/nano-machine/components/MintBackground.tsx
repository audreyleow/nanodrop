import { Backdrop } from "@mui/material";
import {
  Plane,
  shaderMaterial,
  useAspect,
  useTexture,
} from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { DepthOfField, EffectComposer } from "@react-three/postprocessing";
import * as React from "react";
import { useRef, useState } from "react";
import * as THREE from "three";

import ErrorBoundary from "../../../common/components/ErrorBoundary";
import { NanoMachine } from "../types/nanoMachine";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      layerMaterial: any;
    }
  }
}

interface MintBackgroundProps {
  nanoMachine: NanoMachine;
}

export default function MintBackground({ nanoMachine }: MintBackgroundProps) {
  const [hasError, setHasError] = useState(false);

  const shouldRenderCollectionImage =
    hasError || nanoMachine.backgroundImageUri === null;

  const backgroundImageUri = shouldRenderCollectionImage
    ? nanoMachine.collectionImageUri
    : nanoMachine.backgroundImageUri;

  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      <Backdrop
        sx={{
          zIndex: 1,
          pointerEvents: "none",
          backgroundColor: "rgba(0, 0, 0, 0.3)",
        }}
        style={{
          backdropFilter: shouldRenderCollectionImage ? "blur(1rem)" : "none",
        }}
        open
      />
      <Canvas
        orthographic
        camera={{ zoom: 5, position: [0, 0, 200], far: 300, near: 50 }}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ErrorBoundary
          onError={() => {
            setHasError(true);
          }}
        >
          <ThreeJsScene backgroundImageUri={backgroundImageUri} />
          <Effects />
        </ErrorBoundary>
      </Canvas>
    </>
  );
}

function ThreeJsScene({ backgroundImageUri }: { backgroundImageUri: string }) {
  const texture = useTexture(backgroundImageUri);
  const scale = useAspect(
    texture.source.data.width,
    texture.source.data.height,
    1.2
  );

  const group = useRef<any>();
  const layerRef = useRef();
  const [temp] = useState(() => new THREE.Vector3());
  const [movement] = useState(() => new THREE.Vector3());

  useFrame((state) => {
    if (group.current) {
      movement.lerp(temp.set(state.mouse.x, state.mouse.y * 0.2, 0), 0.2);
      group.current.position.x = THREE.MathUtils.lerp(
        group.current.position.x,
        state.mouse.x * 20,
        0.2
      );
      group.current.rotation.x = THREE.MathUtils.lerp(
        group.current.rotation.x,
        state.mouse.y / 10,
        0.2
      );
      group.current.rotation.y = THREE.MathUtils.lerp(
        group.current.rotation.y,
        -state.mouse.x / 5,
        0.2
      );
    }
  }, 1);

  return (
    <group ref={group}>
      <Plane scale={scale} args={[1, 1, 1, 1]}>
        <layerMaterial
          textr={texture}
          factor={0.005}
          ref={(el: any) => {
            layerRef.current = el;
          }}
        />
      </Plane>
    </group>
  );
}

const Effects = () => (
  <EffectComposer disableNormalPass multisampling={0}>
    <DepthOfField target={[0, 0, 0]} width={1024} blur={0.5} />
  </EffectComposer>
);

// This material takes care of wiggling and punches a hole into
// alpha regions so that the depth-of-field effect can process the layers.
// Credit: Gianmarco Simone https://twitter.com/ggsimm

const LayerMaterial = shaderMaterial(
  { textr: null, movement: [0, 0, 0], scale: 1, factor: 0, wiggle: 0, time: 0 },
  ` uniform float time;
    uniform vec2 resolution;
    uniform float wiggle;
    varying vec2 vUv;
    varying vec3 vNormal;
    void main()	{
      vUv = uv;
      vec3 transformed = vec3(position);
      if (wiggle > 0.) {
        float theta = sin(time + position.y) / 2.0 * wiggle;
        float c = cos(theta);
        float s = sin(theta);
        mat3 m = mat3(c, 0, s, 0, 1, 0, -s, 0, c);
        transformed = transformed * m;
        vNormal = vNormal * m;
      }      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.);
    }`,
  ` uniform float time;
    uniform vec2 resolution;
    uniform float factor;
    uniform float scale;
    uniform vec3 movement;
    uniform sampler2D textr;
    varying vec2 vUv;
    void main()	{
      vec2 uv = vUv / scale + movement.xy * factor;
      vec4 color = texture2D(textr, uv);
      if (color.a < 0.1) discard;
      gl_FragColor = vec4(color.rgb, .1);
      #include <tonemapping_fragment>
      #include <encodings_fragment>
    }`
);

extend({ LayerMaterial });
