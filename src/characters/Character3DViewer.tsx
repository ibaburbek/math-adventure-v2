import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { CharacterConfig } from '../types';

interface Character3DViewerProps {
  config: CharacterConfig;
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
}

// Module-scope reusable math helpers (Zero GC in animation loop)
const _vec3 = new THREE.Vector3();

export const Character3DViewer: React.FC<Character3DViewerProps> = ({
  config,
  className = 'w-full h-64 md:h-80',
  autoRotate = false,
  interactive = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const partsRef = useRef<{
    head?: THREE.Object3D;
    body?: THREE.Object3D;
    leftArm?: THREE.Object3D;
    rightArm?: THREE.Object3D;
    leftLeg?: THREE.Object3D;
    rightLeg?: THREE.Object3D;
    accessory?: THREE.Object3D;
    hat?: THREE.Object3D;
  }>({});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL safely
    const isSoftwareGl = (() => {
      try {
        const probeCanvas = document.createElement('canvas');
        const gl = probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // 2. Setup Three.js scene & camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.4, 3.8);
    camera.lookAt(0, 0.85, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Studio RoomEnvironment reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Studio Lighting (warm key + cool hemisphere fill)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x334155, 0.9);
    hemiLight.position.set(0, 10, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    dirLight.position.set(3, 5, 4);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.bias = -0.0005;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 0.8);
    rimLight.position.set(-3, 3, -3);
    scene.add(rimLight);

    // 5. Soft Ground Contact Shadow
    const shadowGeo = new THREE.PlaneGeometry(2.2, 2.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d');
    if (sctx) {
      const grad = sctx.createRadialGradient(64, 64, 10, 64, 64, 64);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.6)');
      grad.addColorStop(0.5, 'rgba(15, 23, 42, 0.25)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.01;
    scene.add(shadowPlane);

    // 6. Build Procedural 3D Chibi Hero
    const charRoot = new THREE.Group();
    characterGroupRef.current = charRoot;
    scene.add(charRoot);

    const primaryColor = new THREE.Color(config.primaryColor || '#3b82f6');
    const secondaryColor = new THREE.Color(config.secondaryColor || '#f59e0b');
    const skinColor = new THREE.Color(config.skinTone || '#fcd34d');

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({
      color: skinColor,
      roughness: 0.55,
      metalness: 0.05,
    });
    const outfitMat = new THREE.MeshStandardMaterial({
      color: primaryColor,
      roughness: 0.4,
      metalness: 0.15,
    });
    const trimMat = new THREE.MeshStandardMaterial({
      color: secondaryColor,
      roughness: 0.3,
      metalness: 0.5,
    });
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.2,
    });
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.2,
    });
    const shoeMat = new THREE.MeshStandardMaterial({
      color: 0x475569,
      roughness: 0.7,
    });

    // Body (chibi rounded torso)
    const bodyGeo = new THREE.CylinderGeometry(0.3, 0.38, 0.55, 16);
    const bodyMesh = new THREE.Mesh(bodyGeo, outfitMat);
    bodyMesh.position.y = 0.65;
    bodyMesh.castShadow = !isSoftwareGl;
    charRoot.add(bodyMesh);
    partsRef.current.body = bodyMesh;

    // Torso Belt / Trim
    const beltGeo = new THREE.CylinderGeometry(0.35, 0.36, 0.08, 16);
    const beltMesh = new THREE.Mesh(beltGeo, trimMat);
    beltMesh.position.y = 0.48;
    charRoot.add(beltMesh);

    // Head (cute large chibi head)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.15, 0);
    charRoot.add(headGroup);
    partsRef.current.head = headGroup;

    const headGeo = new THREE.SphereGeometry(0.42, 24, 20);
    const headMesh = new THREE.Mesh(headGeo, skinMat);
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);

    // Big expressive eyes
    const eyeGeo = new THREE.SphereGeometry(0.085, 12, 12);
    eyeGeo.scale(1, 1.2, 0.4);

    const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
    leftEye.position.set(-0.16, 0.02, 0.38);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
    rightEye.position.set(0.16, 0.02, 0.38);
    headGroup.add(rightEye);

    // Eye catchlights (sparkle)
    const sparkleGeo = new THREE.SphereGeometry(0.025, 8, 8);
    const leftSparkle = new THREE.Mesh(sparkleGeo, whiteMat);
    leftSparkle.position.set(-0.14, 0.06, 0.42);
    headGroup.add(leftSparkle);

    const rightSparkle = new THREE.Mesh(sparkleGeo, whiteMat);
    rightSparkle.position.set(0.18, 0.06, 0.42);
    headGroup.add(rightSparkle);

    // Cheerful smile
    const smileCurve = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 8);
    const smileMesh = new THREE.Mesh(smileCurve, eyeMat);
    smileMesh.rotation.z = Math.PI / 2;
    smileMesh.position.set(0, -0.14, 0.4);
    headGroup.add(smileMesh);

    // Hero specific features (Wizard, Knight, Elf, Robot, Fox, Dragon, Space, Owl)
    const charId = config.characterId || 'knight';

    if (charId === 'fox') {
      // Fox pointy ears
      const earGeo = new THREE.ConeGeometry(0.14, 0.28, 4);
      const earMat = new THREE.MeshStandardMaterial({ color: primaryColor, roughness: 0.6 });
      const leftEar = new THREE.Mesh(earGeo, earMat);
      leftEar.position.set(-0.28, 0.45, 0);
      leftEar.rotation.z = 0.25;
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, earMat);
      rightEar.position.set(0.28, 0.45, 0);
      rightEar.rotation.z = -0.25;
      headGroup.add(rightEar);

      // Fluffy fox tail
      const tailGeo = new THREE.ConeGeometry(0.15, 0.55, 8);
      const tailMesh = new THREE.Mesh(tailGeo, earMat);
      tailMesh.position.set(0, 0.5, -0.4);
      tailMesh.rotation.x = -1.2;
      charRoot.add(tailMesh);
    } else if (charId === 'elf') {
      // Pointed Elf ears
      const earGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
      const leftEar = new THREE.Mesh(earGeo, skinMat);
      leftEar.position.set(-0.45, 0.02, 0);
      leftEar.rotation.z = Math.PI / 2.5;
      headGroup.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, skinMat);
      rightEar.position.set(0.45, 0.02, 0);
      rightEar.rotation.z = -Math.PI / 2.5;
      headGroup.add(rightEar);
    } else if (charId === 'dragon') {
      // Cute Dragon horns & wings
      const hornGeo = new THREE.ConeGeometry(0.07, 0.2, 8);
      const hornMat = new THREE.MeshStandardMaterial({ color: secondaryColor, roughness: 0.3 });
      const leftHorn = new THREE.Mesh(hornGeo, hornMat);
      leftHorn.position.set(-0.25, 0.42, 0);
      leftHorn.rotation.z = 0.3;
      headGroup.add(leftHorn);

      const rightHorn = new THREE.Mesh(hornGeo, hornMat);
      rightHorn.position.set(0.25, 0.42, 0);
      rightHorn.rotation.z = -0.3;
      headGroup.add(rightHorn);

      // Dragon wings
      const wingGeo = new THREE.ConeGeometry(0.2, 0.4, 3);
      const leftWing = new THREE.Mesh(wingGeo, trimMat);
      leftWing.position.set(-0.35, 0.75, -0.2);
      leftWing.rotation.z = 1.3;
      charRoot.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, trimMat);
      rightWing.position.set(0.35, 0.75, -0.2);
      rightWing.rotation.z = -1.3;
      charRoot.add(rightWing);
    } else if (charId === 'robot') {
      // Antenna
      const antPoleGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.2, 8);
      const antPole = new THREE.Mesh(antPoleGeo, trimMat);
      antPole.position.y = 0.5;
      headGroup.add(antPole);

      const antBallGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const antBall = new THREE.Mesh(antBallGeo, new THREE.MeshStandardMaterial({ color: 0x06b6d4, emissive: 0x06b6d4, emissiveIntensity: 0.6 }));
      antBall.position.y = 0.6;
      headGroup.add(antBall);
    } else if (charId === 'space') {
      // Bubble Helmet Ring
      const helmetRingGeo = new THREE.TorusGeometry(0.44, 0.04, 8, 24);
      const helmetRing = new THREE.Mesh(helmetRingGeo, trimMat);
      helmetRing.rotation.x = Math.PI / 2;
      headGroup.add(helmetRing);
    } else if (charId === 'owl') {
      // Big glasses
      const glassGeo = new THREE.TorusGeometry(0.12, 0.02, 8, 16);
      const glassMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.7, roughness: 0.2 });
      const leftGlass = new THREE.Mesh(glassGeo, glassMat);
      leftGlass.position.set(-0.16, 0.02, 0.38);
      headGroup.add(leftGlass);

      const rightGlass = new THREE.Mesh(glassGeo, glassMat);
      rightGlass.position.set(0.16, 0.02, 0.38);
      headGroup.add(rightGlass);
    }

    // Hats (Wizard hat, crown, fedora, knight helmet)
    const hatGroup = new THREE.Group();
    partsRef.current.hat = hatGroup;
    headGroup.add(hatGroup);

    if (config.hatId === 'wizard_hat' || (charId === 'wizard' && config.hatId !== 'none')) {
      const brimGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 20);
      const coneGeo = new THREE.ConeGeometry(0.35, 0.7, 16);
      const hatMesh1 = new THREE.Mesh(brimGeo, outfitMat);
      hatMesh1.position.y = 0.36;
      const hatMesh2 = new THREE.Mesh(coneGeo, outfitMat);
      hatMesh2.position.set(0, 0.7, -0.05);
      hatMesh2.rotation.x = -0.15;
      hatGroup.add(hatMesh1);
      hatGroup.add(hatMesh2);

      // Star emblem on tip
      const starGeo = new THREE.OctahedronGeometry(0.08);
      const starMesh = new THREE.Mesh(starGeo, trimMat);
      starMesh.position.set(0, 1.05, -0.1);
      hatGroup.add(starMesh);
    } else if (config.hatId === 'crown') {
      const crownGeo = new THREE.CylinderGeometry(0.42, 0.38, 0.25, 6);
      const crownMesh = new THREE.Mesh(crownGeo, trimMat);
      crownMesh.position.y = 0.46;
      hatGroup.add(crownMesh);
    } else if (config.hatId === 'fedora') {
      const fbrim = new THREE.CylinderGeometry(0.52, 0.52, 0.03, 16);
      const ftop = new THREE.CylinderGeometry(0.32, 0.36, 0.22, 16);
      const fmat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
      const mb = new THREE.Mesh(fbrim, fmat);
      mb.position.y = 0.36;
      const mt = new THREE.Mesh(ftop, fmat);
      mt.position.y = 0.48;
      hatGroup.add(mb);
      hatGroup.add(mt);
    } else if (config.hatId === 'helm' || (charId === 'knight' && config.hatId !== 'none')) {
      // Knight Helmet visor & plume
      const visorGeo = new THREE.TorusGeometry(0.42, 0.06, 8, 16, Math.PI);
      const visor = new THREE.Mesh(visorGeo, trimMat);
      visor.position.set(0, 0.1, 0.2);
      visor.rotation.x = 0.3;
      hatGroup.add(visor);

      const plumeGeo = new THREE.ConeGeometry(0.08, 0.4, 8);
      const plumeMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 });
      const plume = new THREE.Mesh(plumeGeo, plumeMat);
      plume.position.set(0, 0.52, -0.1);
      plume.rotation.x = -0.4;
      hatGroup.add(plume);
    } else if (config.hatId === 'bunny_ears') {
      const bEarGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.4, 8);
      bEarGeo.scale(1, 1, 0.4);
      const bmat = new THREE.MeshStandardMaterial({ color: 0xf472b6, roughness: 0.6 });
      const lb = new THREE.Mesh(bEarGeo, bmat);
      lb.position.set(-0.2, 0.55, 0);
      lb.rotation.z = 0.15;
      const rb = new THREE.Mesh(bEarGeo, bmat);
      rb.position.set(0.2, 0.55, 0);
      rb.rotation.z = -0.15;
      hatGroup.add(lb);
      hatGroup.add(rb);
    }

    // Arms
    const armGeo = new THREE.CapsuleGeometry(0.09, 0.28, 8, 8);

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.4, 0.78, 0);
    const leftArmMesh = new THREE.Mesh(armGeo, outfitMat);
    leftArmMesh.position.y = -0.14;
    leftArmPivot.add(leftArmMesh);
    charRoot.add(leftArmPivot);
    partsRef.current.leftArm = leftArmPivot;

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.4, 0.78, 0);
    const rightArmMesh = new THREE.Mesh(armGeo, outfitMat);
    rightArmMesh.position.y = -0.14;
    rightArmPivot.add(rightArmMesh);
    charRoot.add(rightArmPivot);
    partsRef.current.rightArm = rightArmPivot;

    // Accessories (Magic Staff, Shield, etc.)
    const accessoryGroup = new THREE.Group();
    partsRef.current.accessory = accessoryGroup;
    rightArmPivot.add(accessoryGroup);

    if (config.accessoryId === 'staff' || charId === 'wizard') {
      // Magic Staff with glowing crystal
      const staffPole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.03, 0.03, 0.8, 8),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 })
      );
      staffPole.position.set(0.12, -0.05, 0.15);
      accessoryGroup.add(staffPole);

      const crystal = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.1),
        new THREE.MeshStandardMaterial({
          color: 0xa855f7,
          emissive: 0x9333ea,
          emissiveIntensity: 0.8,
          roughness: 0.2,
        })
      );
      crystal.position.set(0.12, 0.38, 0.15);
      accessoryGroup.add(crystal);
    } else if (config.accessoryId === 'shield' || charId === 'knight') {
      // Heroic Shield
      const shieldGeo = new THREE.CylinderGeometry(0.25, 0.2, 0.04, 16);
      shieldGeo.scale(1, 0.2, 1.4);
      const shield = new THREE.Mesh(shieldGeo, trimMat);
      shield.rotation.x = Math.PI / 2;
      shield.position.set(0.15, -0.1, 0.18);
      accessoryGroup.add(shield);
    }

    // Legs & Shoes
    const legGeo = new THREE.CylinderGeometry(0.1, 0.11, 0.32, 12);
    const bootGeo = new THREE.BoxGeometry(0.18, 0.14, 0.26);

    const leftLegPivot = new THREE.Group();
    leftLegPivot.position.set(-0.18, 0.35, 0);
    const leftLegMesh = new THREE.Mesh(legGeo, outfitMat);
    leftLegMesh.position.y = -0.1;
    leftLegPivot.add(leftLegMesh);
    const leftBoot = new THREE.Mesh(bootGeo, shoeMat);
    leftBoot.position.set(0, -0.26, 0.05);
    leftLegPivot.add(leftBoot);
    charRoot.add(leftLegPivot);
    partsRef.current.leftLeg = leftLegPivot;

    const rightLegPivot = new THREE.Group();
    rightLegPivot.position.set(0.18, 0.35, 0);
    const rightLegMesh = new THREE.Mesh(legGeo, outfitMat);
    rightLegMesh.position.y = -0.1;
    rightLegPivot.add(rightLegMesh);
    const rightBoot = new THREE.Mesh(bootGeo, shoeMat);
    rightBoot.position.set(0, -0.26, 0.05);
    rightLegPivot.add(rightBoot);
    charRoot.add(rightLegPivot);
    partsRef.current.rightLeg = rightLegPivot;

    // 7. Interactive touch/mouse drag rotation
    let isDragging = false;
    let prevMouseX = 0;
    let targetRotationY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (!interactive) return;
      isDragging = true;
      prevMouseX = e.clientX;
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !interactive) return;
      const deltaX = e.clientX - prevMouseX;
      targetRotationY += deltaX * 0.012;
      prevMouseX = e.clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const dom = renderer.domElement;
    dom.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // 8. Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth camera orbit / character rotation damping
      if (charRoot) {
        if (autoRotate && !isDragging) {
          targetRotationY += delta * 0.8;
        }
        charRoot.rotation.y = THREE.MathUtils.damp(charRoot.rotation.y, targetRotationY, 10, delta);
      }

      // Animating based on state
      const animState = config.animationState || 'idle';
      const { head, leftArm, rightArm, leftLeg, rightLeg } = partsRef.current;

      if (animState === 'idle') {
        // Soft breathing and idle sway
        if (charRoot) charRoot.position.y = Math.sin(time * 2.5) * 0.03;
        if (head) head.rotation.y = Math.sin(time * 1.5) * 0.08;
        if (leftArm) leftArm.rotation.x = Math.sin(time * 2.5) * 0.1;
        if (rightArm) rightArm.rotation.x = -Math.sin(time * 2.5) * 0.1;
        if (leftLeg) leftLeg.rotation.x = 0;
        if (rightLeg) rightLeg.rotation.x = 0;
      } else if (animState === 'walking') {
        // Striding walk cycle
        const walkSpeed = 8;
        const stride = Math.sin(time * walkSpeed) * 0.45;
        if (charRoot) charRoot.position.y = Math.abs(Math.sin(time * walkSpeed)) * 0.06;
        if (leftLeg) leftLeg.rotation.x = stride;
        if (rightLeg) rightLeg.rotation.x = -stride;
        if (leftArm) leftArm.rotation.x = -stride * 1.1;
        if (rightArm) rightArm.rotation.x = stride * 1.1;
        if (head) head.rotation.z = Math.sin(time * walkSpeed) * 0.04;
      } else if (animState === 'celebration') {
        // Joyous hop with arms raised
        const jump = Math.abs(Math.sin(time * 6)) * 0.22;
        if (charRoot) charRoot.position.y = jump;
        if (leftArm) {
          leftArm.rotation.x = -Math.PI * 0.75 + Math.sin(time * 8) * 0.2;
          leftArm.rotation.z = 0.3;
        }
        if (rightArm) {
          rightArm.rotation.x = -Math.PI * 0.75 - Math.sin(time * 8) * 0.2;
          rightArm.rotation.z = -0.3;
        }
        if (head) head.rotation.x = -0.15 + Math.sin(time * 6) * 0.1;
      } else if (animState === 'victory') {
        // Dramatic hero triumph pose
        if (charRoot) charRoot.position.y = 0.08 + Math.sin(time * 3) * 0.02;
        if (rightArm) {
          rightArm.rotation.x = -Math.PI * 0.85;
          rightArm.rotation.z = -0.2;
        }
        if (leftArm) {
          leftArm.rotation.x = 0.2;
          leftArm.rotation.z = 0.4;
        }
        if (head) head.rotation.y = 0.15;
      }

      renderer.render(scene, camera);
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      renderer.dispose();
      shadowTexture.dispose();
      container.innerHTML = '';
    };
  }, [
    config.characterId,
    config.primaryColor,
    config.secondaryColor,
    config.skinTone,
    config.hatId,
    config.outfitId,
    config.accessoryId,
    config.shoesId,
    config.animationState,
    autoRotate,
    interactive,
  ]);

  return (
    <div className={`relative select-none overflow-hidden ${className}`}>
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
    </div>
  );
};
