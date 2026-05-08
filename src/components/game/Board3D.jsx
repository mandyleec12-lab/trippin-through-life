import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

/**
 * 3D Board Game using Three.js
 * Neon cyberpunk city aesthetic with colored tile paths
 * Animated dice and moving pawns
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

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 8, 15);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(40, 40);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x1a1f3a,
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create board tiles along a curved path
    const TILES = 30;
    const tileSize = 1.5;
    tilesRef.current = [];

    const getTilePosition = (index) => {
      const progress = index / (TILES - 1);
      const z = 15 - progress * 25; // Back to front
      const x = Math.sin(progress * Math.PI * 2) * 5; // Meandering
      return { x, z };
    };

    // Tile colors (matching image: pink, orange, cyan, yellow paths)
    const tileColors = [
      0xff00ff, // Magenta
      0xff6600, // Orange
      0x00ddff, // Cyan
      0xffdd00, // Yellow
    ];

    for (let i = 0; i < TILES; i++) {
      const pos = getTilePosition(i);
      const colorIndex = i % 4;
      const color = tileColors[colorIndex];

      // Tile geometry
      const tileGeometry = new THREE.BoxGeometry(tileSize, 0.2, tileSize);
      const tileMaterial = new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.4,
      });
      const tile = new THREE.Mesh(tileGeometry, tileMaterial);
      tile.position.set(pos.x, 0.1, pos.z);
      tile.castShadow = true;
      tile.receiveShadow = true;
      tile.userData.index = i;
      scene.add(tile);
      tilesRef.current.push(tile);

      // Glow effect for current position
      if (i === Math.floor(position)) {
        const glowGeometry = new THREE.BoxGeometry(tileSize * 1.3, 0.1, tileSize * 1.3);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: color,
          transparent: true,
          opacity: 0.3,
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.set(pos.x, 0.05, pos.z);
        scene.add(glow);
      }
    }
    boardRef.current = tilesRef.current;

    // Create dice
    const diceGeometry = new THREE.BoxGeometry(1, 1, 1);
    const diceMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
      metalness: 0.2,
      roughness: 0.3,
    });
    const dice = new THREE.Mesh(diceGeometry, diceMaterial);
    dice.position.set(-8, 2, 8);
    dice.castShadow = true;
    dice.receiveShadow = true;
    scene.add(dice);
    diceRef.current = dice;

    // Create pawn
    const pawnGeometry = new THREE.ConeGeometry(0.5, 1.5, 32);
    const colorMap = {
      pink: 0xff1493,
      purple: 0x9933ff,
      blue: 0x0099ff,
      teal: 0x00ffff,
      gold: 0xffdd00,
      coral: 0xff6666,
    };
    const pawnMaterial = new THREE.MeshStandardMaterial({
      color: colorMap[pawnColor] || colorMap.purple,
      emissive: colorMap[pawnColor] || colorMap.purple,
      emissiveIntensity: 0.5,
      metalness: 0.4,
      roughness: 0.2,
    });
    const pawn = new THREE.Mesh(pawnGeometry, pawnMaterial);
    pawn.position.set(getTilePosition(0).x, 1, getTilePosition(0).z);
    pawn.castShadow = true;
    pawn.receiveShadow = true;
    scene.add(pawn);
    pawnRef.current = pawn;

    // Buildings/Neon signs (simplified)
    const buildingPositions = [
      { x: -15, z: -10 },
      { x: 15, z: -10 },
      { x: -12, z: 20 },
      { x: 12, z: 20 },
    ];

    buildingPositions.forEach((pos) => {
      const buildingGeometry = new THREE.BoxGeometry(3, 8, 2);
      const buildingMaterial = new THREE.MeshStandardMaterial({
        color: 0x1a1f3a,
        roughness: 0.9,
      });
      const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
      building.position.set(pos.x, 4, pos.z);
      building.castShadow = true;
      building.receiveShadow = true;
      scene.add(building);

      // Neon sign on building
      const signGeometry = new THREE.PlaneGeometry(2.5, 2);
      const signMaterial = new THREE.MeshBasicMaterial({
        color: 0xff00ff,
        emissive: 0xff00ff,
      });
      const sign = new THREE.Mesh(signGeometry, signMaterial);
      sign.position.set(pos.x, 6, pos.z + 1.1);
      scene.add(sign);
    });

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate dice if rolling
      if (diceRef.current) {
        diceRef.current.rotation.x += 0.05;
        diceRef.current.rotation.y += 0.05;
      }

      // Move pawn along path
      if (pawnRef.current && position !== undefined) {
        const targetPos = getTilePosition(Math.min(position, TILES - 1));
        pawnRef.current.position.x += (targetPos.x - pawnRef.current.position.x) * 0.1;
        pawnRef.current.position.z += (targetPos.z - pawnRef.current.position.z) * 0.1;
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