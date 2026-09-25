/**
 * Constellation 3D Interactive — Les Casquettes de Soukaina Belhouk
 * Développé avec Three.js
 * Optimisé pour la performance, l'accessibilité et la fluidité mobile
 */

(function () {
  'use strict';

  const container = document.getElementById('casquettes-canvas-container');
  if (!container || typeof THREE === 'undefined') {
    return;
  }

  // Vérifier la préférence de réduction de mouvement
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Données des 6 casquettes
  const roles = [
    { id: 'commerciale', name: 'COMMERCIALE', subtitle: 'Comprendre avant de proposer', color: 0xE2CA8C, cardIndex: 0 },
    { id: 'formatrice', name: 'FORMATRICE', subtitle: 'Simplifier & transmettre', color: 0xF3E5AB, cardIndex: 1 },
    { id: 'manager', name: 'MANAGER', subtitle: 'Cadre & bienveillance', color: 0xD4AF37, cardIndex: 2 },
    { id: 'coach', name: 'COACH', subtitle: 'Écoute & libération du potentiel', color: 0xE2CA8C, cardIndex: 3 },
    { id: 'cheffe-projet', name: 'CHEFFE DE PROJET', subtitle: 'Méthode & rigueur', color: 0xF3E5AB, cardIndex: 4 },
    { id: 'digital-ia', name: 'DIGITAL & IA', subtitle: 'Outils modernes & impact', color: 0xD4AF37, cardIndex: 5 }
  ];

  // Scène, Caméra, Renderer
  let scene, camera, renderer;
  let centerMesh, centerSprite;
  const nodeMeshes = [];
  const nodeSprites = [];
  let connectionLines;
  let particleSystem;
  let constellationGroup;

  let width = container.clientWidth;
  let height = container.clientHeight;

  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isHovered = false;
  let activeRoleIndex = 0;
  let isVisible = false;

  // Raycasting
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2(-999, -999);

  function createTextSprite(text, isCenter = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isCenter) {
      // Badge central élégant
      ctx.fillStyle = 'rgba(14, 21, 36, 0.88)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      roundRect(ctx, 40, 20, 432, 88, 44);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 36px "Fraunces", Georgia, serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
    } else {
      // Badge satellite
      ctx.fillStyle = 'rgba(21, 31, 52, 0.82)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.5)';
      ctx.lineWidth = 3;
      roundRect(ctx, 20, 24, 472, 80, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F5E8C7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.letterSpacing = '2px';
      ctx.fillText(text, 256, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMaterial);
    
    if (isCenter) {
      sprite.scale.set(3.8, 0.95, 1);
    } else {
      sprite.scale.set(3.2, 0.8, 1);
    }
    return sprite;
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const canvasElement = renderer.domElement;
    canvasElement.id = 'casquettes-canvas';
    canvasElement.setAttribute('aria-label', 'Constellation 3D interactive représentant les 6 casquettes de Soukaina Belhouk');
    container.innerHTML = '';
    container.appendChild(canvasElement);

    const hint = document.createElement('div');
    hint.className = 'casquettes-3d-hint';
    hint.innerHTML = '● Faites tourner la constellation · Cliquez sur un rôle';
    container.appendChild(hint);

    constellationGroup = new THREE.Group();
    scene.add(constellationGroup);

    // Lumières subtiles
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 2, 50);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // 1. Noyau Central : SOUKAINA
    const centerGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      emissive: 0x997316,
      roughness: 0.25,
      metalness: 0.8
    });
    centerMesh = new THREE.Mesh(centerGeo, centerMat);
    constellationGroup.add(centerMesh);

    // Anneau d'aura autour du centre
    const ringGeo = new THREE.RingGeometry(1.3, 1.4, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xF3E5AB, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2.5;
    constellationGroup.add(ringMesh);

    centerSprite = createTextSprite('SOUKAINA', true);
    centerSprite.position.set(0, 1.8, 0);
    constellationGroup.add(centerSprite);

    // 2. Les 6 Satellites (Casquettes)
    const orbitRadius = 5.2;
    const linePositions = [];

    roles.forEach((role, idx) => {
      const angle = (idx / roles.length) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * (orbitRadius * 0.75);
      const z = Math.sin(angle * 2) * 1.4;

      // Nœud 3D
      const nodeGeo = new THREE.SphereGeometry(0.42, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: role.color,
        emissive: role.color,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.6
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { index: idx, id: role.id };
      nodeMeshes.push(nodeMesh);
      constellationGroup.add(nodeMesh);

      // Label 3D en sprite
      const sprite = createTextSprite(role.name, false);
      sprite.position.set(x, y + 0.85, z);
      sprite.userData = { index: idx, id: role.id };
      nodeSprites.push(sprite);
      constellationGroup.add(sprite);

      // Ligne vers le centre
      linePositions.push(0, 0, 0);
      linePositions.push(x, y, z);

      // Ligne vers le nœud suivant pour fermer la constellation
      const nextAngle = ((idx + 1) / roles.length) * Math.PI * 2;
      const nx = Math.cos(nextAngle) * orbitRadius;
      const ny = Math.sin(nextAngle) * (orbitRadius * 0.75);
      const nz = Math.sin(nextAngle * 2) * 1.4;
      linePositions.push(x, y, z);
      linePositions.push(nx, ny, nz);
    });

    // Création des lignes de constellation
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xD4AF37,
      transparent: true,
      opacity: 0.25
    });
    connectionLines = new THREE.LineSegments(lineGeo, lineMat);
    constellationGroup.add(connectionLines);

    // 3. Nuage de micro-particules dorées
    const particleCount = 120;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 10;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xE2CA8C,
      size: 0.08,
      transparent: true,
      opacity: 0.6
    });
    particleSystem = new THREE.Points(particleGeo, particleMat);
    constellationGroup.add(particleSystem);

    // Événements
    setupEvents();

    // IntersectionObserver pour pause de rendu hors champ
    setupObserver();

    // Initialiser l'état actif
    updateActiveRole(0, false);

    // Démarrer la boucle
    animate();
  }

  function setupEvents() {
    const el = renderer.domElement;

    // Déplacement de la souris
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;

      mouse.x = mouseX;
      mouse.y = mouseY;

      targetRotationY = mouseX * 0.45;
      targetRotationX = -mouseY * 0.35;
    });

    el.addEventListener('mouseenter', () => { isHovered = true; });
    el.addEventListener('mouseleave', () => {
      isHovered = false;
      mouse.x = -999;
      mouse.y = -999;
    });

    // Touch pour mobile
    let touchStartX = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const deltaX = (e.touches[0].clientX - touchStartX) * 0.005;
        targetRotationY += deltaX;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    // Clic pour sélectionner un rôle
    el.addEventListener('click', () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects([...nodeMeshes, ...nodeSprites]);

      if (intersects.length > 0) {
        const target = intersects[0].object;
        const idx = target.userData.index;
        if (typeof idx === 'number') {
          updateActiveRole(idx, true);
        }
      }
    });

    // Redimensionnement
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    if (!container) return;
    width = container.clientWidth;
    height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  function setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });

    observer.observe(container);
  }

  // Synchronisation avec les cartes HTML de la section
  window.setActiveRoleFromCard = function (index) {
    updateActiveRole(index, false);
  };

  function updateActiveRole(index, triggerDomEvent) {
    activeRoleIndex = index;

    // Mise à jour visuelle des nœuds 3D
    nodeMeshes.forEach((mesh, idx) => {
      if (idx === index) {
        mesh.scale.set(1.4, 1.4, 1.4);
        mesh.material.emissiveIntensity = 1.0;
      } else {
        mesh.scale.set(1.0, 1.0, 1.0);
        mesh.material.emissiveIntensity = 0.35;
      }
    });

    // Faire pivoter la constellation vers le rôle sélectionné
    const targetAngle = -(index / roles.length) * Math.PI * 2 + Math.PI / 2;
    targetRotationY = targetAngle * 0.6;

    // Déclencher la mise à jour côté DOM si initié par clic 3D
    if (triggerDomEvent && window.onRoleSelectedIn3D) {
      window.onRoleSelectedIn3D(index);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    // Rotation douce
    if (!prefersReducedMotion && !isHovered) {
      constellationGroup.rotation.y += 0.0035;
    }

    // Amortissement de la rotation ciblée
    constellationGroup.rotation.y += (targetRotationY - constellationGroup.rotation.y) * 0.05;
    constellationGroup.rotation.x += (targetRotationX - constellationGroup.rotation.x) * 0.05;

    // Pulsation discrète du centre
    if (!prefersReducedMotion) {
      const time = Date.now() * 0.002;
      const scale = 1 + Math.sin(time) * 0.04;
      centerMesh.scale.set(scale, scale, scale);
    }

    renderer.render(scene, camera);
  }

  // Démarrage lorsque le DOM est prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
