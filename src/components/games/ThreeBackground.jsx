import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground — renders a live Three.js scene as the game board backdrop.
 * Features: a perspective road with lane markings, neon city buildings on both
 * sides, animated rain particles, and a dynamic sky/horizon glow — all driven
 * by the active lane colour.
 */
export default function ThreeBackground({ neonColor = '#a855f7', progress = 0 }) {
  const mountRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.shadowMap.enabled = true;
    el.appendChild(renderer.domElement);

    // ── Scene + Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000510, 0.018);

    const camera = new THREE.PerspectiveCamera(60, el.clientWidth / el.clientHeight, 0.1, 300);
    camera.position.set(0, 3.2, 10);
    camera.lookAt(0, 1.5, -30);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x111133, 1.2));
    const hemi = new THREE.HemisphereLight(0x0a0a2a, 0x000000, 0.8);
    scene.add(hemi);

    const neon = new THREE.Color(neonColor);

    // Neon point light floating above road center
    const neonLight = new THREE.PointLight(neon, 6, 40);
    neonLight.position.set(0, 6, -5);
    scene.add(neonLight);

    // ── Road ──────────────────────────────────────────────────────────────────
    const roadGeo = new THREE.PlaneGeometry(12, 300);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x080614,
      roughness: 0.92,
      metalness: 0.1,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -140);
    road.receiveShadow = true;
    scene.add(road);

    // Wet reflection plane
    const reflGeo = new THREE.PlaneGeometry(12, 300);
    const reflMat = new THREE.MeshStandardMaterial({
      color: neon,
      roughness: 0.0,
      metalness: 1.0,
      transparent: true,
      opacity: 0.06,
    });
    const refl = new THREE.Mesh(reflGeo, reflMat);
    refl.rotation.x = -Math.PI / 2;
    refl.position.set(0, 0.01, -140);
    scene.add(refl);

    // Lane markings (dashed center lines)
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    for (let i = 0; i < 40; i++) {
      const dashGeo = new THREE.PlaneGeometry(0.15, 2.5);
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(-0.4, 0.02, -i * 7);
      scene.add(dash);
      const dash2 = dash.clone();
      dash2.position.set(0.4, 0.02, -i * 7);
      scene.add(dash2);
    }

    // Road edge neon strips
    const edgeMat = new THREE.MeshBasicMaterial({ color: neon });
    [-6.1, 6.1].forEach((x) => {
      const edgeGeo = new THREE.PlaneGeometry(0.12, 300);
      const edge = new THREE.Mesh(edgeGeo, edgeMat);
      edge.rotation.x = -Math.PI / 2;
      edge.position.set(x, 0.02, -140);
      scene.add(edge);
    });

    // ── Buildings ─────────────────────────────────────────────────────────────
    const buildingColors = [0xa855f7, 0x22d3ee, 0xec4899, 0xf59e0b, 0x3b82f6];
    const buildingDefs = [
      // Left side
      { x: -10, z: -10, w: 4, h: 18, d: 4 },
      { x: -14, z: -25, w: 3, h: 28, d: 3 },
      { x: -9,  z: -40, w: 5, h: 14, d: 5 },
      { x: -13, z: -55, w: 3, h: 22, d: 3 },
      { x: -10, z: -70, w: 4, h: 30, d: 4 },
      { x: -14, z: -85, w: 3, h: 16, d: 3 },
      // Right side
      { x: 10,  z: -10, w: 4, h: 20, d: 4 },
      { x: 14,  z: -25, w: 3, h: 14, d: 3 },
      { x: 9,   z: -40, w: 5, h: 26, d: 5 },
      { x: 13,  z: -55, w: 3, h: 18, d: 3 },
      { x: 10,  z: -70, w: 4, h: 24, d: 4 },
      { x: 14,  z: -85, w: 3, h: 32, d: 3 },
    ];

    buildingDefs.forEach((b, i) => {
      const accentColor = buildingColors[i % buildingColors.length];
      const accent = new THREE.Color(accentColor);

      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x050310,
        roughness: 0.9,
        emissive: accent,
        emissiveIntensity: 0.04,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      scene.add(mesh);

      // Neon top edge glow
      const topGeo = new THREE.BoxGeometry(b.w + 0.1, 0.15, b.d + 0.1);
      const topMat = new THREE.MeshBasicMaterial({ color: accentColor });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.set(b.x, b.h + 0.07, b.z);
      scene.add(top);

      // Window grid
      const wCols = Math.floor(b.w / 1.2);
      const wRows = Math.floor(b.h / 2.2);
      for (let r = 0; r < wRows; r++) {
        for (let c = 0; c < wCols; c++) {
          if (Math.random() > 0.45) {
            const lit = Math.random() > 0.85 ? accentColor : 0xfffacc;
            const wGeo = new THREE.PlaneGeometry(0.5, 0.7);
            const wMat = new THREE.MeshBasicMaterial({ color: lit, transparent: true, opacity: 0.7 });
            const win = new THREE.Mesh(wGeo, wMat);
            // Place on the road-facing side
            const faceZ = b.x < 0 ? b.z + b.d / 2 + 0.01 : b.z - b.d / 2 - 0.01;
            const faceRot = b.x < 0 ? 0 : Math.PI;
            win.position.set(
              b.x - b.w / 2 + 0.8 + c * 1.2,
              1.5 + r * 2.2,
              faceZ
            );
            win.rotation.y = faceRot;
            scene.add(win);
          }
        }
      }
    });

    // ── Streetlights ──────────────────────────────────────────────────────────
    for (let i = 0; i < 10; i++) {
      const z = -i * 14;
      [-7.5, 7.5].forEach((x) => {
        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 7, 6);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x334455 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(x, 3.5, z);
        scene.add(pole);

        // Arm
        const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 6);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(x < 0 ? x + 0.75 : x - 0.75, 7, z);
        scene.add(arm);

        // Light halo
        const haloGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const haloMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.set(x < 0 ? x + 1.5 : x - 1.5, 7, z);
        scene.add(halo);

        const light = new THREE.PointLight(0xfef08a, 1.5, 14);
        light.position.copy(halo.position);
        scene.add(light);
      });
    }

    // ── Rain Particles ────────────────────────────────────────────────────────
    const rainCount = 1800;
    const rainPositions = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPositions[i * 3]     = (Math.random() - 0.5) * 60;
      rainPositions[i * 3 + 1] = Math.random() * 40;
      rainPositions[i * 3 + 2] = (Math.random() - 0.5) * 120 - 30;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0xaaccff, size: 0.08, transparent: true, opacity: 0.45 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    // ── Skybox / Background ───────────────────────────────────────────────────
    scene.background = new THREE.Color(0x010208);

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate ───────────────────────────────────────────────────────────────
    let t = 0;
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      t += 0.016;

      // Pulse neon light
      neonLight.intensity = 5 + Math.sin(t * 1.8) * 1.5;
      neonLight.color.set(neonColor);

      // Rain falling
      const pos = rain.geometry.attributes.position;
      for (let i = 0; i < rainCount; i++) {
        pos.array[i * 3 + 1] -= 0.55;
        if (pos.array[i * 3 + 1] < 0) pos.array[i * 3 + 1] = 40;
      }
      pos.needsUpdate = true;

      // Subtle camera drift
      camera.position.x = Math.sin(t * 0.12) * 0.4;
      camera.position.y = 3.2 + Math.sin(t * 0.18) * 0.15;

      // Road scroll illusion (move lane dashes toward camera)
      scene.children.forEach((child) => {
        if (child.geometry instanceof THREE.PlaneGeometry &&
            child.material instanceof THREE.MeshBasicMaterial &&
            child.material.color.getHex() === 0xfbbf24) {
          child.position.z += 0.06;
          if (child.position.z > 12) child.position.z -= 280;
        }
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [neonColor]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}