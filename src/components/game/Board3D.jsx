import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

/**
 * 3D Board Game using Three.js
 * Neon cyberpunk city aesthetic with colored tile paths
 * Animated dice and moving pawns
 * Rich environmental immersion with buildings, signs, particles, traffic
 */
export default function Board3D({ position, diceResult, isMoving, pawnColor }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const boardRef = useRef(null);
  const diceRef = useRef(null);
  const pawnRef = useRef(null);
  const tilesRef = useRef([]);
  const windowLightsRef = useRef([]);
  const trafficRef = useRef([]);
  const pedestriansRef = useRef([]);
  const particlesRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d1117);
    scene.fog = new THREE.Fog(0x0d1117, 50, 100);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 12, 18);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Advanced Lighting: Warm city glow + neon accents
    const ambientLight = new THREE.AmbientLight(0xff9944, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffcc88, 0.6);
    directionalLight.position.set(10, 15, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.bias = -0.0001;
    scene.add(directionalLight);

    // Neon ambience lights
    const neonLight1 = new THREE.PointLight(0xff00ff, 0.4, 50);
    neonLight1.position.set(-20, 10, -15);
    scene.add(neonLight1);

    const neonLight2 = new THREE.PointLight(0x00ffff, 0.3, 50);
    neonLight2.position.set(20, 10, 25);
    scene.add(neonLight2);

    // Ground (City street with texture)
    const groundGeometry = new THREE.PlaneGeometry(80, 80);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1f3a,
      roughness: 0.6,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ===== STREET ROADS =====
    // Horizontal road (left-right traffic)
    const roadH = new THREE.Mesh(
      new THREE.PlaneGeometry(60, 5),
      new THREE.MeshStandardMaterial({
        color: 0x2a2f3a,
        roughness: 0.8,
        metalness: 0,
      })
    );
    roadH.rotation.x = -Math.PI / 2;
    roadH.position.y = 0.01;
    roadH.position.z = 5;
    roadH.receiveShadow = true;
    scene.add(roadH);

    // Vertical road (forward-backward traffic)
    const roadV = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 50),
      new THREE.MeshStandardMaterial({
        color: 0x2a2f3a,
        roughness: 0.8,
        metalness: 0,
      })
    );
    roadV.rotation.x = -Math.PI / 2;
    roadV.position.y = 0.01;
    roadV.position.x = 5;
    roadV.receiveShadow = true;
    scene.add(roadV);

    // Road markings (center line)
    const lineGeometry = new THREE.PlaneGeometry(58, 0.2);
    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const centerLine = new THREE.Mesh(lineGeometry, lineMaterial);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.y = 0.02;
    centerLine.position.z = 5;
    scene.add(centerLine);

    // Create board tiles along a curved path
    const TILES = 30;
    const tileSize = 1.5;
    tilesRef.current = [];

    const getTilePosition = (index) => {
      const progress = index / (TILES - 1);
      const z = 15 - progress * 28; // Back to front
      const x = Math.sin(progress * Math.PI * 2) * 6; // Meandering
      return { x, z };
    };

    // Tile colors (matching image: pink, orange, cyan, yellow paths)
    const tileColors = [
      0xff1493, // Deep pink
      0xff6600, // Orange
      0x00ddff, // Cyan
      0xffdd00, // Yellow
    ];

    for (let i = 0; i < TILES; i++) {
      const pos = getTilePosition(i);
      const colorIndex = i % 4;
      const color = tileColors[colorIndex];

      // Tile geometry
      const tileGeometry = new THREE.BoxGeometry(tileSize, 0.3, tileSize);
      const tileMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.7,
        metalness: 0.4,
        roughness: 0.3,
      });
      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(pos.x, 0.2, pos.z);
      tile.castShadow = true;
      tile.receiveShadow = true;
      tile.userData.index = i;
      scene.add(tile);
      tilesRef.current.push(tile);

      // Tile glow light
      const tileLight = new THREE.PointLight(color, 0.6, 8);
      tileLight.position.set(pos.x, 2, pos.z);
      scene.add(tileLight);

      // Glow effect for current position
      if (i === Math.floor(position)) {
        const glowGeometry = new THREE.BoxGeometry(tileSize * 1.5, 0.1, tileSize * 1.5);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.4,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos.x, 0.1, pos.z);
        scene.add(glow);
      }
    }
    boardRef.current = tilesRef.current;

    // Create dice
    const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
    const diceMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.5,
      metalness: 0.3,
      roughness: 0.2,
    });
    const dice = new THREE.Mesh(diceGeometry, diceMaterial);
    dice.position.set(-8, 2, 8);
    dice.castShadow = true;
    dice.receiveShadow = true;
    scene.add(dice);
    diceRef.current = dice;

    const diceLight = new THREE.PointLight(0xffffff, 0.8, 15);
    diceLight.position.set(-8, 4, 8);
    scene.add(diceLight);

    // Create pawn
    const pawnGeometry = new THREE.ConeGeometry(0.6, 1.8, 32);
    const colorMap = {
      pink: 0xff1493,
      purple: 0x9933ff,
      blue: 0x0099ff,
      teal: 0x00ffff,
      gold: 0xffdd00,
      coral: 0xff6666,
    };
    const pawnColor_val = colorMap[pawnColor] || colorMap.purple;
    const pawnMaterial = new THREE.MeshStandardMaterial({
      color: pawnColor_val,
      emissive: pawnColor_val,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.15,
    });
    const pawn = new THREE.Mesh(pawnGeometry, pawnMaterial);
    pawn.position.set(getTilePosition(0).x, 1.2, getTilePosition(0).z);
    pawn.castShadow = true;
    pawn.receiveShadow = true;
    scene.add(pawn);
    pawnRef.current = pawn;

    const pawnLight = new THREE.PointLight(pawnColor_val, 0.8, 12);
    pawnLight.position.set(getTilePosition(0).x, 3, getTilePosition(0).z);
    scene.add(pawnLight);

    // ===== CITY BUILDINGS WITH WINDOWS =====
    const buildingConfigs = [
      { x: -25, z: -8, w: 4, h: 15, d: 3 },
      { x: 25, z: -5, w: 5, h: 18, d: 3 },
      { x: -28, z: 25, w: 4, h: 16, d: 3 },
      { x: 28, z: 28, w: 5, h: 14, d: 3 },
      { x: -15, z: -25, w: 6, h: 12, d: 2 },
      { x: 18, z: -28, w: 5, h: 13, d: 2 },
    ];

    buildingConfigs.forEach((cfg) => {
      const buildingGeometry = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x0f1419,
        roughness: 0.95,
        metalness: 0.05,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(cfg.x, cfg.h / 2, cfg.z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Animated window lights
      const windowRows = Math.floor(cfg.h / 1.5);
      const windowCols = Math.floor(cfg.w / 1.2);
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const windowLight = new THREE.PointLight(
            Math.random() > 0.5 ? 0xffcc88 : 0xffaa00,
            Math.random() * 0.3 + 0.2,
            6
          );
          windowLight.position.set(
            cfg.x - cfg.w / 2 + (col + 0.5) * 1.2,
            row * 1.5 + 1,
            cfg.z + cfg.d / 2 + 0.5
          );
          scene.add(windowLight);
          windowLightsRef.current.push(windowLight);
        }
      }

      // Neon billboard on top
      const billboardGeometry = new THREE.PlaneGeometry(cfg.w * 0.9, 2);
      const billboardColor = [0xff1493, 0x00ddff, 0xffdd00, 0xff6600][
        Math.floor(Math.random() * 4)
      ];
      const billboardMaterial = new THREE.MeshBasicMaterial({
        color: billboardColor,
        emissive: billboardColor,
      });
      const billboard = new THREE.Mesh(billboardGeometry, billboardMaterial);
      billboard.position.set(cfg.x, cfg.h + 1.5, cfg.z - cfg.d / 2 - 0.5);
      scene.add(billboard);
    });

    // ===== STREET ELEMENTS =====
    // Streetlights
    const streetLightPositions = [
      { x: -20, z: 0 },
      { x: 20, z: 5 },
      { x: -25, z: 15 },
      { x: 25, z: -10 },
    ];

    streetLightPositions.forEach((pos) => {
      const poleGeometry = new THREE.CylinderGeometry(0.2, 0.25, 8, 8);
      const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(pos.x, 4, pos.z);
      pole.castShadow = true;
      scene.add(pole);

      const lampGeometry = new THREE.SphereGeometry(0.6, 16, 16);
      const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffcc88 });
      const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
      lamp.position.set(pos.x, 7.5, pos.z);
      scene.add(lamp);

      const lampLight = new THREE.PointLight(0xffcc88, 1.2, 20);
      lampLight.position.set(pos.x, 7.5, pos.z);
      scene.add(lampLight);
    });

    // ===== TRAFFIC (Animated cars on roads) =====
    const carColors = [0xff1493, 0x00ddff, 0xffdd00];
    // Horizontal traffic (on road Z=5)
    for (let i = 0; i < 2; i++) {
      const carGeometry = new THREE.BoxGeometry(1, 0.6, 1.8);
      const carMaterial = new THREE.MeshStandardMaterial({
        color: carColors[i],
        emissive: carColors[i],
        emissiveIntensity: 0.4,
      });
      const car = new THREE.Mesh(carGeometry, carMaterial);
      car.castShadow = true;
      car.receiveShadow = true;
      scene.add(car);
      trafficRef.current.push({
        mesh: car,
        position: Math.random() * 40 - 20,
        z: 5,
        x: null,
      });
    }
    // Vertical traffic (on road X=5)
    for (let i = 0; i < 2; i++) {
      const carGeometry = new THREE.BoxGeometry(1.8, 0.6, 1);
      const carMaterial = new THREE.MeshStandardMaterial({
        color: carColors[2],
        emissive: carColors[2],
        emissiveIntensity: 0.4,
      });
      const car = new THREE.Mesh(carGeometry, carMaterial);
      car.castShadow = true;
      car.receiveShadow = true;
      scene.add(car);
      trafficRef.current.push({
        mesh: car,
        position: Math.random() * 30 - 15,
        x: 5,
        z: null,
      });
    }

    // ===== PEDESTRIANS (Walking NPCs) =====
    for (let i = 0; i < 5; i++) {
      // Create simple humanoid (cylinder body + sphere head)
      const group = new THREE.Group();

      const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.25, 0.8, 16);
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: [0xff6666, 0x66ccff, 0x88ff88, 0xffcc66, 0xff88ff][i % 5],
        roughness: 0.7,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.4;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      const headGeometry = new THREE.SphereGeometry(0.2, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.5,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.15;
      head.castShadow = true;
      head.receiveShadow = true;
      group.add(head);

      scene.add(group);
      pedestriansRef.current.push({
        group,
        x: Math.random() * 30 - 15,
        z: Math.random() * 40 - 20,
        vx: (Math.random() - 0.5) * 0.08,
        vz: (Math.random() - 0.5) * 0.08,
        time: Math.random() * Math.PI * 2,
      });
    }

    // ===== FLOATING PARTICLES =====
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 300;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = Math.random() * 40;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ddff,
      size: 0.1,
      transparent: true,
      opacity: 0.6,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016; // ~60fps

      // Rotate dice if rolling
      if (diceRef.current) {
        diceRef.current.rotation.x += 0.05;
        diceRef.current.rotation.y += 0.05;
      }

      // Move pawn along path
      if (pawnRef.current && position !== undefined) {
        const targetPos = getTilePosition(Math.min(position, TILES - 1));
        pawnRef.current.position.x += (targetPos.x - pawnRef.current.position.x) * 0.12;
        pawnRef.current.position.z += (targetPos.z - pawnRef.current.position.z) * 0.12;
      }

      // Animate window lights flickering
      windowLightsRef.current.forEach((light, idx) => {
        light.intensity = 0.2 + Math.sin(timeRef.current * 2 + idx * 0.5) * 0.15;
      });

      // Animate traffic (cars moving)
      trafficRef.current.forEach((car) => {
        if (car.z !== null) {
          // Horizontal traffic
          car.position += 0.15;
          if (car.position > 30) car.position = -30;
          car.mesh.position.set(car.position, 0.5, car.z);
        } else {
          // Vertical traffic
          car.position += 0.15;
          if (car.position > 25) car.position = -25;
          car.mesh.position.set(car.x, 0.5, car.position);
        }
      });

      // Animate pedestrians (walking around city)
      pedestriansRef.current.forEach((ped) => {
        ped.time += 0.02;
        ped.x += ped.vx;
        ped.z += ped.vz;

        // Bounce off edges
        if (ped.x > 30 || ped.x < -30) ped.vx *= -1;
        if (ped.z > 35 || ped.z < -35) ped.vz *= -1;

        // Slight idle animation (bob up/down)
        ped.group.position.set(ped.x, 0.05 + Math.sin(ped.time) * 0.05, ped.z);
        ped.group.rotation.y = Math.atan2(ped.vz, ped.vx);
      });

      // Animate particles (floating/scrolling)
      if (particlesRef.current) {
        const positions = particlesRef.current.geometry.attributes.position.array;
        for (let i = 1; i < positions.length; i += 3) {
          positions[i] -= 0.05;
          if (positions[i] < 0) {
            positions[i] = 40;
          }
        }
        particlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [position, pawnColor]);

  return <div ref={containerRef} className="w-full h-full" />;
}