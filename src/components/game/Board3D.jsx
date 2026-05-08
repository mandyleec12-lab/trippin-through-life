import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Downtown City World
 * Inspired by vibrant, neon-lit streets with bustling pedestrians,
 * animated billboards, lit buildings, and a real game board path.
 */
export default function Board3D({ position, diceResult, isMoving, pawnColor }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const timeRef = useRef(0);
  const pawnRef = useRef(null);
  const billboardsRef = useRef([]);
  const pedestriansRef = useRef([]);
  const carsRef = useRef([]);
  const windowLightsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup with blue sky backdrop
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 200, 400);
    sceneRef.current = scene;

    // Camera - looking down at the street
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 20, 25);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ===== LIGHTING =====
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(50, 50, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 200;
    directionalLight.shadow.bias = -0.0005;
    scene.add(directionalLight);

    // ===== GROUND (STREET) =====
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x333333,
      roughness: 0.7,
      metalness: 0,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ===== GAME BOARD PATH (curved, colorful) =====
    const TILES = 30;
    const tileSize = 2;
    const getTilePosition = (index) => {
      const progress = index / (TILES - 1);
      const z = 40 - progress * 60;
      const x = Math.sin(progress * Math.PI * 2) * 15;
      return { x, z };
    };

    const tileColors = [0xff1493, 0xff6600, 0x00ddff, 0xffdd00];
    for (let i = 0; i < TILES; i++) {
      const pos = getTilePosition(i);
      const color = tileColors[i % 4];

      const tileGeometry = new THREE.BoxGeometry(tileSize + 0.3, 0.5, tileSize + 0.3);
      const tileMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        metalness: 0.6,
        roughness: 0.2,
      });
      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(pos.x, 0.25, pos.z);
      tile.castShadow = true;
      tile.receiveShadow = true;
      scene.add(tile);

      // Glowing light for each tile
      const tileLight = new THREE.PointLight(color, 1, 20);
      tileLight.position.set(pos.x, 5, pos.z);
      scene.add(tileLight);
    }

    // ===== TALL BUILDINGS WITH LIT WINDOWS =====
    const buildingConfigs = [
      { x: -40, z: 0, w: 15, h: 60, d: 10 },
      { x: 40, z: 5, w: 18, h: 70, d: 10 },
      { x: -50, z: 50, w: 12, h: 50, d: 8 },
      { x: 50, z: -50, w: 16, h: 65, d: 9 },
      { x: -45, z: -50, w: 14, h: 55, d: 8 },
      { x: 45, z: 50, w: 20, h: 75, d: 10 },
    ];

    buildingConfigs.forEach((cfg) => {
      const buildingGeometry = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.9,
        metalness: 0.1,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(cfg.x, cfg.h / 2, cfg.z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Window grid with warm lights
      const windowRows = Math.floor(cfg.h / 4);
      const windowCols = Math.floor(cfg.w / 3);
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const light = new THREE.PointLight(0xffcc99, 0.8, 30);
          light.position.set(
            cfg.x - cfg.w / 2 + (col + 0.5) * 3,
            (row + 1) * 4,
            cfg.z + cfg.d / 2 + 1
          );
          scene.add(light);
          windowLightsRef.current.push({ light, time: Math.random() * Math.PI * 2 });
        }
      }
    });

    // ===== MASSIVE NEON BILLBOARDS =====
    const billboardConfigs = [
      { x: -60, z: 20, w: 25, h: 18, colors: [0xff1493, 0xffaa00] },
      { x: 60, z: -30, w: 28, h: 20, colors: [0x00ddff, 0xff00ff] },
      { x: -70, z: -40, w: 22, h: 16, colors: [0xffdd00, 0xff6600] },
      { x: 70, z: 40, w: 26, h: 19, colors: [0xff1493, 0x00ddff] },
    ];

    billboardConfigs.forEach((cfg) => {
      // Create billboard structure
      const poleGeometry = new THREE.CylinderGeometry(1, 1.2, 40, 16);
      const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(cfg.x, 20, cfg.z);
      pole.castShadow = true;
      scene.add(pole);

      // Animated billboard face
      const boardGeometry = new THREE.PlaneGeometry(cfg.w, cfg.h);
      const boardMaterial = new THREE.MeshBasicMaterial({
        color: cfg.colors[0],
        emissive: cfg.colors[0],
        side: THREE.DoubleSide,
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      board.position.set(cfg.x, 40, cfg.z - 3);
      scene.add(board);

      billboardsRef.current.push({
        mesh: board,
        colors: cfg.colors,
        currentColorIdx: 0,
        material: boardMaterial,
      });

      // Bright light from billboard
      const boardLight = new THREE.PointLight(cfg.colors[0], 2, 100);
      boardLight.position.set(cfg.x, 40, cfg.z);
      scene.add(boardLight);
    });

    // ===== STREET LIGHTS =====
    for (let i = -6; i <= 6; i++) {
      const poleGeometry = new THREE.CylinderGeometry(0.5, 0.6, 20, 8);
      const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(i * 20, 10, -80);
      pole.castShadow = true;
      scene.add(pole);

      const lampGeometry = new THREE.SphereGeometry(1.2, 16, 16);
      const lampMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd99 });
      const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
      lamp.position.set(i * 20, 19, -80);
      scene.add(lamp);

      const lampLight = new THREE.PointLight(0xffdd99, 2, 60);
      lampLight.position.set(i * 20, 19, -80);
      scene.add(lampLight);
    }

    // ===== CARS ON STREET =====
    const carPositions = [
      { x: -35, z: -80, direction: 1 },
      { x: 35, z: -70, direction: -1 },
      { x: -25, z: -90, direction: 1 },
    ];

    carPositions.forEach((cfg) => {
      const carGeometry = new THREE.BoxGeometry(2, 1.5, 4);
      const carMaterial = new THREE.MeshStandardMaterial({
        color: [0xffff00, 0xff1493, 0x00ddff][Math.floor(Math.random() * 3)],
        metalness: 0.7,
        roughness: 0.2,
      });
      const car = new THREE.Mesh(carGeometry, carMaterial);
      car.castShadow = true;
      car.receiveShadow = true;
      scene.add(car);

      carsRef.current.push({
        mesh: car,
        x: cfg.x,
        z: cfg.z,
        direction: cfg.direction,
      });
    });

    // ===== PEDESTRIANS (busy street) =====
    for (let i = 0; i < 20; i++) {
      const group = new THREE.Group();

      // Body
      const bodyGeometry = new THREE.CylinderGeometry(0.4, 0.35, 1.2, 16);
      const bodyColors = [0xff88cc, 0x88ccff, 0x88ff88, 0xffcc88, 0xff8888];
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: bodyColors[i % bodyColors.length],
        roughness: 0.8,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.6;
      body.castShadow = true;
      body.receiveShadow = true;
      group.add(body);

      // Head
      const headGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.6,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.5;
      head.castShadow = true;
      head.receiveShadow = true;
      group.add(head);

      scene.add(group);
      pedestriansRef.current.push({
        group,
        x: Math.random() * 80 - 40,
        z: Math.random() * 80 - 40,
        vx: (Math.random() - 0.5) * 0.15,
        vz: (Math.random() - 0.5) * 0.15,
        walkTime: Math.random() * Math.PI * 2,
      });
    }

    // ===== MAIN PAWN =====
    const pawnGeometry = new THREE.ConeGeometry(1, 3, 32);
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
      emissiveIntensity: 0.7,
      metalness: 0.6,
      roughness: 0.1,
    });
    const pawn = new THREE.Mesh(pawnGeometry, pawnMaterial);
    pawn.castShadow = true;
    pawn.receiveShadow = true;
    scene.add(pawn);
    pawnRef.current = pawn;

    const pawnLight = new THREE.PointLight(pawnColor_val, 1.5, 40);
    pawnLight.position.set(0, 5, 0);
    scene.add(pawnLight);

    // ===== ANIMATION LOOP =====
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      // Move pawn
      if (pawnRef.current && position !== undefined) {
        const targetPos = getTilePosition(Math.min(position, TILES - 1));
        pawnRef.current.position.x += (targetPos.x - pawnRef.current.position.x) * 0.1;
        pawnRef.current.position.z += (targetPos.z - pawnRef.current.position.z) * 0.1;
        pawnRef.current.position.y = 1.5 + Math.sin(timeRef.current * 3) * 0.3;

        // Update pawn light
        pawnLight.position.copy(pawnRef.current.position);
        pawnLight.position.y += 8;
      }

      // Animate billboards (blinking/color changing)
      billboardsRef.current.forEach((billboard) => {
        if (Math.sin(timeRef.current * 2) > 0.7 && billboard.material) {
          billboard.currentColorIdx = (billboard.currentColorIdx + 1) % billboard.colors.length;
          const color = billboard.colors[billboard.currentColorIdx];
          billboard.material.color.setHex(color);
          billboard.material.emissive.setHex(color);
        }
      });

      // Flicker window lights
      windowLightsRef.current.forEach((w) => {
        w.light.intensity = 0.6 + Math.sin(w.time + timeRef.current * 3) * 0.4;
      });

      // Move cars
      carsRef.current.forEach((car) => {
        car.x += car.direction * 0.3;
        if (car.direction > 0 && car.x > 80) car.x = -80;
        if (car.direction < 0 && car.x < -80) car.x = 80;
        car.mesh.position.set(car.x, 1, car.z);
      });

      // Move pedestrians
      pedestriansRef.current.forEach((ped) => {
        ped.walkTime += 0.05;
        ped.x += ped.vx;
        ped.z += ped.vz;

        // Bounce off edges
        if (ped.x > 80 || ped.x < -80) ped.vx *= -1;
        if (ped.z > 80 || ped.z < -80) ped.vz *= -1;

        // Walking animation
        ped.group.position.set(
          ped.x,
          0.5 + Math.sin(ped.walkTime) * 0.1,
          ped.z
        );
        ped.group.rotation.y = Math.atan2(ped.vz, ped.vx);
      });

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