import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * 3D Game Board - "Trippin' Through Life"
 * Interactive board game inspired by Game of Life
 * Colorful tiles with events, dice, pawn movement, downtown backdrop
 */
export default function Board3D({ position, diceResult, isMoving, pawnColor }) {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const timeRef = useRef(0);
  const pawnRef = useRef(null);
  const diceRef = useRef([]);
  const tilesRef = useRef([]);
  const pedestriansRef = useRef([]);
  const carsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    scene.fog = new THREE.Fog(0x87ceeb, 300, 500);
    sceneRef.current = scene;

    // Camera - positioned to see the board clearly
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 25, 35);
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(100, 80, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;
    directionalLight.shadow.camera.far = 300;
    scene.add(directionalLight);

    // ===== GROUND =====
    const groundGeometry = new THREE.PlaneGeometry(300, 300);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // ===== GAME BOARD TILES =====
    const TILES = 24;
    const getTilePosition = (index) => {
      const cols = 6;
      const rows = 4;
      const tileSize = 3;
      const boardWidth = cols * tileSize;
      const boardHeight = rows * tileSize;
      
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const x = -boardWidth / 2 + col * tileSize + tileSize / 2;
      const z = -boardHeight / 2 + row * tileSize + tileSize / 2;
      
      return { x, z };
    };

    const tileDescriptions = [
      'Study Hard\nPay Off\n+$150',
      'Got a\nPart-Time Job\n+$120',
      'Side Hustle\nSuccess\n+$300',
      'Car Broke\nDown\n-$200',
      'Invest in\nYourself\n+$250',
      'Lucky Day!\n+$100',
      'School\nSupplies\n-$50',
      'Promotion!\n+$400',
      'Coffee\nRun\n-$20',
      'Bonus Check\n+$500',
      'Unexpected\nExpense\n-$150',
      'Freelance\nWork\n+$200',
      'Rest Day\nNo Change',
      'Learning\nCourse\n-$80',
      'Big Win!\n+$600',
      'Life Event\nConsider',
      'Market\nDownturn\n-$100',
      'New Skills\n+$180',
      'Help Friend\nChoose Path',
      'Opportunity\n+$350',
      'Setback\n-$250',
      'Luck\nRolls\nAgain',
      'Final\nChoice',
      'Life\nComplete!',
    ];

    const tileColors = [
      0xff1493, // pink
      0xff1493, // pink
      0xffaa00, // orange
      0xffaa00, // orange
      0x00ddff, // cyan
      0x00ddff, // cyan
      0xffdd00, // yellow
      0xffdd00, // yellow
      0xff1493, // pink
      0xff1493, // pink
      0xffaa00, // orange
      0xffaa00, // orange
      0x00ddff, // cyan
      0x00ddff, // cyan
      0xffdd00, // yellow
      0xffdd00, // yellow
      0xff1493, // pink
      0xff1493, // pink
      0xffaa00, // orange
      0xffaa00, // orange
      0x00ddff, // cyan
      0x00ddff, // cyan
      0xffdd00, // yellow
      0x00ff88, // green - finish
    ];

    for (let i = 0; i < TILES; i++) {
      const pos = getTilePosition(i);
      const color = tileColors[i];

      // Tile base
      const tileGeometry = new THREE.BoxGeometry(2.8, 0.4, 2.8);
      const tileMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.3,
      });
      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(pos.x, 0.2, pos.z);
      tile.castShadow = true;
      tile.receiveShadow = true;
      scene.add(tile);

      // Glow light
      const tileLight = new THREE.PointLight(color, 0.8, 30);
      tileLight.position.set(pos.x, 5, pos.z);
      scene.add(tileLight);

      // Canvas texture for text
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, 512, 512);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const lines = tileDescriptions[i].split('\n');
      const lineHeight = 120;
      lines.forEach((line, idx) => {
        ctx.fillText(line, 256, 256 - (lines.length - 1) * lineHeight / 2 + idx * lineHeight);
      });

      const texture = new THREE.CanvasTexture(canvas);
      const textMaterial = new THREE.MeshBasicMaterial({ map: texture });
      const textGeometry = new THREE.PlaneGeometry(2.6, 2.6);
      const textMesh = new THREE.Mesh(textGeometry, textMaterial);
      textMesh.position.set(pos.x, 0.25, pos.z);
      scene.add(textMesh);

      tilesRef.current.push({ mesh: tile, textMesh });
    }

    // ===== DICE (2 large 3D dice) =====
    const createDice = (xOffset) => {
      const diceGroup = new THREE.Group();
      
      const diceGeometry = new THREE.BoxGeometry(2, 2, 2);
      const diceMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.3,
        roughness: 0.4,
      });
      const diceMesh = new THREE.Mesh(diceGeometry, diceMaterial);
      diceMesh.castShadow = true;
      diceMesh.receiveShadow = true;
      diceGroup.add(diceMesh);

      // Dice dots
      for (let face = 0; face < 6; face++) {
        const dotCount = [1, 2, 3, 4, 5, 6][face];
        for (let d = 0; d < dotCount; d++) {
          const dotGeometry = new THREE.SphereGeometry(0.15, 8, 8);
          const dotMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
          const dot = new THREE.Mesh(dotGeometry, dotMaterial);
          
          // Position dots on faces
          const positions = {
            1: [[0, 0]],
            2: [[-0.6, -0.6], [0.6, 0.6]],
            3: [[-0.6, -0.6], [0, 0], [0.6, 0.6]],
            4: [[-0.6, -0.6], [-0.6, 0.6], [0.6, -0.6], [0.6, 0.6]],
            5: [[-0.6, -0.6], [-0.6, 0.6], [0, 0], [0.6, -0.6], [0.6, 0.6]],
            6: [[-0.6, -0.6], [-0.6, 0], [-0.6, 0.6], [0.6, -0.6], [0.6, 0], [0.6, 0.6]],
          };
          
          const [px, py] = positions[dotCount][d];
          dot.position.set(px, py, 1.1);
          diceGroup.add(dot);
        }
      }

      diceGroup.position.set(xOffset, 2, -10);
      scene.add(diceGroup);
      
      return { group: diceGroup, rotationX: 0, rotationY: 0, rotationZ: 0 };
    };

    diceRef.current = [createDice(-4), createDice(4)];

    // ===== PAWN =====
    const pawnGeometry = new THREE.ConeGeometry(0.8, 2.5, 32);
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
      emissiveIntensity: 0.8,
      metalness: 0.6,
      roughness: 0.1,
    });
    const pawn = new THREE.Mesh(pawnGeometry, pawnMaterial);
    pawn.castShadow = true;
    pawn.receiveShadow = true;
    pawn.position.set(0, 1.3, 0);
    scene.add(pawn);
    pawnRef.current = pawn;

    const pawnLight = new THREE.PointLight(pawnColor_val, 2, 50);
    pawnLight.position.set(0, 5, 0);
    scene.add(pawnLight);

    // ===== BACKGROUND CITY ELEMENTS =====
    // Buildings
    const buildingConfigs = [
      { x: -80, z: 0, w: 20, h: 80, d: 15, color: 0x1a1a2e },
      { x: 80, z: 0, w: 20, h: 80, d: 15, color: 0x1a1a2e },
      { x: 0, z: -80, w: 60, h: 100, d: 15, color: 0x2a2a3e },
      { x: 0, z: 80, w: 60, h: 90, d: 15, color: 0x1a1a2e },
    ];

    buildingConfigs.forEach((cfg) => {
      const buildingGeometry = new THREE.BoxGeometry(cfg.w, cfg.h, cfg.d);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: cfg.color,
        roughness: 0.9,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(cfg.x, cfg.h / 2, cfg.z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Window lights
      const windowRows = Math.floor(cfg.h / 5);
      const windowCols = Math.floor(cfg.w / 4);
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          const light = new THREE.PointLight(0xffdd99, 0.6, 40);
          light.position.set(
            cfg.x - cfg.w / 2 + (col + 0.5) * 4,
            (row + 1) * 5,
            cfg.z + cfg.d / 2 + 2
          );
          scene.add(light);
        }
      }
    });

    // Billboards
    const billboardConfigs = [
      { x: -120, z: -60, colors: [0xff1493, 0xffaa00], text: 'TRIPPIN\' THROUGH LIFE' },
      { x: 120, z: 60, colors: [0x00ddff, 0xff00ff], text: 'MAKE CHOICES' },
      { x: -130, z: 60, colors: [0xffdd00, 0xff6600], text: 'BUILD YOUR FUTURE' },
    ];

    billboardConfigs.forEach((cfg) => {
      const poleGeometry = new THREE.CylinderGeometry(1, 1.2, 50, 16);
      const poleMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
      const pole = new THREE.Mesh(poleGeometry, poleMaterial);
      pole.position.set(cfg.x, 25, cfg.z);
      pole.castShadow = true;
      scene.add(pole);

      const boardGeometry = new THREE.PlaneGeometry(30, 20);
      const boardMaterial = new THREE.MeshBasicMaterial({
        color: cfg.colors[0],
        emissive: cfg.colors[0],
      });
      const board = new THREE.Mesh(boardGeometry, boardMaterial);
      board.position.set(cfg.x, 50, cfg.z - 5);
      scene.add(board);

      const boardLight = new THREE.PointLight(cfg.colors[0], 2.5, 150);
      boardLight.position.set(cfg.x, 50, cfg.z);
      scene.add(boardLight);
    });

    // Pedestrians
    for (let i = 0; i < 15; i++) {
      const group = new THREE.Group();
      
      const bodyGeometry = new THREE.CylinderGeometry(0.35, 0.3, 1, 16);
      const bodyColors = [0xff88cc, 0x88ccff, 0x88ff88, 0xffcc88];
      const bodyMaterial = new THREE.MeshStandardMaterial({
        color: bodyColors[i % bodyColors.length],
        roughness: 0.8,
      });
      const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
      body.position.y = 0.5;
      body.castShadow = true;
      group.add(body);

      const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
      const headMaterial = new THREE.MeshStandardMaterial({
        color: 0xffdbac,
        roughness: 0.6,
      });
      const head = new THREE.Mesh(headGeometry, headMaterial);
      head.position.y = 1.3;
      head.castShadow = true;
      group.add(head);

      scene.add(group);
      pedestriansRef.current.push({
        group,
        x: Math.random() * 200 - 100,
        z: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 0.1,
        vz: (Math.random() - 0.5) * 0.1,
      });
    }

    // Cars
    for (let i = 0; i < 4; i++) {
      const carGeometry = new THREE.BoxGeometry(2.5, 1.5, 5);
      const carMaterial = new THREE.MeshStandardMaterial({
        color: [0xffff00, 0xff1493, 0x00ddff][i % 3],
        metalness: 0.8,
        roughness: 0.1,
      });
      const car = new THREE.Mesh(carGeometry, carMaterial);
      car.castShadow = true;
      car.receiveShadow = true;
      scene.add(car);

      carsRef.current.push({
        mesh: car,
        x: Math.random() * 100 - 50,
        z: -100 + i * 30,
        speed: 0.2 + Math.random() * 0.1,
      });
    }

    // ===== ANIMATION LOOP =====
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      timeRef.current += 0.016;

      // Dice rolling animation
      if (isMoving && diceResult) {
        diceRef.current.forEach((dice) => {
          dice.group.rotation.x += 0.1;
          dice.group.rotation.y += 0.1;
          dice.group.rotation.z += 0.05;
        });
      }

      // Pawn movement
      if (pawnRef.current && position !== undefined) {
        const targetPos = getTilePosition(Math.min(position, TILES - 1));
        pawnRef.current.position.x += (targetPos.x - pawnRef.current.position.x) * 0.15;
        pawnRef.current.position.z += (targetPos.z - pawnRef.current.position.z) * 0.15;
        pawnRef.current.position.y = 1.3 + Math.sin(timeRef.current * 3) * 0.4;
        
        pawnLight.position.copy(pawnRef.current.position);
        pawnLight.position.y += 8;
      }

      // Tile highlight for current position
      tilesRef.current.forEach((tile, idx) => {
        const isCurrentTile = idx === Math.min(Math.floor(position), TILES - 1);
        if (isCurrentTile) {
          tile.mesh.material.emissiveIntensity = 0.8 + Math.sin(timeRef.current * 4) * 0.3;
        } else {
          tile.mesh.material.emissiveIntensity = 0.4;
        }
      });

      // Pedestrians wander
      pedestriansRef.current.forEach((ped) => {
        ped.x += ped.vx;
        ped.z += ped.vz;
        if (ped.x > 150 || ped.x < -150) ped.vx *= -1;
        if (ped.z > 150 || ped.z < -150) ped.vz *= -1;
        ped.group.position.set(ped.x, 0.4 + Math.sin(timeRef.current * 2 + ped.x) * 0.1, ped.z);
      });

      // Cars drive
      carsRef.current.forEach((car) => {
        car.x += car.speed;
        if (car.x > 100) car.x = -100;
        car.mesh.position.set(car.x, 1, car.z);
      });

      renderer.render(scene, camera);
    };
    animate();

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
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [position, isMoving, diceResult, pawnColor]);

  return <div ref={containerRef} className="w-full h-full" />;
}