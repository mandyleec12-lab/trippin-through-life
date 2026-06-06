import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const HOP_MS = 440;

const PAWN_HEX = {
  pink: '#ec4899', purple: '#a855f7', blue: '#3b82f6',
  teal: '#14b8a6', gold: '#f59e0b', coral: '#f43f5e',
};

const CAT_COLOR = {
  start: '#ffffff', finish: '#fbbf24',
  money: '#34d399', money_loss: '#f87171',
  tax: '#ef4444', heartbreak: '#f472b6',
  chaos: '#fb923c', blessing: '#38bdf8',
  glowup: '#c084fc', wildcard: '#e879f9',
};

const CAT_LABEL = {
  start: '🚀', finish: '🏆', money: '💹', money_loss: '💸',
  tax: '💀', heartbreak: '💔', chaos: '🔥', blessing: '✨',
  glowup: '🌟', wildcard: '🃏',
};

// ─── Util ─────────────────────────────────────────────────────────────────────
function hex2rgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16) / 255,
    g: parseInt(hex.slice(3, 5), 16) / 255,
    b: parseInt(hex.slice(5, 7), 16) / 255,
  };
}
function mkColor(hex) {
  const { r, g, b } = hex2rgb(hex);
  return new THREE.Color(r, g, b);
}

// ─── Step-animation hook (pawn walks tile-by-tile) ────────────────────────────
function useStepAnimation(targetPos, resetKey) {
  const [displayPos, setDisplayPos] = useState(targetPos);
  const [hopping, setHopping] = useState(false);
  const lastKey = useRef(resetKey);
  useEffect(() => {
    if (lastKey.current !== resetKey) {
      lastKey.current = resetKey;
      setDisplayPos(targetPos);
      setHopping(false);
    }
  }, [resetKey, targetPos]);
  useEffect(() => {
    if (displayPos === targetPos) { setHopping(false); return; }
    setHopping(true);
    const t1 = setTimeout(() => setHopping(false), HOP_MS * 0.72);
    const t2 = setTimeout(() => setDisplayPos(p => p + (targetPos > p ? 1 : -1)), HOP_MS);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [displayPos, targetPos]);
  return { displayPos, hopping };
}

// ─── Draw a tile texture onto a canvas ───────────────────────────────────────
function makeTileCanvas(tile, spaceNum, isCurrent, tileColor) {
  const W = 512, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d');

  // Background
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, isCurrent ? '#0e1a38' : '#080e20');
  bg.addColorStop(1, isCurrent ? '#060e1e' : '#030810');
  ctx.fillStyle = bg;
  ctx.roundRect(4, 4, W - 8, H - 8, 24);
  ctx.fill();

  // Neon border
  ctx.strokeStyle = tileColor;
  ctx.lineWidth = isCurrent ? 6 : 3;
  ctx.shadowColor = tileColor;
  ctx.shadowBlur = isCurrent ? 30 : 12;
  ctx.roundRect(4, 4, W - 8, H - 8, 24);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Top neon line
  const tg = ctx.createLinearGradient(0, 0, W, 0);
  tg.addColorStop(0, 'transparent');
  tg.addColorStop(0.5, tileColor);
  tg.addColorStop(1, 'transparent');
  ctx.fillStyle = tg;
  ctx.fillRect(4, 4, W - 8, isCurrent ? 5 : 3);

  // Bottom glow
  const bg2 = ctx.createLinearGradient(0, H * 0.6, 0, H);
  bg2.addColorStop(0, 'transparent');
  bg2.addColorStop(1, tileColor + '33');
  ctx.fillStyle = bg2;
  ctx.fillRect(4, H * 0.6, W - 8, H - 4);

  // Space label
  if (!isCurrent) {
    ctx.font = '700 28px "Arial"';
    ctx.fillStyle = 'rgba(255,255,255,0.30)';
    ctx.letterSpacing = '4px';
    ctx.textAlign = 'center';
    ctx.fillText(`SPACE ${spaceNum}`, W / 2, 54);
  }

  // Tile name
  const name = tile.name.toUpperCase();
  ctx.shadowColor = tileColor;
  ctx.shadowBlur = isCurrent ? 20 : 8;
  ctx.font = `900 ${isCurrent ? 52 : 40}px "Arial"`;
  ctx.fillStyle = isCurrent ? '#ffffff' : 'rgba(255,255,255,0.90)';
  ctx.textAlign = 'center';
  // Word wrap
  const words = name.split(' ');
  let line = '', lines = [];
  const maxW = W - 80;
  for (const w of words) {
    const test = line + (line ? ' ' : '') + w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  const lineH = isCurrent ? 58 : 46;
  const startY = isCurrent ? (lines.length > 1 ? 118 : 150) : (lines.length > 1 ? 104 : 136);
  lines.forEach((l, i) => ctx.fillText(l, W / 2, startY + i * lineH));
  ctx.shadowBlur = 0;

  // Money badge
  if ((tile.effect === 'money_gain' || tile.effect === 'money_loss') && tile.effectValue) {
    const sign = tile.effect === 'money_gain' ? '+' : '-';
    const badgeCol = tile.effect === 'money_gain' ? '#34d399' : '#f87171';
    const badge = `${sign}$${Math.abs(tile.effectValue)}`;
    ctx.font = '800 32px "Arial"';
    ctx.fillStyle = badgeCol;
    ctx.shadowColor = badgeCol;
    ctx.shadowBlur = 12;
    ctx.textAlign = 'right';
    ctx.fillText(badge, W - 28, H - 22);
    ctx.shadowBlur = 0;
  }

  // Emoji
  ctx.font = `${isCurrent ? 44 : 32}px "Arial"`;
  ctx.textAlign = 'right';
  ctx.fillText(CAT_LABEL[tile.category] || '', W - 28, 70);

  return cv;
}

// ─── Three.js street scene ────────────────────────────────────────────────────
function ThreeScene({ tilesOnPath, safePos, getTileById, pathNeon, currentPlayer, hopping }) {
  const mountRef = useRef(null);
  const stateRef = useRef({});

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;
    const W = el.clientWidth || 800;
    const H = el.clientHeight || 600;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    el.appendChild(renderer.domElement);

    // ── Scene / Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x010208);
    scene.fog = new THREE.FogExp2(0x010208, 0.038);

    // Low angle cinematic camera — looking up the street toward the horizon
    const camera = new THREE.PerspectiveCamera(52, W / H, 0.1, 300);
    camera.position.set(0, 2.8, 9.5);
    camera.lookAt(0, 1.2, -20);

    // ── Lights ────────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0x080c1a, 3));
    const neonC = mkColor(pathNeon);
    const pawnC = mkColor(PAWN_HEX[currentPlayer.color] || '#a855f7');

    const keyLight = new THREE.PointLight(neonC, 6, 20);
    keyLight.position.set(0, 2, 2);
    scene.add(keyLight);

    const fill = new THREE.DirectionalLight(0x334466, 0.8);
    fill.position.set(-8, 12, 6);
    fill.castShadow = true;
    fill.shadow.mapSize.set(1024, 1024);
    scene.add(fill);

    // ── WET ASPHALT GROUND ────────────────────────────────────────────────────
    const groundGeo = new THREE.PlaneGeometry(80, 250);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x07090f, roughness: 0.1, metalness: 0.92,
      envMapIntensity: 1.2,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Road surface (darker center strip between lines)
    const roadGeo = new THREE.PlaneGeometry(5.4, 250);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0x050709, roughness: 0.15, metalness: 0.85 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.002, -50);
    scene.add(road);

    // Yellow lane lines (like the references)
    const lineMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: new THREE.Color(0.8, 0.5, 0), emissiveIntensity: 0.7 });
    [-2.1, 2.1].forEach(lx => {
      const lineGeo = new THREE.PlaneGeometry(0.09, 250);
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(lx, 0.003, -50);
      scene.add(line);
    });

    // Neon center glow strip on road
    const centerMat = new THREE.MeshBasicMaterial({ color: neonC, transparent: true, opacity: 0.08 });
    const centerGeo = new THREE.PlaneGeometry(3.6, 250);
    const centerStrip = new THREE.Mesh(centerGeo, centerMat);
    centerStrip.rotation.x = -Math.PI / 2;
    centerStrip.position.set(0, 0.004, -50);
    scene.add(centerStrip);

    // ── BUILDINGS (both sides) ─────────────────────────────────────────────────
    const buildingDefs = [
      // LEFT
      { x: -10, z: -12, w: 7, h: 28, d: 8 },
      { x: -16, z: -22, w: 5, h: 40, d: 7 },
      { x: -9, z: -33, w: 6, h: 22, d: 9 },
      { x: -15, z: -44, w: 8, h: 35, d: 6 },
      { x: -10, z: -58, w: 5, h: 50, d: 7 },
      // RIGHT
      { x: 10, z: -12, w: 7, h: 32, d: 8 },
      { x: 16, z: -20, w: 6, h: 24, d: 7 },
      { x: 10, z: -32, w: 5, h: 44, d: 9 },
      { x: 16, z: -44, w: 7, h: 28, d: 6 },
      { x: 10, z: -58, w: 6, h: 38, d: 7 },
    ];

    const brickPalette = [0x0a0c18, 0x07090e, 0x0c0e1a, 0x080a12];
    buildingDefs.forEach(({ x, z, w, h, d }) => {
      const bGeo = new THREE.BoxGeometry(w, h, d);
      const bMat = new THREE.MeshStandardMaterial({
        color: brickPalette[Math.abs(x + z) % brickPalette.length],
        roughness: 0.92, metalness: 0.05,
      });
      const b = new THREE.Mesh(bGeo, bMat);
      b.position.set(x, h / 2, z);
      b.castShadow = true;
      scene.add(b);

      // Window grid
      const winColors = [neonC, new THREE.Color(1, 0.95, 0.6), new THREE.Color(0.9, 0.25, 0.75)];
      const cols = Math.floor(w / 1.3), rows = Math.floor(h / 2.2);
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          if (Math.random() < 0.42) {
            const wCol = winColors[Math.floor(Math.random() * winColors.length)];
            const wGeo = new THREE.PlaneGeometry(0.55, 0.75);
            const wMat = new THREE.MeshStandardMaterial({ color: wCol, emissive: wCol, emissiveIntensity: Math.random() * 1.2 + 0.3, transparent: true, opacity: 0.85 });
            const win = new THREE.Mesh(wGeo, wMat);
            const faceZ = z + (x > 0 ? -d / 2 - 0.02 : d / 2 + 0.02);
            win.position.set(
              x + (-w / 2 + 0.9 + col * 1.25),
              1 + row * 2.1,
              faceZ,
            );
            if (x > 0) win.rotation.y = Math.PI;
            scene.add(win);
          }
        }
      }

      // Rooftop neon edge
      const roofMat = new THREE.MeshStandardMaterial({ color: neonC, emissive: neonC, emissiveIntensity: 0.8, transparent: true, opacity: 0.6 });
      const roofEdge = new THREE.Mesh(new THREE.BoxGeometry(w + 0.2, 0.1, d + 0.2), roofMat);
      roofEdge.position.set(x, h + 0.05, z);
      scene.add(roofEdge);
    });

    // ── STREET LAMPS ──────────────────────────────────────────────────────────
    const lampPositions = [[-4.8, -5], [4.8, -5], [-4.8, -18], [4.8, -18], [-4.8, -32], [4.8, -32]];
    lampPositions.forEach(([lx, lz]) => {
      const postMat = new THREE.MeshStandardMaterial({ color: 0x4a5568, metalness: 0.95, roughness: 0.15 });
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 7, 8), postMat);
      post.position.set(lx, 3.5, lz);
      scene.add(post);

      // Arm
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.4, 8), postMat);
      arm.rotation.z = Math.PI / 2;
      arm.position.set(lx + (lx > 0 ? -0.7 : 0.7), 7.1, lz);
      scene.add(arm);

      const lampMat = new THREE.MeshStandardMaterial({ color: 0xfef3c7, emissive: new THREE.Color(1, 0.93, 0.55), emissiveIntensity: 2.5 });
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 10), lampMat);
      lamp.position.set(lx + (lx > 0 ? -1.1 : 1.1), 7.1, lz);
      scene.add(lamp);

      const lampLight = new THREE.PointLight(0xfef3c7, 2.5, 12);
      lampLight.position.copy(lamp.position);
      scene.add(lampLight);
    });

    // ── TILE PANELS on street ─────────────────────────────────────────────────
    const TILE_W = 3.8, TILE_H_3D = 0.09, TILE_D = 2.0, TILE_GAP = 0.22;
    const SHOW_AHEAD = 6;
    const tileLights = [];

    for (let i = safePos; i <= Math.min(tilesOnPath.length - 1, safePos + SHOW_AHEAD); i++) {
      const tileId = tilesOnPath[i];
      if (tileId == null) continue;
      const tile = getTileById(tileId);
      const catHex = CAT_COLOR[tile.category] || pathNeon;
      const tColor = mkColor(catHex);
      const isCurrent = i === safePos;
      const zPos = -(i - safePos) * (TILE_D + TILE_GAP);

      // Panel body
      const panelGeo = new THREE.BoxGeometry(TILE_W, TILE_H_3D, TILE_D);
      const panelMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0x101e3c : 0x060b18,
        emissive: tColor,
        emissiveIntensity: isCurrent ? 0.28 : 0.10,
        roughness: 0.2, metalness: 0.75,
      });
      const panel = new THREE.Mesh(panelGeo, panelMat);
      panel.position.set(0, TILE_H_3D / 2, zPos);
      panel.receiveShadow = true;
      scene.add(panel);

      // Canvas texture on top face of panel
      const cv = makeTileCanvas(tile, i + 1, isCurrent, catHex);
      const tex = new THREE.CanvasTexture(cv);
      const topMat = new THREE.MeshStandardMaterial({
        map: tex, emissiveMap: tex,
        emissive: new THREE.Color(0.5, 0.5, 0.5),
        emissiveIntensity: isCurrent ? 0.55 : 0.30,
        roughness: 0.15, metalness: 0.3,
      });
      const topFace = new THREE.Mesh(new THREE.PlaneGeometry(TILE_W - 0.08, TILE_D - 0.08), topMat);
      topFace.rotation.x = -Math.PI / 2;
      topFace.position.set(0, TILE_H_3D + 0.001, zPos);
      scene.add(topFace);

      // Neon border edges
      const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(TILE_W + 0.04, TILE_H_3D + 0.06, TILE_D + 0.04));
      const edgeMat = new THREE.LineBasicMaterial({ color: tColor, linewidth: 2 });
      const edges = new THREE.LineSegments(edgeGeo, edgeMat);
      edges.position.set(0, TILE_H_3D / 2, zPos);
      scene.add(edges);

      // Ground reflection/glow beneath
      const glowGeo = new THREE.PlaneGeometry(TILE_W * 1.5, TILE_D * 1.6);
      const glowMat = new THREE.MeshBasicMaterial({ color: tColor, transparent: true, opacity: isCurrent ? 0.20 : 0.07 });
      const glow = new THREE.Mesh(glowGeo, glowMat);
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(0, -0.005, zPos);
      scene.add(glow);

      // Point light under active tile
      if (isCurrent) {
        const tileLight = new THREE.PointLight(tColor, 5, 6);
        tileLight.position.set(0, 1.2, zPos);
        scene.add(tileLight);
        tileLights.push(tileLight);
      }
    }

    // ── PAWN (ball on pedestal) ───────────────────────────────────────────────
    const pawnGroup = new THREE.Group();
    scene.add(pawnGroup);
    pawnGroup.position.set(0, 0, -0.2);

    // Pedestal stem
    const stemMat = new THREE.MeshStandardMaterial({ color: pawnC, emissive: pawnC, emissiveIntensity: 0.3, metalness: 0.85, roughness: 0.15 });
    const stemTop = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.55, 20), stemMat);
    stemTop.position.y = 0.28;
    pawnGroup.add(stemTop);

    // Ball
    const ballMat = new THREE.MeshStandardMaterial({
      color: pawnC, emissive: pawnC, emissiveIntensity: 0.4,
      roughness: 0.06, metalness: 0.7, envMapIntensity: 1.5,
    });
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.62, 40, 40), ballMat);
    ball.position.y = 0.62 + 0.55;
    ball.castShadow = true;
    pawnGroup.add(ball);

    // Specular highlight
    const specMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 });
    const spec = new THREE.Mesh(new THREE.SphereGeometry(0.20, 12, 12), specMat);
    spec.position.set(-0.22, 0.62 + 0.55 + 0.32, 0.34);
    pawnGroup.add(spec);

    // Pawn glow light
    const pawnLight = new THREE.PointLight(pawnC, 5, 5);
    pawnLight.position.set(0, 1.6, 0);
    pawnGroup.add(pawnLight);

    // Shadow pool
    const shadowMat = new THREE.MeshBasicMaterial({ color: pawnC, transparent: true, opacity: 0.25 });
    const shadowPool = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.1), shadowMat);
    shadowPool.rotation.x = -Math.PI / 2;
    shadowPool.position.y = 0.002;
    scene.add(shadowPool);

    // ── NEON BILLBOARD SIGNS (3D boxes on sides of road) ─────────────────────
    const signDefs = [
      { text: 'HUSTLE\nHARD',          x: -7.2, y: 5.5, z: -7,  col: '#f472b6', big: true  },
      { text: 'NO RISK\nNO REWARD',    x: -7.0, y: 3.4, z: -15, col: '#a855f7', big: false },
      { text: 'KEEP MOVING\nFORWARD',  x: -7.2, y: 3.0, z: -24, col: '#38bdf8', big: false },
      { text: 'INVEST IN\nYOURSELF',   x: -7.0, y: 4.8, z: -32, col: '#34d399', big: true  },
      { text: 'FOCUS\nDISCIPLINE\nDESTINY',  x: 7.2, y: 6.5, z: -6,  col: '#34d399', big: true  },
      { text: 'OPPORTUNITY\nIS EVERYWHERE',   x: 7.0, y: 5.0, z: -14, col: '#38bdf8', big: true  },
      { text: 'LIVE YOUR\nDREAMS',            x: 7.2, y: 3.8, z: -22, col: '#f472b6', big: false },
      { text: '24/7\nMINDSET',                x: 7.0, y: 3.2, z: -30, col: '#fbbf24', big: false },
    ];

    signDefs.forEach(({ x, y, z, col, big }) => {
      const sw = big ? 3.8 : 3.2, sh = big ? 2.0 : 1.5;
      const sc = mkColor(col);

      // Sign backing
      const sGeo = new THREE.BoxGeometry(sw, sh, 0.12);
      const sMat = new THREE.MeshStandardMaterial({
        color: 0x010410, emissive: sc, emissiveIntensity: 0.35,
        roughness: 0.4, metalness: 0.3,
      });
      const signMesh = new THREE.Mesh(sGeo, sMat);
      signMesh.position.set(x, y, z);
      if (x < 0) signMesh.rotation.y = 0.15;
      else signMesh.rotation.y = -0.15;
      scene.add(signMesh);

      // Canvas text on sign face
      const sc2 = document.createElement('canvas');
      sc2.width = 256; sc2.height = big ? 160 : 128;
      const sctx = sc2.getContext('2d');
      sctx.fillStyle = '#010308';
      sctx.fillRect(0, 0, sc2.width, sc2.height);
      sctx.strokeStyle = col;
      sctx.lineWidth = 4;
      sctx.shadowColor = col;
      sctx.shadowBlur = 18;
      sctx.strokeRect(4, 4, sc2.width - 8, sc2.height - 8);
      sctx.font = `900 ${big ? 32 : 26}px Arial`;
      sctx.fillStyle = col;
      sctx.textAlign = 'center';
      const slines = ({ text: signDefs.find(s => s.x === x && s.z === z)?.text || '' }).text.split('\n');
      // We just re-use the col and geometry label approach
      slines.forEach((l, i) => {
        sctx.fillText(l, sc2.width / 2, (big ? 46 : 36) + i * (big ? 38 : 32));
      });
      const stex = new THREE.CanvasTexture(sc2);
      const faceMat = new THREE.MeshStandardMaterial({ map: stex, emissiveMap: stex, emissive: new THREE.Color(0.4, 0.4, 0.4), emissiveIntensity: 0.7, transparent: true });
      const faceMesh = new THREE.Mesh(new THREE.PlaneGeometry(sw - 0.06, sh - 0.06), faceMat);
      faceMesh.position.set(x, y, z + (x > 0 ? -0.07 : 0.07));
      if (x < 0) faceMesh.rotation.y = 0.15;
      else faceMesh.rotation.y = Math.PI + (-0.15);
      scene.add(faceMesh);

      // Sign frame glow
      const frameGeo = new THREE.EdgesGeometry(sGeo);
      const frameMat = new THREE.LineBasicMaterial({ color: sc });
      const frame = new THREE.LineSegments(frameGeo, frameMat);
      frame.position.set(x, y, z);
      if (x < 0) frame.rotation.y = 0.15; else frame.rotation.y = -0.15;
      scene.add(frame);

      // Sign point light
      const sl = new THREE.PointLight(sc, 2.5, 9);
      sl.position.set(x, y, z + (x < 0 ? 0.8 : -0.8));
      scene.add(sl);
    });

    // ── RAIN PARTICLES ────────────────────────────────────────────────────────
    const RAIN_COUNT = 3000;
    const rainGeo = new THREE.BufferGeometry();
    const rPos = new Float32Array(RAIN_COUNT * 3);
    for (let i = 0; i < RAIN_COUNT; i++) {
      rPos[i * 3]     = (Math.random() - 0.5) * 50;
      rPos[i * 3 + 1] = Math.random() * 28;
      rPos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 20;
    }
    rainGeo.setAttribute('position', new THREE.BufferAttribute(rPos, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x8ab4d4, size: 0.055, transparent: true, opacity: 0.38 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    // ── SKY STARS ─────────────────────────────────────────────────────────────
    const STAR_COUNT = 400;
    const starGeo = new THREE.BufferGeometry();
    const sPos = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      sPos[i * 3]     = (Math.random() - 0.5) * 120;
      sPos[i * 3 + 1] = 20 + Math.random() * 40;
      sPos[i * 3 + 2] = -10 - Math.random() * 100;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.14, transparent: true, opacity: 0.65 })));

    // ── MOVING CARS ───────────────────────────────────────────────────────────
    const cars = [];
    [{ lx: -2.6, dir: 1, z0: -40, speed: 0.18, col: 0x111827 }, { lx: 2.6, dir: -1, z0: -20, speed: 0.21, col: 0x1e1035 }].forEach(cfg => {
      const carGeo = new THREE.BoxGeometry(1.1, 0.5, 2.2);
      const carMat = new THREE.MeshStandardMaterial({ color: cfg.col, metalness: 0.9, roughness: 0.2 });
      const car = new THREE.Mesh(carGeo, carMat);
      car.position.set(cfg.lx, 0.26, cfg.z0);
      scene.add(car);

      [-0.35, 0.35].forEach(ox => {
        const hlCol = cfg.dir > 0 ? 0xfef3c7 : 0xff3322;
        const hlMat = new THREE.MeshStandardMaterial({ color: hlCol, emissive: new THREE.Color(hlCol), emissiveIntensity: 3 });
        const hl = new THREE.Mesh(new THREE.SphereGeometry(0.11, 8, 8), hlMat);
        hl.position.set(cfg.lx + ox, 0.28, cfg.z0 + cfg.dir * 1.2);
        scene.add(hl);
        cars.push({ mesh: hl, car, cfg, ox, isLight: true });
      });
      cars.push({ mesh: car, car, cfg, isLight: false });
    });

    // ── ANIMATION LOOP ────────────────────────────────────────────────────────
    let animId;
    let t = 0;
    const rainArr = rainGeo.attributes.position.array;
    const hopRef = { val: hopping };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      t += 0.016;

      // Pawn bob / hop
      const hopAmp = hopRef.val ? 1.1 : 0.14;
      const bobY = Math.sin(t * (hopRef.val ? 6 : 1.8)) * hopAmp;
      pawnGroup.position.y = Math.max(0, bobY);

      // Neon pulse
      keyLight.intensity = 5 + Math.sin(t * 2.5) * 1.2;
      tileLights.forEach(tl => { tl.intensity = 4.5 + Math.sin(t * 3.1) * 1.0; });

      // Rain fall
      for (let i = 0; i < RAIN_COUNT; i++) {
        rainArr[i * 3 + 1] -= 0.30;
        if (rainArr[i * 3 + 1] < -0.5) rainArr[i * 3 + 1] = 26;
      }
      rainGeo.attributes.position.needsUpdate = true;

      // Cars
      cars.forEach(({ mesh, cfg, ox, isLight }) => {
        mesh.position.z += cfg.speed * cfg.dir;
        if (isLight) mesh.position.set(cfg.lx + ox, 0.28, mesh.position.z);
        if (cfg.dir > 0 && mesh.position.z > 12) mesh.position.z = -70;
        if (cfg.dir < 0 && mesh.position.z < -70) mesh.position.z = 12;
      });

      renderer.render(scene, camera);
    };
    animate();
    stateRef.current = { hopRef };

    const onResize = () => {
      const w2 = el.clientWidth, h2 = el.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  // Re-mount when tile position or path color changes
  }, [safePos, tilesOnPath.length, pathNeon, currentPlayer.color, currentPlayer.id]);

  // Update hop ref without remounting
  useEffect(() => {
    if (stateRef.current.hopRef) stateRef.current.hopRef.val = hopping;
  }, [hopping]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}

// ─── Neon sign overlay (CSS, flanking the 3D view) ───────────────────────────
function NeonSignOverlay({ text, color, style }) {
  const lines = text.split('\n');
  return (
    <motion.div className="absolute flex flex-col items-center justify-center rounded-xl border font-black uppercase text-center pointer-events-none select-none"
      style={{
        ...style,
        minWidth: 76, padding: '7px 11px',
        fontSize: 9, letterSpacing: '0.11em', lineHeight: 1.32,
        color, borderColor: `${color}55`,
        background: 'rgba(0,1,8,0.90)',
        boxShadow: `0 0 20px ${color}66, 0 0 44px ${color}1a, inset 0 0 10px ${color}0d`,
        textShadow: `0 0 10px ${color}`,
        backdropFilter: 'blur(4px)', zIndex: 28,
      }}
      animate={{ opacity: [0.42, 1, 0.35, 0.88, 0.42] }}
      transition={{ duration: 3.5 + Math.random() * 1.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      {lines.map((l, i) => <span key={i}>{l}</span>)}
    </motion.div>
  );
}

// ─── Main exported component ──────────────────────────────────────────────────
export function RoadView({ paths, activePathTiles, players, currentPlayerIndex, focusedPathIndex, getTileById, categoryStyles, playerColors }) {
  const currentPlayer = players[currentPlayerIndex];

  const activePathIdx = (focusedPathIndex !== null && focusedPathIndex !== undefined)
    ? focusedPathIndex
    : (currentPlayer.pathIndex ?? 0);

  const pathNeon = ['#a855f7', '#ec4899', '#f97316'][activePathIdx] ?? '#a855f7';
  const tilesOnPath = activePathTiles[activePathIdx] ?? [];

  const { displayPos, hopping } = useStepAnimation(
    currentPlayer.position,
    `${currentPlayer.id}-${activePathIdx}`
  );
  const safePos = Math.max(0, Math.min(displayPos, tilesOnPath.length - 1));

  const progressPct = tilesOnPath.length > 1 ? Math.round((safePos / (tilesOnPath.length - 1)) * 100) : 0;
  const pathName  = paths[activePathIdx]?.name ?? 'Life';
  const pathEmoji = paths[activePathIdx]?.emoji ?? '🏙️';
  const currentTile = getTileById(tilesOnPath[safePos] ?? 0);
  const curNeon = CAT_COLOR[currentTile?.category] || pathNeon;

  return (
    <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 5 }}>

      {/* ── THREE.JS SCENE fills the whole board area ── */}
      <ThreeScene
        tilesOnPath={tilesOnPath}
        safePos={safePos}
        getTileById={getTileById}
        pathNeon={pathNeon}
        currentPlayer={currentPlayer}
        hopping={hopping}
      />

      {/* ── CSS neon sign overlays on top of 3D scene ── */}
      <NeonSignOverlay text={'HUSTLE\nHARD'}          color="#f472b6" style={{ left: 4,  top: '12%' }} />
      <NeonSignOverlay text={'NO RISK\nNO REWARD'}    color="#a855f7" style={{ left: 4,  top: '32%' }} />
      <NeonSignOverlay text={'KEEP\nMOVING\nFORWARD'} color="#38bdf8" style={{ left: 4,  top: '52%' }} />
      <NeonSignOverlay text={'INVEST IN\nYOURSELF'}   color="#34d399" style={{ left: 4,  top: '70%' }} />
      <NeonSignOverlay text={'FOCUS\nDISCIPLINE\nDESTINY'}  color="#34d399" style={{ right: 4, top: '10%' }} />
      <NeonSignOverlay text={'OPPORTUNITY\nIS EVERYWHERE'}   color="#38bdf8" style={{ right: 4, top: '30%' }} />
      <NeonSignOverlay text={'LIVE YOUR\nDREAMS'}            color="#f472b6" style={{ right: 4, top: '50%' }} />
      <NeonSignOverlay text={'NO RISK\nNO REWARD'}           color="#fbbf24" style={{ right: 4, top: '68%' }} />

      {/* ── "Trippin' Through Life" floating title at horizon ── */}
      <motion.div className="absolute font-black text-center rounded-2xl border px-5 py-2 pointer-events-none select-none"
        style={{
          top: '9%', left: '50%', transform: 'translateX(-50%)',
          fontSize: 12, letterSpacing: '0.18em', color: pathNeon,
          borderColor: `${pathNeon}44`, background: 'rgba(0,0,6,0.88)',
          boxShadow: `0 0 32px ${pathNeon}66, 0 0 64px ${pathNeon}22`,
          textShadow: `0 0 16px ${pathNeon}`, whiteSpace: 'nowrap', zIndex: 35,
        }}
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 3.2, repeat: Infinity }}
      >
        ✦ Trippin' Through Life ✦
      </motion.div>

      {/* ── Header bar ── */}
      <div className="absolute top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-1.5"
        style={{ background: 'rgba(0,0,6,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${pathNeon}30` }}>
        <div className="flex items-center gap-2">
          <span style={{ fontSize: 14 }}>{pathEmoji}</span>
          <div>
            <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.22em', textTransform: 'uppercase' }}>YOUR PATH</p>
            <p style={{ fontSize: 11, fontWeight: 900, color: '#fff' }}>{pathName}</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-0.5">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
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
          <span style={{ fontSize: 14, fontWeight: 900, color: (currentPlayer.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
            ${currentPlayer.money?.toLocaleString?.() ?? 0}
          </span>
          {currentPlayer.job && <span style={{ fontSize: 12 }}>{currentPlayer.job.emoji}</span>}
        </div>
      </div>

      {/* ── Bottom player chips bar ── */}
      <div className="absolute bottom-0 inset-x-0 z-40 flex items-center gap-3 px-4 py-2"
        style={{ background: 'rgba(0,0,6,0.94)', backdropFilter: 'blur(20px)', borderTop: `1px solid ${pathNeon}28` }}>
        <div className="flex gap-2 flex-1 flex-wrap">
          {players.map((p, i) => {
            const hex = PAWN_HEX[p.color] || '#a855f7';
            const isActive = i === currentPlayerIndex;
            return (
              <div key={p.id} className="flex items-center gap-1.5 rounded-lg px-2 py-1"
                style={{ background: isActive ? `${hex}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${isActive ? hex + 'aa' : 'rgba(255,255,255,0.07)'}` }}>
                <div className="rounded-full flex items-center justify-center font-black text-white overflow-hidden flex-shrink-0"
                  style={{ width: 20, height: 20, fontSize: 8, background: `radial-gradient(circle at 35% 35%, ${hex}ee, ${hex}88)`, border: '1px solid rgba(255,255,255,0.5)' }}>
                  {p.avatar ? <img src={p.avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : p.name.charAt(0)}
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.80)' }}>{p.name.split(' ')[0]}</span>
                <span style={{ fontSize: 9, fontWeight: 900, color: (p.money ?? 0) < 0 ? '#f87171' : '#34d399' }}>
                  ${p.money?.toLocaleString?.() ?? p.money ?? 0}
                </span>
              </div>
            );
          })}
        </div>
        <div className="text-right flex-shrink-0">
          <p style={{ fontSize: 6, fontWeight: 900, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>NOW ON</p>
          <p style={{ fontSize: 10, fontWeight: 900, color: curNeon, textShadow: `0 0 8px ${curNeon}` }}>{currentTile?.name}</p>
        </div>
      </div>
    </div>
  );
}