"use client";

/* eslint-disable react/no-unknown-property */
import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

interface LanyardProps {
  position?: [number, number, number];
  fov?: number;
}

export function LanyardComponent({
  position = [0, 0, 16],
  fov = 28,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 1024);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize, { passive: true });

    // Pause rendering when scrolled out of view for 0% CPU overhead
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  if (isMobile) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 will-change-transform"
    >
      <Canvas
        camera={{ position: position, fov: fov }}
        dpr={[1, 2]} // Crisp retina display rendering
        frameloop={isVisible ? "always" : "never"}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        className="w-full h-full bg-transparent pointer-events-auto"
      >
        <ambientLight intensity={1.6} />
        <directionalLight position={[10, 14, 10]} intensity={2.5} />
        <directionalLight position={[-10, -6, -6]} intensity={0.9} />

        <Suspense fallback={null}>
          <PhysicsLanyardScene isMobile={isMobile} isVisible={isVisible} />
        </Suspense>
      </Canvas>
    </div>
  );
}

function PhysicsLanyardScene({ isMobile, isVisible }: { isMobile: boolean; isVisible: boolean }) {
  const { camera, raycaster, pointer } = useThree();
  const cardGroup = useRef<THREE.Group>(null);
  const ribbonMesh = useRef<THREE.Mesh>(null);

  const anchorX = isMobile ? 0 : 2.9;
  const anchorY = 4.8;

  // HD sharp textures
  const frontTexture = useTexture("/assets/lanyard/card-front-hd.png");
  const bandTexture = useTexture("/assets/lanyard/lanyard-band.png");

  useMemo(() => {
    if (frontTexture) {
      frontTexture.colorSpace = THREE.SRGBColorSpace;
      frontTexture.anisotropy = 16;
      frontTexture.generateMipmaps = false;
      frontTexture.minFilter = THREE.LinearFilter;
      frontTexture.magFilter = THREE.LinearFilter;
      frontTexture.needsUpdate = true;
    }
    if (bandTexture) {
      bandTexture.wrapS = THREE.RepeatWrapping;
      bandTexture.wrapT = THREE.RepeatWrapping;
      bandTexture.repeat.set(3, 1);
      bandTexture.colorSpace = THREE.SRGBColorSpace;
      bandTexture.anisotropy = 16;
      bandTexture.needsUpdate = true;
    }
  }, [frontTexture, bandTexture]);

  const backMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: "#FFFFFF",
      roughness: 0.3,
      metalness: 0.05,
    });
  }, []);

  // --- Verlet Physics Simulation State ---
  const numParticles = 6;
  const segmentLength = 0.52;
  const particles = useRef(
    Array.from({ length: numParticles }, (_, i) => ({
      pos: new THREE.Vector3(anchorX, anchorY - i * segmentLength, 0),
      oldPos: new THREE.Vector3(anchorX, anchorY - i * segmentLength, 0),
    }))
  );

  const [dragged, setDragged] = useState(false);
  const [hovered, setHovered] = useState(false);

  const dragPlane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const dragIntersect = useMemo(() => new THREE.Vector3(), []);
  const cardRotation = useRef(new THREE.Euler(0, 0, 0));
  const cardAngularVelocity = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    document.body.style.cursor = hovered ? (dragged ? "grabbing" : "grab") : "auto";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged]);

  useEffect(() => {
    const handlePointerUp = () => setDragged(false);
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("pointercancel", handlePointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  // Update anchor position when mobile breakpoint changes
  useEffect(() => {
    const pts = particles.current;
    pts[0].pos.set(anchorX, anchorY, 0);
    pts[0].oldPos.set(anchorX, anchorY, 0);
  }, [anchorX, anchorY]);

  // Pre-allocated static curve array
  const curvePoints = useMemo(
    () =>
      Array.from({ length: numParticles }, (_, i) =>
        new THREE.Vector3(anchorX, anchorY - i * segmentLength, 0)
      ),
    [anchorX, anchorY, numParticles, segmentLength]
  );
  const curve = useMemo(() => new THREE.CatmullRomCurve3(curvePoints), [curvePoints]);

  useFrame((_, delta) => {
    if (!isVisible) return; // Skip physics computation when scrolled away

    // Clamp delta time to avoid sudden physics explosions/jitter on frame drops
    const dt = Math.min(delta, 0.024);
    const pts = particles.current;
    const gravity = new THREE.Vector3(0, -34, 0);

    // 1. Verlet Physics Step with natural air damping
    for (let i = 1; i < numParticles; i++) {
      if (i === numParticles - 1 && dragged) {
        raycaster.setFromCamera(pointer, camera);
        if (raycaster.ray.intersectPlane(dragPlane, dragIntersect)) {
          pts[i].oldPos.copy(pts[i].pos);
          pts[i].pos.lerp(dragIntersect, 0.42);
        }
      } else {
        // Air resistance damping (0.94 decay ensures natural, graceful settling)
        const vel = new THREE.Vector3().subVectors(pts[i].pos, pts[i].oldPos).multiplyScalar(0.94);
        pts[i].oldPos.copy(pts[i].pos);

        // Continuous gravity downwards
        pts[i].pos.add(vel).addScaledVector(gravity, dt * dt);

        // Spring centering force that always pulls the ribbon back to hanging straight
        const centeringForceX = (anchorX - pts[i].pos.x) * 12.0;
        pts[i].pos.x += centeringForceX * dt * dt;
      }
    }

    // 2. Fixed Anchor Point at the top ceiling
    pts[0].pos.set(anchorX, anchorY, 0);
    pts[0].oldPos.copy(pts[0].pos);

    // 3. Relax Distance Constraints (10 iterations keeps cord taut and unbreakable)
    for (let iter = 0; iter < 10; iter++) {
      for (let i = 0; i < numParticles - 1; i++) {
        const p1 = pts[i];
        const p2 = pts[i + 1];
        const deltaVec = new THREE.Vector3().subVectors(p2.pos, p1.pos);
        const dist = deltaVec.length();
        if (dist === 0) continue;
        const diff = (dist - segmentLength) / dist;

        if (i === 0) {
          p2.pos.sub(deltaVec.multiplyScalar(diff));
        } else if (i + 1 === numParticles - 1 && dragged) {
          p1.pos.add(deltaVec.multiplyScalar(diff));
        } else {
          p1.pos.add(deltaVec.clone().multiplyScalar(0.5 * diff));
          p2.pos.sub(deltaVec.clone().multiplyScalar(0.5 * diff));
        }
      }
    }

    // 4. Update Ribbon Curve Points smoothly
    for (let i = 0; i < numParticles; i++) {
      curvePoints[i].copy(pts[i].pos);
    }
    if (ribbonMesh.current) {
      ribbonMesh.current.geometry.dispose();
      ribbonMesh.current.geometry = new THREE.TubeGeometry(curve, 24, 0.042, 6, false);
    }

    // 5. Update Card Transform & Pendulum Rotation with smooth natural damping
    if (cardGroup.current) {
      const ringAttachPoint = pts[numParticles - 1].pos;
      const prevParticle = pts[numParticles - 2].pos;

      cardGroup.current.position.copy(ringAttachPoint);

      const tangent = new THREE.Vector3().subVectors(ringAttachPoint, prevParticle).normalize();
      const targetRoll = -tangent.x * 0.85;
      const targetPitch = tangent.z * 0.85;

      const diffRoll = targetRoll - cardRotation.current.z;
      const diffPitch = targetPitch - cardRotation.current.x;

      cardAngularVelocity.current.z += diffRoll * 12 * dt;
      cardAngularVelocity.current.x += diffPitch * 12 * dt;
      cardAngularVelocity.current.multiplyScalar(0.90); // Smooth angular damping

      cardRotation.current.z += cardAngularVelocity.current.z * dt;
      cardRotation.current.x += cardAngularVelocity.current.x * dt;
      cardRotation.current.y *= 0.94;

      cardGroup.current.rotation.set(
        cardRotation.current.x,
        cardRotation.current.y,
        cardRotation.current.z
      );
    }
  });

  return (
    <>
      {/* 3D Ribbon / Lanyard Band */}
      <mesh ref={ribbonMesh} raycast={() => null}>
        <tubeGeometry
          args={[
            new THREE.LineCurve3(
              new THREE.Vector3(anchorX, anchorY, 0),
              new THREE.Vector3(anchorX, anchorY - (numParticles - 1) * segmentLength, 0)
            ),
            24,
            0.042,
            6,
            false,
          ]}
        />
        <meshStandardMaterial
          map={bandTexture}
          color="#FAFAF9"
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>

      {/* 3D Card & Hardware Group */}
      <group
        ref={cardGroup}
        position={[anchorX, anchorY - (numParticles - 1) * segmentLength, 0]}
      >
        {/* SINGLE UNIFIED HITBOX: Only this mesh receives pointer events, eliminating all raycast jitter */}
        <mesh
          position={[0, -2.05, 0.03]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHovered(false);
          }}
          onPointerDown={(e) => {
            e.stopPropagation();
            setDragged(true);
          }}
        >
          <planeGeometry args={[2.2, 3.1]} />
          <meshBasicMaterial visible={false} />
        </mesh>

        {/* Decorative Hardware (Raycast disabled so cursor never jitters) */}
        {/* Metal Ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
          <torusGeometry args={[0.2, 0.035, 12, 24]} />
          <meshStandardMaterial color="#E4E4E7" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* Metal Clip Body */}
        <mesh position={[0, -0.22, 0]} raycast={() => null}>
          <cylinderGeometry args={[0.1, 0.12, 0.32, 12]} />
          <meshStandardMaterial color="#A1A1AA" metalness={0.85} roughness={0.25} />
        </mesh>

        {/* Top Punch Hole Clamp */}
        <mesh position={[0, -0.42, 0]} raycast={() => null}>
          <boxGeometry args={[0.5, 0.15, 0.08]} />
          <meshStandardMaterial color="#71717A" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Card Body */}
        <group position={[0, -2.05, 0]}>
          {/* Front Face Plate (Ultra Crisp HD Texture) */}
          <mesh position={[0, 0, 0.02]} raycast={() => null}>
            <planeGeometry args={[2.2, 3.1]} />
            <meshStandardMaterial
              map={frontTexture}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>

          {/* Back Face Plate */}
          <mesh position={[0, 0, -0.02]} rotation={[0, Math.PI, 0]} material={backMaterial} raycast={() => null}>
            <planeGeometry args={[2.2, 3.1]} />
          </mesh>

          {/* Card Core Solid Edge */}
          <mesh position={[0, 0, 0]} raycast={() => null}>
            <boxGeometry args={[2.22, 3.12, 0.036]} />
            <meshStandardMaterial color="#E4E4E7" roughness={0.3} metalness={0.1} />
          </mesh>

          {/* Glossy Acrylic Coating */}
          <mesh position={[0, 0, 0.024]} raycast={() => null}>
            <planeGeometry args={[2.2, 3.1]} />
            <meshPhysicalMaterial
              transparent
              opacity={0.08}
              roughness={0.05}
              metalness={0.05}
              clearcoat={1.0}
              clearcoatRoughness={0.05}
            />
          </mesh>
        </group>
      </group>
    </>
  );
}

useTexture.preload("/assets/lanyard/card-front-hd.png");
useTexture.preload("/assets/lanyard/lanyard-band.png");

export default LanyardComponent;
