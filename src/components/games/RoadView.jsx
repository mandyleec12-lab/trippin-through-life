import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

const HOP_MS = 440;

const PAWN_HEX = {
  pink: '#ec4899', purple: '#a855f7', blue: '#3b82f6',
  teal: '#14b8a6', gold: '#f59e0b', coral: '#f43f5e',
};
const CAT_NEON = {
  start: '#ffffff', finish: '#fbbf24', money: '#34d399',
  money_loss: '#f87171', tax: '#ef4444', heartbreak: '#f472b6',
  chaos: '#fb923c', blessing: '#38bdf8', glowup: '#c084fc', wildcard: '#e879f9',
};
const CAT_EMOJI = {
  start: '🚀', finish: '🏆', money: '💹', money_loss: '💸',
  tax: '💀', heartbreak: '💔', chaos: '🔥', blessing: '✨',
  glowup: '🌟', wildcard: '🃏',
};

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  return { r, g, b };
}

function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastKeyRef = useRef(resetKey);
  useEffect(() => {
    if (lastKeyRef.current !== resetKey) {
      lastKeyRef.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey, targetPos]);
  useEffect(() => {
    if (displayPos === targetPos) { setHopping(false); return; }
    setHopping(true);
    const t1 = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const t2 = setTimeout(() => {
      setDisplayPos(p => p === targetPos ? p : p + (targetPos > p ? 1 : -1));
    }, HOP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [displayPos, targetPos]);
  return { displayPos, hopping };
}

// ── Three.js Street Scene ──────────────────────────────────────────────────────
function ThreeStreet({ tilesOnPath, safePos, visibleStart, getTileById, pathNeon, currentPlayer, hopping, players, currentPlayerIndex, categoryStyles }) {
  const mountRef = useRef(null);
  const sceneRef = useRef({});

  const neonHex = pathNeon || '#a855f7';
  const pawnHex = PAWN_HEX[currentPlayer.color] || '#a855f7';

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth, H = el.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.9;
    el.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010308, 0.045);
    scene.background = new THREE.Color(0x010308);

    // Camera — low angle, looking up the street
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 200);
    camera.position.set(0, 3.2, 10);
    camera.lookAt(0, 0.5, -12);

    // ── Ambient + directional light ──
    scene.add(new THREE.AmbientLight(0x111133, 1.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight.position.set(5, 20, 5);
    scene.add(dirLight);

    // Neon color
    const nc = hexToRgb(neonHex);
    const neonColor = new THREE.Color(nc.r, nc.g, nc.b);
    const neonPointLight = new THREE.PointLight(neonColor, 3, 25);
    neonPointLight.position.set(0, 2, 5);
    scene.add(neonPointLight);

    // ── WET STREET GROUND ──
    const groundGeo = new THREE.PlaneGeometry(60, 200);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x090d1a,
      roughness: 0.15,
      metalness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road lane stripes
    const stripeMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(nc.r * 0.5, nc.g * 0.5, nc.b * 0.5), emissive: neonColor, emissiveIntensity: 0.3 });
    for (let z = -50; z < 0; z += 3) {
      const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 1.5), stripeMat);
      stripe.rotation.x = -Math.PI / 2;
      stripe.position.set(1.8, 0.002, z);
      scene.add(stripe);
      const stripe2 = stripe.clone();
      stripe2.position.set(-1.8, 0.002, z);
      scene.add(stripe2);
    }

    // ── BUILDINGS ──
    const buildingConfigs = [
      // left side
      { x: -9, z: -10, w: 5, h: 22, d: 6, col: 0x0a0d1e },
      { x: -14, z: -20, w: 6, h: 30, d: 7, col: 0x080b18 },
      { x: -8, z: -30, w: 4, h: 18, d: 5, col: 0x0c1024 },
      { x: -13, z: -38, w: 7, h: 35, d: 8, col: 0x070a14 },
      { x: -9, z: -48, w: 5, h: 26, d: 6, col: 0x0a0d1e },
      // right side
      { x: 9, z: -10, w: 5, h: 28, d: 6, col: 0x080b18 },
      { x: 14, z: -18, w: 6, h: 20, d: 7, col: 0x0a0d1e },
      { x: 8, z: -28, w: 4, h: 24, d: 5, col: 0x0c1024 },
      { x: 14, z: -38, w: 7, h: 32, d: 8, col: 0x070a14 },
      { x: 9, z: -48, w: 5, h: 20, d: 6, col: 0x080b18 },
    ];

    buildingConfigs.forEach(({ x, z, w, h, d, col }) => {
      const bGeo = new THREE.BoxGeometry(w, h, d);
      const bMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.9, metalness: 0.1 });
      const building = new THREE.Mesh(bGeo, bMat);
      building.position.set(x, h / 2, z);
      building.castShadow = true;
      scene.add(building);

      // Window lights
      const winColors = [neonColor, new THREE.Color(1, 0.95, 0.7), new THREE.Color(0.9, 0.3, 0.8)];
      for (let wy = 1; wy < h - 1; wy += 1.8) {
        for (let wx = -w / 2 + 0.5; wx < w / 2; wx += 1.2) {
          if (Math.random() < 0.45) {
            const wGeo = new THREE.PlaneGeometry(0.5, 0.7);
            const wCol = winColors[Math.floor(Math.random() * winColors.length)];
            const wMat = new THREE.MeshStandardMaterial({ color: wCol, emissive: wCol, emissiveIntensity: Math.random() * 0.8 + 0.2 });
            const win = new THREE.Mesh(wGeo, wMat);
            const side = x > 0 ? -1 : 1;
            win.position.set(x + wx, wy, z + side * d / 2 + 0.02);
            scene.add(win);
          }
        }
      }

      // Rooftop neon accent
      const roofGeo = new THREE.BoxGeometry(w + 0.3, 0.15, d + 0.3);
      const roofMat = new THREE.MeshStandardMaterial({ color: neonColor, emissive: neonColor, emissiveIntensity: 0.6 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.set(x, h + 0.07, z);
      scene.add(roof);
    });

    // ── NEON BILLBOARD SIGNS ──
    const signData = [
      { text: 'HUSTLE\nHARD', x: -7, y: 7, z: -6, col: 0xf472b6 },
      { text: 'NO RISK\nNO REWARD', x: -7, y: 4, z: -14, col: 0xa855f7 },
      { text: 'KEEP MOVING\nFORWARD', x: -7, y: 4, z: -22, col: 0x38bdf8 },
      { text: 'FOCUS\nDISCIPLINE\nDESTINY', x: 7, y: 8, z: -6, col: 0x34d399 },
      { text: 'OPPORTUNITY\nIS EVERYWHERE', x: 7, y: 6, z: -15, col: 0x38bdf8 },
      { text: 'LIVE YOUR\nDREAMS', x: 7, y: 4, z: -22, col: 0xf472b6 },
    ];

    signData.forEach(({ x, y, z, col }) => {
      const sGeo = new THREE.BoxGeometry(3.5, 1.6, 0.1);
      const sMat = new THREE.MeshStandardMaterial({
        color: 0x000510, emissive: new THREE.Color((col >> 16 & 255) / 255, (col >> 8 & 255) / 255, (col & 255) / 255),
        emissiveIntensity: 0.6, roughness: 0.5,
      });
      const sign = new THREE.Mesh(sGeo, sMat);
      sign.position.set(x, y, z);
      scene.add(sign);
      // Sign frame glow
      const frameGeo = new THREE.EdgesGeometry(sGeo);
      const frameMat = new THREE.LineBasicMaterial({ color: col, linewidth: 2 });
      const frame = new THREE.LineSegments(frameGeo, frameMat);
      frame.position.copy(sign.position);
      scene.add(frame);
      // Point light per sign
      const sLight = new THREE.PointLight(new THREE.Color((col >> 16 & 255) / 255, (col >> 8 & 255) / 255, (col & 255) / 255), 1.5, 8);
      sLight.position.set(x, y, z + 0.5);
      scene.add(sLight);
    });

    // ── STREET LAMP POSTS ──
    [-5.5, 5.5].forEach(sx => {
      [-4, -12, -22, -32].forEach(sz => {
        const postGeo = new THREE.CylinderGeometry(0.07, 0.07, 6, 8);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.9, roughness: 0.2 });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.set(sx, 3, sz);
        scene.add(post);
        // Lamp head
        const lampGeo = new THREE.SphereGeometry(0.25, 8, 8);
        const lampMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: new THREE.Color(1, 0.95, 0.6), emissiveIntensity: 1.5 });
        const lamp = new THREE.Mesh(lampGeo, lampMat);
        lamp.position.set(sx, 6.2, sz);
        scene.add(lamp);
        const lampLight = new THREE.PointLight(0xfef3c7, 2, 10);
        lampLight.position.copy(lamp.position);
        scene.add(lampLight);
      });
    });

    // ── TILE PANELS on the street ──
    const TILE_W = 3.2, TILE_D = 1.8, TILE_GAP = 0.2;
    const SHOW_AHEAD = 5;
    const winEnd = Math.min(tilesOnPath.length - 1, safePos + SHOW_AHEAD);
    const tileMeshes = [];

    for (let i = safePos; i <= winEnd; i++) {
      const tileId = tilesOnPath[i];
      if (tileId == null) continue;
      const tile = getTileById(tileId);
      const neon = CAT_NEON[tile.category] || neonHex;
      const tc = hexToRgb(neon);
      const tileColor = new THREE.Color(tc.r, tc.g, tc.b);
      const isCurrent = i === safePos;

      const zPos = -(i - safePos) * (TILE_D + TILE_GAP) - 0.5;

      // Panel
      const panelGeo = new THREE.BoxGeometry(TILE_W, 0.08, TILE_D);
      const panelMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0x0e1830 : 0x070c1c,
        emissive: tileColor,
        emissiveIntensity: isCurrent ? 0.35 : 0.12,
        roughness: 0.3,
        metalness: 0.7,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, 0.04, zPos);
      panel.receiveShadow = true;
      scene.add(panel);
      tileMeshes.push({ panel, isCurrent, tileColor, zPos });

      // Neon border frame
      const borderGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(TILE_W + 0.05, 0.12, TILE_D + 0.05));
      const borderMat = new THREE.LineBasicMaterial({ color: tileColor });
      const border = new THREE.LineSegments(borderGeo, borderMat);
      border.position.set(0, 0.04, zPos);
      scene.add(border);

      // Glow light under active tile
      if (isCurrent) {
        const tLight = new THREE.PointLight(tileColor, 4, 5);
        tLight.position.set(0, 0.5, zPos);
        scene.add(tLight);
      }

      // Ground reflection glow
      const glowGeo = new THREE.PlaneGeometry(TILE_W * 1.4, TILE_D * 1.4);
      const glowMat = new THREE.MeshBasicMaterial({
        color: tileColor, transparent: true,
        opacity: isCurrent ? 0.18 : 0.07, side: THREE.DoubleSide,
      });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(0, 0.001, zPos);
      scene.add(glow);
    }

    // ── PAWN BALL ──
    const pc = hexToRgb(pawnHex);
    const pawnColor = new THREE.Color(pc.r, pc.g, pc.b);

    const pawnGeo = new THREE.SphereGeometry(0.55, 32, 32);
    const pawnMat = new THREE.MeshStandardMaterial({
      color: pawnColor, emissive: pawnColor, emissiveIntensity: 0.35,
      roughness: 0.1, metalness: 0.6,
    });
    const pawnBall = new THREE.Mesh(pawnGeo, pawnMat);
    pawnBall.position.set(0, 0.65, -0.1);
    pawnBall.castShadow = true;
    scene.add(pawnBall);
    // Pawn stem
    const stemGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 16);
    const stemMat = new THREE.MeshStandardMaterial({ color: pawnColor, emissive: pawnColor, emissiveIntensity: 0.2, metalness: 0.8, roughness: 0.2 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, 0.25, -0.1);
    scene.add(stem);
    // Pawn glow
    const pawnLight = new THREE.PointLight(pawnColor, 3, 4);
    pawnLight.position.set(0, 1, -0.1);
    scene.add(pawnLight);
    // Specular highlight on pawn
    const specGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.55 });
    const spec = new THREE.Mesh(specGeo, specMat);
    spec.position.set(-0.18, 0.95, 0.3);
    scene.add(spec);

    // Shadow pool under pawn
    const shadowGeo = new THREE.PlaneGeometry(1.4, 0.9);
    const shadowMat = new THREE.MeshBasicMaterial({ color: pawnColor, transparent: true, opacity: 0.22 });
    const shadowPool = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPool.rotation.x = -Math.PI / 2;
    shadowPool.position.set(0, 0.002, -0.1);
    scene.add(shadowPool);

    // ── RAIN PARTICLES ──
    const rainCount = 2000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for (let i = 0; i < rainCount; i++) {
      rainPos[i * 3]     = (Math.random() - 0.5) * 40;
      rainPos[i * 3 + 1] = Math.random() * 30;
      rainPos[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x8ab4d4, size: 0.06, transparent: true, opacity: 0.35 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    // ── STAR PARTICLES (sky) ──
    const starCount = 300;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3]     = (Math.random() - 0.5) * 100;
      starPos[i * 3 + 1] = 20 + Math.random() * 30;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 100 - 20;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.12, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(starGeo, starMat));

    // ── MOVING CARS ──
    const carMeshes = [];
    [-2.5, 2.5].forEach((laneX, li) => {
      const carGeo = new THREE.BoxGeometry(0.9, 0.4, 2);
      const carMat = new THREE.MeshStandardMaterial({ color: li === 0 ? 0x111827 : 0x1f1035, metalness: 0.9, roughness: 0.2 });
      const car = new THREE.Mesh(carGeo, carMat);
      car.position.set(laneX, 0.2, -30 + li * 10);
      scene.add(car);
      // Headlights
      const hlColor = li === 0 ? 0xfef3c7 : 0xff4444;
      [-0.3, 0.3].forEach(hx => {
        const hlGeo = new THREE.SphereGeometry(0.1, 8, 8);
        const hlMat = new THREE.MeshStandardMaterial({ color: hlColor, emissive: new THREE.Color(hlColor), emissiveIntensity: 2 });
        const hl = new THREE.Mesh(hlGeo, hlMat);
        hl.position.set(laneX + hx, 0.2, car.position.z + (li === 0 ? 1.1 : -1.1));
        scene.add(hl);
        carMeshes.push({ car, hl, speed: li === 0 ? 0.18 : -0.22, hlOffset: { x: hx, z: li === 0 ? 1.1 : -1.1, laneX } });
      });
      carMeshes.push({ car, speed: li === 0 ? 0.18 : -0.22, laneX });
    });

    // ── ANIMATION LOOP ──
    let animId;
    let t = 0;
    const rainPositions = rainGeo.attributes.position.array;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Pawn bob
      pawnBall.position.y = 0.65 + Math.sin(t * 1.8) * (hopping ? 0.8 : 0.12);
      stem.position.y = 0.25 + Math.sin(t * 1.8) * (hopping ? 0.8 : 0.12) * 0.3;
      spec.position.y = 0.95 + Math.sin(t * 1.8) * (hopping ? 0.8 : 0.12);

      // Tile pulse
      tileMeshes.forEach(({ panel, isCurrent, tileColor, zPos }) => {
        if (isCurrent) {
          panel.material.emissiveIntensity = 0.25 + Math.sin(t * 2.8) * 0.15;
        }
      });

      // Neon flicker on path light
      neonPointLight.intensity = 2.5 + Math.sin(t * 3.2) * 0.5;

      // Rain fall
      for (let i = 0; i < rainCount; i++) {
        rainPositions[i * 3 + 1] -= 0.35;
        if (rainPositions[i * 3 + 1] < -1) {
          rainPositions[i * 3 + 1] = 25;
        }
      }
      rainGeo.attributes.position.needsUpdate = true;

      // Cars move
      carMeshes.forEach(obj => {
        if (!obj.car) return;
        obj.car.position.z += obj.speed;
        if (obj.car.position.z > 15) obj.car.position.z = -55;
        if (obj.car.position.z < -55) obj.car.position.z = 15;
      });

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    sceneRef.current = { renderer, scene, camera, animId };
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, [safePos, tilesOnPath.length, neonHex, pawnHex, hopping]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

// ── 2D Overlay: tile labels, signs, UI ───────────────────────────────────────
function NeonSign({ text, color, style: pos }) {
  return (
    <motion.div className="absolute flex flex-col items-center justify-center rounded-xl border font-black uppercase text-center pointer-events-none"
      style={{
        ...pos,
        minWidth: 80, padding: '8px 12px', fontSize: 10, letterSpacing: '0.1em', lineHeight: 1.3,
        color, borderColor: `${color}66`, background: 'rgba(0,2,10,0.90)',
        boxShadow: `0 0 22px ${color}77, 0 0 45px ${color}22`,
        textShadow: `0 0 12px ${color}`, zIndex: 30,
      }}
      animate={{ opacity: [0.4, 1, 0.35, 0.9, 0.4] }}
      transition={{ duration: 3 + Math.random() * 2, repeat: Infinity }}
    >
      {text.split('\n').map((l, i) => <span key={i}>{l}</span>)}
    </motion.div>
  );
}

// ── Main RoadView ─────────────────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];

  const activePathIdx = (focusedPathIndex !== null && focusedPathIndex !== undefined)
    ? focusedPathIndex : (currentPlayer.pathIndex ?? 0);

  const pathNeon    = ['#a855f7', '#ec4899', '#f97316'][activePathIdx] ?? '#a855f7';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position, `${currentPlayer.id}-${activePathIdx}`
  );
  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));

  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName    = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji   = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon     = CAT_NEON[currentTile?.category] || pathNeon;

  // Visible tiles info for overlay labels
  const SHOW_AHEAD = 5;
  const winEnd = Math.min(tilesOnPath.length - 1, safePos + SHOW_AHEAD);
  const visibleTiles = tilesOnPath.slice(safePos, winEnd + 1);

  // Bottom positions for tile labels (perspective-matched)
  const tileBottomPositions = [62, 52, 44, 37, 31, 26];

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── THREE.JS 3D scene fills entire board ── */}
      <ThreeStreet
        tilesOnPath={tilesOnPath}
        safePos={safePos}
        visibleStart={safePos}
        getTileById={getTileById}
        pathNeon={pathNeon}
        currentPlayer={currentPlayer}
        hopping={hopping}
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        categoryStyles={categoryStyles}
      />

      {/* ── Tile label overlays (perspective-placed) ── */}
      {visibleTiles.map((tileId, i) => {
        const tile    = getTileById(tileId);
        const neon    = CAT_NEON[tile.category] || pathNeon;
        const emoji   = CAT_EMOJI[tile.category] || '';
        const isCur   = i === 0;
        const styleInfo = categoryStyles?.[tile.category] || categoryStyles?.start;
        const Icon    = styleInfo?.icon;

        // Perspective scaling: i=0 biggest, shrinks up
        const scale   = Math.pow(0.78, i);
        const width   = Math.round(300 * scale);
        const bottom  = `${tileBottomPositions[i] ?? 20}%`;
        const fontSize = Math.max(8, Math.round(15 * scale));
        const subFs   = Math.max(6, Math.round(10 * scale));

        const label = i === 0 && safePos === 0 ? 'THE JOURNEY BEGINS'
          : safePos + i === tilesOnPath.length - 1 ? 'YOU MADE IT! 🏆'
          : tile.name.toUpperCase();

        return (
          <motion.div key={`label-${safePos + i}`}
            className="absolute flex flex-col items-center pointer-events-none"
            style={{ bottom, left: '50%', transform: 'translateX(-50%)', width, zIndex: 25 }}
            animate={isCur ? { opacity: [0.8, 1, 0.8] } : { opacity: 1 }}
            transition={isCur ? { duration: 1.2, repeat: Infinity } : undefined}
          >
            {/* Space number */}
            {!isCur && (
              <p style={{ fontSize: Math.max(5, subFs - 1), fontWeight: 900, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 1 }}>
                SPACE {safePos + i + 1}
              </p>
            )}
            {/* Main label row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {Icon && (
                <div style={{ width: Math.max(12, 22 * scale), height: Math.max(12, 22 * scale), borderRadius: 6, background: `${neon}18`, border: `1px solid ${neon}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon style={{ width: Math.max(8, 13 * scale), height: Math.max(8, 13 * scale), color: neon }} />
                </div>
              )}
              <p style={{
                fontSize, fontWeight: 900, color: isCur ? '#fff' : 'rgba(255,255,255,0.85)',
                letterSpacing: '0.05em', lineHeight: 1.2, textTransform: 'uppercase',
                textShadow: `0 0 16px ${neon}, 0 0 30px ${neon}88`,
                textAlign: 'center',
              }}>
                {label}
              </p>
              <span style={{ fontSize: Math.max(9, 18 * scale), opacity: 0.8, flexShrink: 0 }}>{emoji}</span>
            </div>
            {/* Money / effect badge */}
            {(tile.effect === 'money_gain' || tile.effect === 'money_loss') && tile.effectValue && (
              <p style={{
                fontSize: Math.max(6, subFs), fontWeight: 900, marginTop: 2,
                color: tile.effect === 'money_gain' ? '#34d399' : '#f87171',
                textShadow: tile.effect === 'money_gain' ? '0 0 10px #34d399' : '0 0 10px #f87171',
              }}>
                {tile.effect === 'money_gain' ? '+' : '-'}${Math.abs(tile.effectValue)}
              </p>
            )}
          </motion.div>
        );
      })}

      {/* ── Neon billboard signs (CSS overlay on sides) ── */}
      <NeonSign text={'HUSTLE\nHARD'}          color="#f472b6" style={{ left: 6,  top: '14%' }} />
      <NeonSign text={'NO RISK\nNO REWARD'}    color="#a855f7" style={{ left: 6,  top: '34%' }} />
      <NeonSign text={'KEEP\nMOVING\nFORWARD'} color="#38bdf8" style={{ left: 6,  top: '54%' }} />
      <NeonSign text={'INVEST IN\nYOURSELF'}   color="#34d399" style={{ left: 6,  top: '72%' }} />
      <NeonSign text={'FOCUS\nDISCIPLINE\nDESTINY'} color="#34d399" style={{ right: 6, top: '12%' }} />
      <NeonSign text={'OPPORTUNITY\nIS EVERYWHERE'}  color="#38bdf8" style={{ right: 6, top: '32%' }} />
      <NeonSign text={'LIVE YOUR\nDREAMS'}           color="#f472b6" style={{ right: 6, top: '52%' }} />
      <NeonSign text={'NO RISK\nNO REWARD'}          color="#fbbf24" style={{ right: 6, top: '70%' }} />

      {/* Game title at vanishing point */}
      <motion.div className="absolute font-black text-center rounded-2xl border px-4 py-1.5 pointer-events-none"
        style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          fontSize: 11, letterSpacing: '0.16em', color: pathNeon,
          borderColor: `${pathNeon}55`, background: 'rgba(0,0,8,0.88)',
          boxShadow: `0 0 28px ${pathNeon}77`, textShadow: `0 0 12px ${pathNeon}`,
          whiteSpace: 'nowrap', zIndex: 35,
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        ✦ Trippin' Through Life ✦
      </motion.div>

      {/* ── Header ── */}
      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,8,0.90)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}35` }}>
        <div className="flex items-center gap-2">
          <span>{pathEmoji}</span>
          <div>
            <p className="font-black uppercase text-white/35" style={{ fontSize: 6, letterSpacing: '0.22em' }}>YOUR PATH</p>
            <p className="font-black text-white" style={{ fontSize: 11 }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p className="font-black text-white/25 uppercase" style={{ fontSize: 6, letterSpacing: '0.18em' }}>
            SPACE {safePos + 1} / {tilesOnPath.length}
          </p>
          <div className="rounded-full overflow-hidden" style={{ width: 110, height: 5, background: 'rgba(255,255,255,0.08)' }}>
            <motion.div className="h-full rounded-full"
              style={{ background: pathNeon, boxShadow: `0 0 8px ${pathNeon}` }}
              animate={{ width: `${progressPct}%` }} transition={{ duration: 0.45, ease: 'easeOut' }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-black" style={{ fontSize: 13, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 10 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-40 flex items-center gap-3 px-4 py-2"
        style={{ background: 'rgba(0,0,8,0.92)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${pathNeon}30` }}>
        <div className="flex gap-2 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden"
                  style={{ width: 20, height: 20, fontSize: 8, background: `radial-gradient(circle at 35% 35%, ${hex}ee, ${hex}88)`, border: '1px solid rgba(255,255,255,0.5)' }}>
                  {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover rounded-full" /> : p.name.charAt(0)}
                </div>
                <span className="font-bold text-white/80" style={{ fontSize: 9 }}>{p.name.split(' ')[0]}</span>
                <span className="font-black" style={{ fontSize: 9, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-right shrink-0">
          <p className="font-black uppercase text-white/25" style={{ fontSize: 6, letterSpacing: '0.14em' }}>NOW ON</p>
          <p className="font-black" style={{ fontSize: 10, color: curNeon }}>{currentTile?.name}</p>
        </div>
      </div>
    </div>
  );
}