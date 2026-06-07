import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ThreeBackground — a proper first-person 3D city road rendered with Three.js.
 * Camera looks down a receding street. Buildings line both sides. Rain falls.
 * Neon color changes with the active path.
 */
export default function ThreeBackground({ neonColor = '#a855f7', progress = 0 }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.clientWidth, el.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020408);
    scene.fog = new THREE.FogExp2(0x020408, 0.022);

    // ── Camera — low, looking down the road ──────────────────────────────────
    const camera = new THREE.PerspectiveCamera(72, el.clientWidth / el.clientHeight, 0.1, 200);
    camera.position.set(0, 2.4, 8);
    camera.lookAt(0, 1.8, -60);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x08081a, 3));
    const hemi = new THREE.HemisphereLight(0x101030, 0x000000, 1.2);
    scene.add(hemi);

    // Neon glow light above center of road
    const neonLight = new THREE.PointLight(new THREE.Color(neonColor), 8, 30);
    neonLight.position.set(0, 5, 2);
    scene.add(neonLight);
    stateRef.current.neonLight = neonLight;

    // ── Road surface ──────────────────────────────────────────────────────────
    const roadGeo = new THREE.PlaneGeometry(10, 220);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x060810, roughness: 0.95, metalness: 0.05 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.z = -102;
    scene.add(road);

    // Wet neon reflection strip down the center
    const wetGeo = new THREE.PlaneGeometry(1.8, 220);
    const wetMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(neonColor),
      roughness: 0,
      metalness: 1,
      transparent: true,
      opacity: 0.07,
    });
    const wet = new THREE.Mesh(wetGeo, wetMat);
    wet.rotation.x = -Math.PI / 2;
    wet.position.set(0, 0.01, -102);
    scene.add(wet);
    stateRef.current.wet = wet;

    // Sidewalks
    [-5.5, 5.5].forEach((x) => {
      const swGeo = new THREE.PlaneGeometry(1.4, 220);
      const swMat = new THREE.MeshStandardMaterial({ color: 0x0a0a14, roughness: 1 });
      const sw = new THREE.Mesh(swGeo, swMat);
      sw.rotation.x = -Math.PI / 2;
      sw.position.set(x, 0.02, -102);
      scene.add(sw);
    });

    // Road edge neon lines
    const edgeMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(neonColor) });
    stateRef.current.edgeMeshes = [];
    [-4.95, 4.95].forEach((x) => {
      const eGeo = new THREE.PlaneGeometry(0.06, 220);
      const e = new THREE.Mesh(eGeo, edgeMat.clone());
      e.rotation.x = -Math.PI / 2;
      e.position.set(x, 0.03, -102);
      scene.add(e);
      stateRef.current.edgeMeshes.push(e);
    });

    // Center dashes (animated)
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const dashes = [];
    for (let i = 0; i < 30; i++) {
      const dGeo = new THREE.PlaneGeometry(0.12, 3);
      const d = new THREE.Mesh(dGeo, dashMat);
      d.rotation.x = -Math.PI / 2;
      d.position.set(0, 0.04, -i * 7 + 4);
      scene.add(d);
      dashes.push(d);
    }
    stateRef.current.dashes = dashes;

    // ── Buildings ─────────────────────────────────────────────────────────────
    const accentPalette = [0xa855f7, 0x22d3ee, 0xec4899, 0xf59e0b, 0x3b82f6, 0x10b981];
    const bDefs = [
      // Left
      { x: -9,  z: -8,   w: 5, h: 22, d: 5 },
      { x: -13, z: -22,  w: 3.5, h: 34, d: 4 },
      { x: -8,  z: -38,  w: 6, h: 16, d: 5 },
      { x: -12, z: -54,  w: 4, h: 26, d: 4 },
      { x: -9,  z: -70,  w: 5, h: 38, d: 5 },
      { x: -13, z: -88,  w: 3.5, h: 20, d: 4 },
      { x: -9,  z: -104, w: 6, h: 30, d: 5 },
      // Right
      { x: 9,   z: -8,   w: 5, h: 28, d: 5 },
      { x: 13,  z: -22,  w: 3.5, h: 18, d: 4 },
      { x: 8,   z: -38,  w: 6, h: 32, d: 5 },
      { x: 12,  z: -54,  w: 4, h: 22, d: 4 },
      { x: 9,   z: -70,  w: 5, h: 30, d: 5 },
      { x: 13,  z: -88,  w: 3.5, h: 40, d: 4 },
      { x: 9,   z: -104, w: 6, h: 18, d: 5 },
    ];

    bDefs.forEach((b, i) => {
      const ac = accentPalette[i % accentPalette.length];
      const acColor = new THREE.Color(ac);

      // Main block
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x04030e,
        roughness: 0.88,
        emissive: acColor,
        emissiveIntensity: 0.05,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      scene.add(mesh);

      // Neon roof cap
      const capGeo = new THREE.BoxGeometry(b.w + 0.15, 0.2, b.d + 0.15);
      const capMat = new THREE.MeshBasicMaterial({ color: ac });
      const cap = new THREE.Mesh(capGeo, capMat);
      cap.position.set(b.x, b.h + 0.1, b.z);
      scene.add(cap);

      // Roof point light
      const bLight = new THREE.PointLight(acColor, 2.5, 12);
      bLight.position.set(b.x, b.h + 0.5, b.z);
      scene.add(bLight);

      // Windows — on the road-facing face only
      const faceZ = b.x < 0 ? b.z + b.d / 2 + 0.02 : b.z - b.d / 2 - 0.02;
      const facingRight = b.x < 0;
      const wCols = Math.max(1, Math.floor(b.w / 1.3));
      const wRows = Math.max(1, Math.floor(b.h / 2.4));
      for (let r = 0; r < wRows; r++) {
        for (let c = 0; c < wCols; c++) {
          if (Math.random() < 0.55) {
            const isNeon = Math.random() > 0.82;
            const wCol = isNeon ? ac : 0xfef5c7;
            const wGeo = new THREE.PlaneGeometry(0.55, 0.75);
            const wMat = new THREE.MeshBasicMaterial({ color: wCol, transparent: true, opacity: isNeon ? 0.9 : 0.65 });
            const win = new THREE.Mesh(wGeo, wMat);
            win.position.set(
              b.x - b.w / 2 + 0.9 + c * 1.3,
              1.4 + r * 2.4,
              faceZ,
            );
            if (!facingRight) win.rotation.y = Math.PI;
            scene.add(win);
          }
        }
      }
    });

    // ── Streetlights ──────────────────────────────────────────────────────────
    for (let i = 0; i < 12; i++) {
      const z = -i * 9 + 4;
      [-6.2, 6.2].forEach((x) => {
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

        const pGeo = new THREE.CylinderGeometry(0.07, 0.09, 7, 8);
        const pole = new THREE.Mesh(pGeo, poleMat);
        pole.position.set(x, 3.5, z);
        scene.add(pole);

        const aGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 6);
        const arm = new THREE.Mesh(aGeo, poleMat);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(x < 0 ? x + 0.9 : x - 0.9, 7.1, z);
        scene.add(arm);

        const hGeo = new THREE.SphereGeometry(0.28, 8, 8);
        const hMat = new THREE.MeshBasicMaterial({ color: 0xfef3c7 });
        const halo = new THREE.Mesh(hGeo, hMat);
        halo.position.set(x < 0 ? x + 1.8 : x - 1.8, 7.1, z);
        scene.add(halo);

        const sl = new THREE.PointLight(0xfef3c7, 1.8, 12);
        sl.position.copy(halo.position);
        scene.add(sl);
      });
    }

    // ── Rain ──────────────────────────────────────────────────────────────────
    const RAIN_COUNT = 2500;
    const rainPos = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      rainPos[i * 3]     = (Math.random() - 0.5) * 50;
      rainPos[i * 3 + 1] = Math.random() * 35;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 30;
    }
    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x99ccff, size: 0.07, transparent: true, opacity: 0.4 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);
    stateRef.current.rain = rain;
    stateRef.current.RAIN_COUNT = RAIN_COUNT;

    // ── Resize ────────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = el.clientWidth / el.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(el.clientWidth, el.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // ── Animate ───────────────────────────────────────────────────────────────
    let t = 0;
    let rafId;
    const DASH_SPAN = 30 * 7;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      t += 0.016;

      // Pulse neon
      const { neonLight: nl } = stateRef.current;
      nl.intensity = 7 + Math.sin(t * 2.2) * 2;

      // Rain
      const rp = stateRef.current.rain.geometry.attributes.position;
      for (let i = 0; i < stateRef.current.RAIN_COUNT; i++) {
        rp.array[i * 3 + 1] -= 0.6;
        if (rp.array[i * 3 + 1] < 0) rp.array[i * 3 + 1] = 35;
      }
      rp.needsUpdate = true;

      // Scroll dashes toward camera
      stateRef.current.dashes.forEach((d) => {
        d.position.z += 0.08;
        if (d.position.z > 8) d.position.z -= DASH_SPAN;
      });

      // Subtle camera sway
      camera.position.x = Math.sin(t * 0.11) * 0.3;
      camera.position.y = 2.4 + Math.sin(t * 0.17) * 0.12;
      camera.lookAt(camera.position.x * 0.1, 1.8, -60);

      renderer.render(scene, camera);
    };
    animate();

    stateRef.current.rafId = rafId;

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []); // mount once

  // Update neon color reactively without remounting
  useEffect(() => {
    const { neonLight, wet, edgeMeshes } = stateRef.current;
    if (!neonLight) return;
    const c = new THREE.Color(neonColor);
    neonLight.color.set(c);
    if (wet) wet.material.color.set(c);
    if (edgeMeshes) edgeMeshes.forEach((e) => e.material.color.set(c));
  }, [neonColor]);

  return (
    <div
      ref={mountRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}
    />
  );
}