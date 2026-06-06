import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const LANE_COLORS_HEX = [0xa855f7, 0xec4899, 0xf59e0b];
const LANE_COLORS_CSS = ['#a855f7', '#ec4899', '#f59e0b'];

// Hop animation state
const HOP_MS = 500;
function useStepAnimation(target, resetKey) {
  const [displayed, setDisplayed] = React.useState(target);
  const [hopping, setHopping] = React.useState(false);
  const keyRef = React.useRef(resetKey);
  React.useEffect(() => {
    if (keyRef.current !== resetKey) { keyRef.current = resetKey; setDisplayed(target); setHopping(false); }
  }, [resetKey, target]);
  React.useEffect(() => {
    if (displayed === target) { setHopping(false); return; }
    setHopping(true);
    const s = setTimeout(() => setHopping(false), HOP_MS * 0.7);
    const t = setTimeout(() => setDisplayed(p => p + (target > p ? 1 : -1)), HOP_MS);
    return () => { clearTimeout(s); clearTimeout(t); };
  }, [displayed, target]);
  return { displayed, hopping };
}

export function RoadView({ activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles }) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const pawnRef = useRef(null);
  const pawnGlowRef = useRef(null);
  const tilesGroupRef = useRef(null);
  const frameRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());
  const [ready, setReady] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const pathIdx = focusedPathIndex !== null && focusedPathIndex !== undefined
    ? focusedPathIndex : (currentPlayer?.pathIndex ?? 0);
  const tilesOnPath = activePathTiles[pathIdx] ?? [];
  const totalTiles = tilesOnPath.length || 1;
  const { displayed: displayPos, hopping } = useStepAnimation(
    currentPlayer?.position ?? 0,
    `${currentPlayer?.id}-${pathIdx}`
  );
  const laneColorHex = LANE_COLORS_HEX[pathIdx] ?? LANE_COLORS_HEX[0];
  const laneColorCSS = LANE_COLORS_CSS[pathIdx] ?? LANE_COLORS_CSS[0];

  // ── BUILD SCENE ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    el.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010208);
    scene.fog = new THREE.FogExp2(0x010208, 0.022);
    sceneRef.current = scene;

    // Camera — low, looking straight down the road toward horizon
    const camera = new THREE.PerspectiveCamera(65, W / H, 0.1, 200);
    camera.position.set(0, 2.8, 7);
    camera.lookAt(0, 0.5, -30);
    cameraRef.current = camera;

    // ── LIGHTING ──
    // Ambient (very dark — night scene)
    scene.add(new THREE.AmbientLight(0x111133, 0.8));

    // Moon-ish directional light from above-behind
    const moonLight = new THREE.DirectionalLight(0x8899ff, 0.4);
    moonLight.position.set(0, 20, 10);
    scene.add(moonLight);

    // Neon point lights along the road
    const neonColors = [laneColorHex, 0xec4899, 0x22d3ee, 0xf59e0b];
    for (let i = 0; i < 6; i++) {
      const pl = new THREE.PointLight(neonColors[i % neonColors.length], 1.8, 12);
      pl.position.set(i % 2 === 0 ? -3 : 3, 2.5, -i * 5 - 2);
      scene.add(pl);
    }

    // Key light on pawn position
    const pawnLight = new THREE.PointLight(laneColorHex, 3, 8);
    pawnLight.position.set(0, 3, 6);
    scene.add(pawnLight);

    // ── ROAD ──
    const roadGeo = new THREE.PlaneGeometry(8, 200);
    const roadMat = new THREE.MeshStandardMaterial({
      color: 0x0a0618,
      roughness: 0.15,
      metalness: 0.6,
    });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, -93);
    road.receiveShadow = true;
    scene.add(road);

    // Road wet reflection plane (slightly above road)
    const reflGeo = new THREE.PlaneGeometry(8, 200);
    const reflMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(laneColorHex).multiplyScalar(0.12),
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.35,
    });
    const refl = new THREE.Mesh(reflGeo, reflMat);
    refl.rotation.x = -Math.PI / 2;
    refl.position.set(0, 0.01, -93);
    scene.add(refl);

    // Center lane dashes
    for (let i = 0; i < 40; i++) {
      const dashGeo = new THREE.PlaneGeometry(0.06, 1.8);
      const dashMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
      const dash = new THREE.Mesh(dashGeo, dashMat);
      dash.rotation.x = -Math.PI / 2;
      dash.position.set(-0.12, 0.02, -i * 4.5 + 6);
      scene.add(dash);
      const dash2 = dash.clone();
      dash2.position.x = 0.12;
      scene.add(dash2);
    }

    // ── SIDEWALKS ──
    const sidewalkMat = new THREE.MeshStandardMaterial({ color: 0x1a1428, roughness: 0.9 });
    const swL = new THREE.Mesh(new THREE.BoxGeometry(4, 0.15, 200), sidewalkMat);
    swL.position.set(-6, -0.07, -93);
    scene.add(swL);
    const swR = swL.clone();
    swR.position.x = 6;
    scene.add(swR);

    // ── BUILDINGS ──
    const buildingConfigs = [
      // Left side
      { x: -7,  z: -5,  w: 2.5, h: 12, d: 3,   color: 0x0d0d1e, accent: laneColorHex },
      { x: -9,  z: -12, w: 3,   h: 18, d: 4,   color: 0x0a0a18, accent: 0xec4899, tall: true },
      { x: -7,  z: -20, w: 2,   h: 9,  d: 3,   color: 0x0e0e20, accent: null },
      { x: -9,  z: -28, w: 4,   h: 22, d: 5,   color: 0x090912, accent: 0x22d3ee, tall: true },
      { x: -7,  z: -38, w: 2.5, h: 14, d: 3,   color: 0x0d0d1e, accent: 0xf59e0b },
      { x: -9,  z: -48, w: 3,   h: 20, d: 4,   color: 0x0a0a18, accent: laneColorHex, tall: true },
      // Right side
      { x:  7,  z: -5,  w: 2.5, h: 10, d: 3,   color: 0x0d0d1e, accent: 0xf59e0b },
      { x:  9,  z: -12, w: 3,   h: 16, d: 4,   color: 0x0a0a18, accent: 0xa855f7, tall: true },
      { x:  7,  z: -20, w: 2,   h: 8,  d: 3,   color: 0x0e0e20, accent: null },
      { x:  9,  z: -28, w: 4,   h: 24, d: 5,   color: 0x090912, accent: 0xec4899, tall: true },
      { x:  7,  z: -38, w: 2.5, h: 13, d: 3,   color: 0x0d0d1e, accent: 0x22d3ee },
      { x:  9,  z: -48, w: 3,   h: 19, d: 4,   color: 0x0a0a18, accent: laneColorHex, tall: true },
    ];
    buildingConfigs.forEach(b => {
      const geo = new THREE.BoxGeometry(b.w, b.h, b.d);
      const mat = new THREE.MeshStandardMaterial({ color: b.color, roughness: 0.95 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(b.x, b.h / 2, b.z);
      mesh.castShadow = true;
      scene.add(mesh);
      // Neon accent outline on top
      if (b.accent) {
        const edgesGeo = new THREE.EdgesGeometry(geo);
        const edgesMat = new THREE.LineBasicMaterial({ color: b.accent, linewidth: 1 });
        const edges = new THREE.LineSegments(edgesGeo, edgesMat);
        edges.position.copy(mesh.position);
        scene.add(edges);
        // Accent point light near building top
        const bl = new THREE.PointLight(b.accent, b.tall ? 2 : 1, 10);
        bl.position.set(b.x, b.h - 1, b.z);
        scene.add(bl);
      }
      // Window lights — rows of tiny emissive planes
      const winCols = 3, winRows = Math.floor(b.h / 1.8);
      for (let row = 0; row < winRows; row++) {
        for (let col = 0; col < winCols; col++) {
          if (Math.random() < 0.35) continue;
          const on = Math.random() > 0.3;
          const wMat = new THREE.MeshBasicMaterial({
            color: on ? (Math.random() > 0.85 ? b.accent || 0xfbbf24 : 0xfff5cc) : 0x111111,
          });
          const wGeo = new THREE.PlaneGeometry(0.22, 0.28);
          const w = new THREE.Mesh(wGeo, wMat);
          const side = b.x < 0 ? 1 : -1;
          w.position.set(
            b.x + side * (b.w / 2 + 0.01),
            1.2 + row * 1.6,
            b.z - b.d / 2 + 0.5 + col * (b.d - 1) / (winCols - 1)
          );
          w.rotation.y = b.x < 0 ? Math.PI / 2 : -Math.PI / 2;
          scene.add(w);
        }
      }
    });

    // ── STREETLIGHTS ──
    for (let i = 0; i < 8; i++) {
      const z = -i * 7 - 2;
      [-4.2, 4.2].forEach((xPos, side) => {
        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.05, 0.07, 4.5, 6);
        const poleMat = new THREE.MeshStandardMaterial({ color: 0x333344, metalness: 0.8 });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.set(xPos, 2.25, z);
        scene.add(pole);
        // Arm
        const armGeo = new THREE.CylinderGeometry(0.03, 0.03, 1.2, 4);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.rotation.z = side === 0 ? Math.PI / 2 : -Math.PI / 2;
        arm.position.set(xPos + (side === 0 ? 0.6 : -0.6), 4.4, z);
        scene.add(arm);
        // Light bulb
        const bulbGeo = new THREE.SphereGeometry(0.18, 8, 8);
        const bulbMat = new THREE.MeshBasicMaterial({ color: 0xfff5cc });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.set(xPos + (side === 0 ? 1.2 : -1.2), 4.4, z);
        scene.add(bulb);
        // Actual light
        const sl = new THREE.PointLight(0xfff0cc, 1.2, 9);
        sl.position.copy(bulb.position);
        sl.position.y -= 0.3;
        scene.add(sl);
      });
    }

    // ── BILLBOARD FRAMES ──
    const billboardData = [
      { x: -5.5, y: 5, z: -6,  rot: 0.35,  text: 'INVEST\nIN\nYOURSELF', color: laneColorHex },
      { x:  5.5, y: 5, z: -6,  rot: -0.35, text: 'OPPORTUNITY\nIS\nEVERYWHERE', color: 0x22d3ee },
      { x: -5.5, y: 4, z: -18, rot: 0.25,  text: 'NO RISK\nNO REWARD', color: 0xf59e0b },
      { x:  5.5, y: 4, z: -18, rot: -0.25, text: 'LIVE YOUR\nDREAMS', color: 0xec4899 },
    ];
    billboardData.forEach(b => {
      // Frame
      const frameGeo = new THREE.BoxGeometry(2.8, 1.8, 0.12);
      const frameMat = new THREE.MeshStandardMaterial({ color: 0x050510, emissive: new THREE.Color(b.color), emissiveIntensity: 0.12 });
      const frame = new THREE.Mesh(frameGeo, frameMat);
      frame.position.set(b.x, b.y, b.z);
      frame.rotation.y = b.rot;
      scene.add(frame);
      // Neon border edges
      const borderGeo = new THREE.EdgesGeometry(frameGeo);
      const borderMat = new THREE.LineBasicMaterial({ color: b.color });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      border.position.copy(frame.position);
      border.rotation.copy(frame.rotation);
      scene.add(border);
      // Glow light
      const gl = new THREE.PointLight(b.color, 1.5, 7);
      gl.position.set(b.x, b.y + 0.5, b.z + 1);
      scene.add(gl);
      // Pole
      const pGeo = new THREE.CylinderGeometry(0.06, 0.06, b.y - 0.5, 6);
      const pMat = new THREE.MeshStandardMaterial({ color: 0x222233, metalness: 0.7 });
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set(b.x, (b.y - 0.5) / 2, b.z);
      scene.add(p);
    });

    // ── GAME TILES IN ROAD ──
    const tilesGroup = new THREE.Group();
    scene.add(tilesGroup);
    tilesGroupRef.current = tilesGroup;

    // ── PAWN ──
    const pawnGroup = new THREE.Group();
    // Base disc
    const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.15, 16);
    const baseMat = new THREE.MeshStandardMaterial({ color: laneColorHex, emissive: new THREE.Color(laneColorHex), emissiveIntensity: 0.5, roughness: 0.3, metalness: 0.7 });
    pawnGroup.add(new THREE.Mesh(baseGeo, baseMat));
    // Stem
    const stemGeo = new THREE.CylinderGeometry(0.1, 0.18, 0.7, 12);
    const stemMat = new THREE.MeshStandardMaterial({ color: laneColorHex, emissive: new THREE.Color(laneColorHex), emissiveIntensity: 0.4, roughness: 0.2, metalness: 0.8 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.42;
    pawnGroup.add(stem);
    // Ball head
    const ballGeo = new THREE.SphereGeometry(0.42, 32, 32);
    const ballMat = new THREE.MeshStandardMaterial({
      color: laneColorHex,
      emissive: new THREE.Color(laneColorHex),
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.9,
    });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.y = 1.15;
    pawnGroup.add(ball);
    // Specular highlight (small bright sphere)
    const specGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.7 });
    const spec = new THREE.Mesh(specGeo, specMat);
    spec.position.set(-0.14, 1.38, 0.28);
    pawnGroup.add(spec);
    // Letter on ball (using a canvas texture)
    const letter = currentPlayer?.name?.charAt(0)?.toUpperCase() ?? 'P';
    const canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, 128, 128);
    ctx.font = 'bold 72px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(letter, 64, 68);
    const letterTex = new THREE.CanvasTexture(canvas);
    const letterGeo = new THREE.PlaneGeometry(0.45, 0.45);
    const letterMat = new THREE.MeshBasicMaterial({ map: letterTex, transparent: true, side: THREE.DoubleSide });
    const letterMesh = new THREE.Mesh(letterGeo, letterMat);
    letterMesh.position.set(0, 1.15, 0.43);
    pawnGroup.add(letterMesh);

    pawnGroup.position.set(0, 0, 6.5);
    scene.add(pawnGroup);
    pawnRef.current = pawnGroup;

    // Pawn glow ring on road
    const glowGeo = new THREE.RingGeometry(0.45, 0.85, 32);
    const glowMat = new THREE.MeshBasicMaterial({ color: laneColorHex, transparent: true, opacity: 0.55, side: THREE.DoubleSide });
    const glowRing = new THREE.Mesh(glowGeo, glowMat);
    glowRing.rotation.x = -Math.PI / 2;
    glowRing.position.set(0, 0.02, 6.5);
    scene.add(glowRing);
    pawnGlowRef.current = glowRing;

    // Pawn point light
    const pawnPL = new THREE.PointLight(laneColorHex, 3, 5);
    pawnPL.position.set(0, 1.5, 6.5);
    scene.add(pawnPL);

    setReady(true);

    // ── RESIZE ──
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      el.removeChild(renderer.domElement);
    };
  }, [pathIdx]);

  // ── UPDATE TILES when position changes ──────────────────────────────────────
  useEffect(() => {
    const group = tilesGroupRef.current;
    if (!group) return;
    // Clear old tiles
    while (group.children.length) {
      const c = group.children[0];
      group.remove(c);
      if (c.geometry) c.geometry.dispose();
      if (c.material) c.material.dispose();
    }

    const laneColor = LANE_COLORS_HEX[pathIdx] ?? LANE_COLORS_HEX[0];
    const TILE_SPACING = 3.4;
    const SHOW = 7;

    for (let d = 0; d < SHOW; d++) {
      const tileIndex = displayPos + d;
      if (tileIndex >= tilesOnPath.length) break;
      const tile = getTileById(tilesOnPath[tileIndex]);
      const isCurrent = d === 0;

      // Z position: near (large) = z ~5, far = smaller z
      const z = 5.5 - d * TILE_SPACING;

      // Scale by distance
      const scale = Math.pow(0.72, d);
      const tW = 3.2 * scale;
      const tD = 1.5 * scale;
      const tH = 0.06 * scale;

      // Tile box (flat, embedded in road)
      const geo = new THREE.BoxGeometry(tW, tH, tD);
      const mat = new THREE.MeshStandardMaterial({
        color: 0x0d0520,
        emissive: new THREE.Color(laneColor),
        emissiveIntensity: isCurrent ? 0.25 : 0.08,
        roughness: 0.2,
        metalness: 0.5,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0.04, z);
      group.add(mesh);

      // Neon border edges
      const edgesGeo = new THREE.EdgesGeometry(geo);
      const edgesMat = new THREE.LineBasicMaterial({ color: laneColor, linewidth: 2 });
      const edges = new THREE.LineSegments(edgesGeo, edgesMat);
      edges.position.copy(mesh.position);
      group.add(edges);

      // Glow light on current tile
      if (isCurrent) {
        const tl = new THREE.PointLight(laneColor, 2.5, 4);
        tl.position.set(0, 0.6, z);
        group.add(tl);
      }

      // Text label on tile (canvas texture)
      const cW = isCurrent ? 512 : 256, cH = isCurrent ? 256 : 128;
      const tc = document.createElement('canvas');
      tc.width = cW; tc.height = cH;
      const tctx = tc.getContext('2d');
      tctx.clearRect(0, 0, cW, cH);

      // Space number
      const colorCSS = LANE_COLORS_CSS[pathIdx] ?? LANE_COLORS_CSS[0];
      tctx.font = `bold ${isCurrent ? 22 : 14}px sans-serif`;
      tctx.fillStyle = colorCSS;
      tctx.textAlign = 'center';
      tctx.fillText(`SPACE ${tileIndex + 1}`, cW / 2, isCurrent ? 52 : 28);

      // Tile name
      tctx.font = `bold ${isCurrent ? 38 : 20}px sans-serif`;
      tctx.fillStyle = '#ffffff';
      const words = tile.name.split(' ');
      let line = '', lines = [], maxW = cW - 20;
      for (const word of words) {
        const test = line + (line ? ' ' : '') + word;
        if (tctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
        else line = test;
      }
      if (line) lines.push(line);
      const lineH = isCurrent ? 42 : 24;
      const startY = isCurrent ? 105 : 58;
      lines.slice(0, 3).forEach((l, i) => tctx.fillText(l, cW / 2, startY + i * lineH));

      const tex = new THREE.CanvasTexture(tc);
      const labelGeo = new THREE.PlaneGeometry(tW * 0.88, tD * 0.88);
      const labelMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false });
      const label = new THREE.Mesh(labelGeo, labelMat);
      label.rotation.x = -Math.PI / 2;
      label.position.set(0, 0.08, z);
      group.add(label);
    }
  }, [displayPos, pathIdx, tilesOnPath.length]);

  // ── ANIMATION LOOP ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready) return;
    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    const pawn = pawnRef.current;
    const glowRing = pawnGlowRef.current;
    const clock = clockRef.current;

    let pawnHopT = 0;
    let isHopping = false;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Pawn idle bob
      if (pawn) {
        pawn.position.y = Math.sin(t * 1.4) * 0.06;
        pawn.rotation.y = t * 0.4;
      }

      // Pawn glow pulse
      if (glowRing) {
        const scale = 1 + Math.sin(t * 2.5) * 0.12;
        glowRing.scale.set(scale, scale, scale);
        glowRing.material.opacity = 0.4 + Math.sin(t * 2.5) * 0.15;
      }

      // Subtle camera sway for cinematic feel
      if (camera) {
        camera.position.x = Math.sin(t * 0.2) * 0.08;
        camera.position.y = 2.8 + Math.sin(t * 0.35) * 0.06;
      }

      renderer.render(scene, camera);
    };
    animate();
    return () => cancelAnimationFrame(frameRef.current);
  }, [ready]);

  // ── PAWN HOP when position changes ─────────────────────────────────────────
  useEffect(() => {
    const pawn = pawnRef.current;
    const glow = pawnGlowRef.current;
    if (!pawn || !hopping) return;
    const startY = pawn.position.y;
    const startT = performance.now();
    const hop = (now) => {
      const prog = Math.min((now - startT) / HOP_MS, 1);
      const arc = Math.sin(prog * Math.PI) * 1.8;
      pawn.position.y = startY + arc;
      if (glow) glow.material.opacity = 0.2 + Math.sin(prog * Math.PI) * 0.5;
      if (prog < 1) requestAnimationFrame(hop);
    };
    requestAnimationFrame(hop);
  }, [hopping, displayPos]);

  return (
    <div className="absolute inset-0" ref={mountRef} style={{ cursor: 'default' }}>
      {/* Overlay HUD elements */}
      <AnimatePresence>
        {ready && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 pointer-events-none">
            {/* Game title billboard - top center overlay */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <motion.div
                className="rounded-xl border-2 px-6 py-2 text-center"
                style={{ borderColor: `${laneColorCSS}99`, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', boxShadow: `0 0 40px ${laneColorCSS}55` }}
                animate={{ boxShadow: [`0 0 20px ${laneColorCSS}44`, `0 0 55px ${laneColorCSS}99`, `0 0 20px ${laneColorCSS}44`] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <p className="font-black italic" style={{ color: laneColorCSS, textShadow: `0 0 20px ${laneColorCSS}`, fontFamily: '"Dancing Script", cursive', fontSize: 24 }}>
                  Trippin'
                </p>
                <p className="font-black text-[9px] tracking-widest text-white/80 uppercase">Through Life With Mandy</p>
              </motion.div>
            </div>

            {/* Player badge bottom right */}
            <div className="absolute bottom-4 right-4 z-20 pointer-events-none">
              <div className="flex items-center gap-2 rounded-full border px-3 py-1.5"
                style={{ borderColor: `${laneColorCSS}55`, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(10px)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: laneColorCSS, boxShadow: `0 0 10px ${laneColorCSS}` }}>
                  {currentPlayer?.name?.charAt(0)}
                </div>
                <span className="text-white text-xs font-bold">{currentPlayer?.name}</span>
                <span className="font-black text-xs" style={{ color: (currentPlayer?.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${currentPlayer?.money ?? 0}
                </span>
              </div>
            </div>

            {/* Current tile name - bottom center */}
            {tilesOnPath[displayPos] != null && (() => {
              const tile = getTileById(tilesOnPath[displayPos]);
              return (
                <motion.div
                  key={displayPos}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 text-center"
                  style={{ pointerEvents: 'none' }}>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-0.5" style={{ color: laneColorCSS }}>
                    SPACE {displayPos + 1}
                  </p>
                  <p className="text-white font-black text-lg drop-shadow-lg" style={{ textShadow: `0 0 20px ${laneColorCSS}` }}>
                    {tile.name}
                  </p>
                </motion.div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}