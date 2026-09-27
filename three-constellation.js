/**
 * Constellation 3D Interactive — Les Casquettes de Soukaina Belhouk
 * Développé avec Three.js
 * Optimisé pour la performance, l'accessibilité et la fluidité mobile
 */

(function () {
  'use strict';

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
  let scene, camera, renderer, container;
  let centerMesh, centerSprite;
  const nodeMeshes = [];
  const nodeSprites = [];
  let connectionLines;
  let particleSystem;
  let constellationGroup;

  let width = 550;
  let height = 550;

  let mouseX = 0, mouseY = 0;
  let targetRotationX = 0, targetRotationY = 0;
  let isHovered = false;
  let activeRoleIndex = 0;
  let isVisible = true;

  // Raycasting
  let raycaster;
  let mouse;

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
    container = document.getElementById('casquettes-canvas-container');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2(-999, -999);

    width = container.clientWidth || 550;
    height = container.clientHeight || width || 550;

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 15;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);

    const canvasElement = renderer.domElement;
    canvasElement.id = 'casquettes-canvas';
    canvasElement.style.width = '100%';
    canvasElement.style.height = '100%';
    canvasElement.style.display = 'block';
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xD4AF37, 2.2, 50);
    pointLight.position.set(0, 0, 8);
    scene.add(pointLight);

    // 1. Noyau Central : SOUKAINA
    const centerGeo = new THREE.SphereGeometry(1.1, 32, 32);
    const centerMat = new THREE.MeshStandardMaterial({
      color: 0xD4AF37,
      metalness: 0.85,
      roughness: 0.25,
      emissive: 0x94721C,
      emissiveIntensity: 0.6
    });
    centerMesh = new THREE.Mesh(centerGeo, centerMat);
    constellationGroup.add(centerMesh);

    // Halo autour du noyau central
    const haloGeo = new THREE.RingGeometry(1.35, 1.45, 64);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xE2CA8C,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    constellationGroup.add(haloMesh);

    // Label du noyau central
    centerSprite = createTextSprite('SOUKAINA', true);
    centerSprite.position.set(0, -1.8, 0);
    constellationGroup.add(centerSprite);

    // 2. Les 6 Nœuds Périphériques (Les Casquettes)
    const orbitRadius = 4.8;
    const linePositions = [];

    roles.forEach((role, idx) => {
      const angle = (idx / roles.length) * Math.PI * 2;
      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * (orbitRadius * 0.75);
      const z = Math.sin(angle * 2) * 1.4;

      // Nœud sphérique
      const nodeGeo = new THREE.SphereGeometry(0.52, 24, 24);
      const nodeMat = new THREE.MeshStandardMaterial({
        color: role.color,
        metalness: 0.7,
        roughness: 0.3,
        emissive: role.color,
        emissiveIntensity: 0.35
      });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(x, y, z);
      nodeMesh.userData = { index: idx, id: role.id };
      nodeMeshes.push(nodeMesh);
      constellationGroup.add(nodeMesh);

      // Label texte attaché au nœud
      const sprite = createTextSprite(role.name, false);
      sprite.position.set(x, y - 0.95, z);
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
      opacity: 0.35
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

    // Rendu initial garanti
    onWindowResize();
    renderer.render(scene, camera);

    // Démarrer la boucle
    animate();
  }

  function setupEvents() {
    const el = renderer.domElement;

    // Interaction Souris (Desktop)
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      targetRotationY = ((x / rect.width) - 0.5) * 1.5;
      targetRotationX = ((y / rect.height) - 0.5) * 1.0;
    });

    el.addEventListener('mouseenter', () => { isHovered = true; });
    el.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotationX = 0;
      mouse.x = -999;
      mouse.y = -999;
    });

    // Interaction Tactile (Mobile)
    let touchStartX = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        isHovered = true;
      }
    }, { passive: true });

    el.addEventListener('touchend', () => { isHovered = false; }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        const deltaX = (e.touches[0].clientX - touchStartX) * 0.015;
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
    window.addEventListener('resize', onWindowResize, { passive: true });
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || 550;
    const h = container.clientHeight || w || 550;
    width = w;
    height = h;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  }

  function setupObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isVisible = entry.isIntersecting;
        if (isVisible) {
          onWindowResize();
        }
      });
    }, { threshold: 0.02 });

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
    if (!prefersReducedMotion && centerMesh) {
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
