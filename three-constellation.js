/**
 * Constellation 3D Interactive — Les Casquettes de Soukaina Belhouk
 * Moteur Three.js avec fallback SVG interactif garanti
 * Rendu continu haute performance, 100% responsive et fluide sur mobile
 */

(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const roles = [
    { id: 'commerciale', name: 'COMMERCIALE', subtitle: 'Comprendre avant de proposer', color: 0xE2CA8C, cardIndex: 0 },
    { id: 'formatrice', name: 'FORMATRICE', subtitle: 'Simplifier & transmettre', color: 0xF3E5AB, cardIndex: 1 },
    { id: 'manager', name: 'MANAGER', subtitle: 'Cadre & bienveillance', color: 0xD4AF37, cardIndex: 2 },
    { id: 'coach', name: 'COACH', subtitle: 'Écoute & libération du potentiel', color: 0xE2CA8C, cardIndex: 3 },
    { id: 'cheffe-projet', name: 'CHEFFE DE PROJET', subtitle: 'Méthode & rigueur', color: 0xF3E5AB, cardIndex: 4 },
    { id: 'digital-ia', name: 'DIGITAL & IA', subtitle: 'Outils modernes & impact', color: 0xD4AF37, cardIndex: 5 }
  ];

  let scene, camera, renderer, container;
  let centerMesh, centerSprite, ringMesh;
  const nodeMeshes = [];
  const nodeSprites = [];
  let connectionLines;
  let particleSystem;
  let constellationGroup;

  let width = 550;
  let height = 550;

  let baseRotationY = 0;
  let targetTiltX = 0, targetTiltY = 0;
  let currentTiltX = 0, currentTiltY = 0;
  let userDragOffset = 0;
  let targetFocusAngle = 0;
  let currentFocusAngle = 0;
  let isDragging = false;
  let activeRoleIndex = 0;

  let raycaster, mouse;

  function createTextSprite(text, isCenter = false) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (isCenter) {
      ctx.fillStyle = 'rgba(14, 21, 36, 0.92)';
      ctx.strokeStyle = '#D4AF37';
      ctx.lineWidth = 4;
      roundRect(ctx, 36, 18, 440, 92, 46);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 36px "Fraunces", Georgia, serif';
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
    } else {
      ctx.fillStyle = 'rgba(21, 31, 52, 0.88)';
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
      ctx.lineWidth = 3;
      roundRect(ctx, 20, 22, 472, 84, 20);
      ctx.fill();
      ctx.stroke();

      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#F5E8C7';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, 256, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    texture.minFilter = THREE.LinearFilter;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      depthTest: false
    });

    const sprite = new THREE.Sprite(spriteMaterial);
    if (isCenter) {
      sprite.scale.set(4.0, 1.0, 1);
    } else {
      sprite.scale.set(3.4, 0.85, 1);
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

  function renderFallbackSVG() {
    if (!container) return;
    container.innerHTML = `
      <div class="casquettes-svg-fallback" style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;">
        <svg viewBox="-260 -260 520 520" style="width:90%;max-width:500px;height:auto;overflow:visible;">
          <defs>
            <radialGradient id="fbCenterGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#FFE58F" />
              <stop offset="60%" stop-color="#D4AF37" />
              <stop offset="100%" stop-color="#94721C" />
            </radialGradient>
            <filter id="fbGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g id="svg-constellation-rotator" style="animation: spinConstellation 50s linear infinite; transform-origin: 0 0;">
            <!-- Lignes de liaison -->
            ${roles.map((r, i) => {
              const ang = (i / roles.length) * Math.PI * 2;
              const x = Math.cos(ang) * 190;
              const y = Math.sin(ang) * 190;
              return `<line x1="0" y1="0" x2="${x}" y2="${y}" stroke="rgba(212,175,55,0.4)" stroke-width="1.5" stroke-dasharray="4,4" />`;
            }).join('')}
            <!-- Anneau orbital -->
            <circle cx="0" cy="0" r="190" fill="none" stroke="rgba(212,175,55,0.2)" stroke-width="1" />
            <!-- Nœuds satellites -->
            ${roles.map((r, i) => {
              const ang = (i / roles.length) * Math.PI * 2;
              const x = Math.cos(ang) * 190;
              const y = Math.sin(ang) * 190;
              return `
                <g class="svg-node" data-role-idx="${i}" style="cursor:pointer;" transform="translate(${x},${y})">
                  <circle cx="0" cy="0" r="18" fill="#151F34" stroke="#D4AF37" stroke-width="2.5" filter="url(#fbGlow)" />
                  <circle cx="0" cy="0" r="8" fill="#F5E8C7" />
                  <rect x="-70" y="24" width="140" height="26" rx="13" fill="rgba(14,21,36,0.9)" stroke="rgba(212,175,55,0.6)" stroke-width="1" />
                  <text x="0" y="41" text-anchor="middle" fill="#F5E8C7" font-size="10" font-family="'Plus Jakarta Sans',sans-serif" font-weight="700" letter-spacing="1">${r.name}</text>
                </g>
              `;
            }).join('')}
          </g>
          <!-- Centre fixe -->
          <circle cx="0" cy="0" r="42" fill="url(#fbCenterGrad)" filter="url(#fbGlow)" />
          <circle cx="0" cy="0" r="48" fill="none" stroke="#F5E8C7" stroke-width="1.5" opacity="0.5" />
          <text x="0" y="6" text-anchor="middle" fill="#090D16" font-size="12" font-family="'Fraunces',Georgia,serif" font-weight="700" letter-spacing="1">SOUKAINA</text>
        </svg>
        <div class="casquettes-3d-hint">● Cliquez sur un rôle pour explorer</div>
      </div>
      <style>
        @keyframes spinConstellation {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .svg-node:hover circle:first-child {
          stroke: #FFFFFF;
          stroke-width: 3.5;
        }
      </style>
    `;

    container.querySelectorAll('.svg-node').forEach(node => {
      node.addEventListener('click', (e) => {
        const idx = parseInt(node.getAttribute('data-role-idx'), 10);
        if (!isNaN(idx)) {
          if (window.onRoleSelectedIn3D) window.onRoleSelectedIn3D(idx);
          if (window.setActiveRoleFromCard) window.setActiveRoleFromCard(idx);
        }
      });
    });
  }

  function init() {
    container = document.getElementById('casquettes-canvas-container');
    if (!container) return;

    // Si THREE n'est pas encore disponible
    if (typeof THREE === 'undefined') {
      setTimeout(init, 100);
      return;
    }

    try {
      raycaster = new THREE.Raycaster();
      mouse = new THREE.Vector2(-999, -999);

      width = container.clientWidth || 550;
      height = container.clientHeight || width || 550;

      scene = new THREE.Scene();

      const aspect = width / height;
      camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
      camera.position.z = aspect < 1 ? (15 / aspect) * 0.85 : 15;

      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });

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

      // Lumières
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xD4AF37, 2.5, 60);
      pointLight.position.set(0, 0, 10);
      scene.add(pointLight);

      const backLight = new THREE.PointLight(0xF5E8C7, 1.2, 40);
      backLight.position.set(0, 4, -8);
      scene.add(backLight);

      // 1. Noyau Central : SOUKAINA
      const centerGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const centerMat = new THREE.MeshStandardMaterial({
        color: 0xD4AF37,
        metalness: 0.85,
        roughness: 0.2,
        emissive: 0xAA8222,
        emissiveIntensity: 0.7
      });
      centerMesh = new THREE.Mesh(centerGeo, centerMat);
      constellationGroup.add(centerMesh);

      // Anneau orbital central
      const ringGeo = new THREE.RingGeometry(1.5, 1.62, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xF3E5AB,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      constellationGroup.add(ringMesh);

      // Label central
      centerSprite = createTextSprite('SOUKAINA', true);
      centerSprite.position.set(0, -1.95, 0);
      constellationGroup.add(centerSprite);

      // 2. Les 6 Satellites (Casquettes)
      const orbitRadius = 4.8;
      const linePositions = [];

      roles.forEach((role, idx) => {
        const angle = (idx / roles.length) * Math.PI * 2;
        const x = Math.cos(angle) * orbitRadius;
        const y = Math.sin(angle) * (orbitRadius * 0.72);
        const z = Math.sin(angle * 2) * 1.5;

        // Nœud 3D
        const nodeGeo = new THREE.SphereGeometry(0.55, 24, 24);
        const nodeMat = new THREE.MeshStandardMaterial({
          color: role.color,
          metalness: 0.75,
          roughness: 0.25,
          emissive: role.color,
          emissiveIntensity: 0.5
        });
        const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
        nodeMesh.position.set(x, y, z);
        nodeMesh.userData = { index: idx, id: role.id };
        nodeMeshes.push(nodeMesh);
        constellationGroup.add(nodeMesh);

        // Label sprite
        const sprite = createTextSprite(role.name, false);
        sprite.position.set(x, y - 0.95, z);
        sprite.userData = { index: idx, id: role.id };
        nodeSprites.push(sprite);
        constellationGroup.add(sprite);

        // Rayon vers le centre
        linePositions.push(0, 0, 0);
        linePositions.push(x, y, z);

        // Liaison vers satellite suivant
        const nextAngle = ((idx + 1) / roles.length) * Math.PI * 2;
        const nx = Math.cos(nextAngle) * orbitRadius;
        const ny = Math.sin(nextAngle) * (orbitRadius * 0.72);
        const nz = Math.sin(nextAngle * 2) * 1.5;
        linePositions.push(x, y, z);
        linePositions.push(nx, ny, nz);
      });

      // Lignes dorées
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xD4AF37,
        transparent: true,
        opacity: 0.45
      });
      connectionLines = new THREE.LineSegments(lineGeo, lineMat);
      constellationGroup.add(connectionLines);

      // Particules flottantes
      const particleCount = 140;
      const particlePositions = new Float32Array(particleCount * 3);
      for (let i = 0; i < particleCount * 3; i += 3) {
        particlePositions[i] = (Math.random() - 0.5) * 16;
        particlePositions[i + 1] = (Math.random() - 0.5) * 16;
        particlePositions[i + 2] = (Math.random() - 0.5) * 10;
      }
      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      const particleMat = new THREE.PointsMaterial({
        color: 0xF5E8C7,
        size: 0.09,
        transparent: true,
        opacity: 0.65
      });
      particleSystem = new THREE.Points(particleGeo, particleMat);
      constellationGroup.add(particleSystem);

      // Événements
      setupEvents();

      // État actif initial
      updateActiveRole(0, false);

      // Ajustement initial
      onWindowResize();

      // Rendu initial
      renderer.render(scene, camera);

      // Lancement de la boucle d'animation
      animate();

    } catch (err) {
      console.warn('WebGL non disponible, bascule sur SVG interactif:', err);
      renderFallbackSVG();
    }
  }

  function setupEvents() {
    const el = renderer.domElement;

    // Souris Desktop
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.x = (x / rect.width) * 2 - 1;
      mouse.y = -(y / rect.height) * 2 + 1;

      targetTiltY = ((x / rect.width) - 0.5) * 0.9;
      targetTiltX = ((y / rect.height) - 0.5) * 0.6;
    });

    el.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
      mouse.x = -999;
      mouse.y = -999;
    });

    // Touch Mobile (Drag rotation)
    let touchStartX = 0;
    el.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        isDragging = true;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    el.addEventListener('touchend', () => { isDragging = false; }, { passive: true });

    el.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = (e.touches[0].clientX - touchStartX) * 0.012;
        userDragOffset += deltaX;
        touchStartX = e.touches[0].clientX;
      }
    }, { passive: true });

    // Clic / Tap de sélection
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

    window.addEventListener('resize', onWindowResize, { passive: true });
    window.addEventListener('load', () => setTimeout(onWindowResize, 200));
  }

  function onWindowResize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth || 550;
    const h = container.clientHeight || w || 550;
    width = w;
    height = h;
    const aspect = width / height;
    camera.aspect = aspect;
    camera.position.z = aspect < 1 ? (15 / aspect) * 0.85 : 15;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.render(scene, camera);
  }

  window.setActiveRoleFromCard = function (index) {
    updateActiveRole(index, false);
  };

  function updateActiveRole(index, triggerDomEvent) {
    activeRoleIndex = index;

    nodeMeshes.forEach((mesh, idx) => {
      if (idx === index) {
        mesh.scale.set(1.45, 1.45, 1.45);
        mesh.material.emissiveIntensity = 1.0;
      } else {
        mesh.scale.set(1.0, 1.0, 1.0);
        mesh.material.emissiveIntensity = 0.4;
      }
    });

    targetFocusAngle = -(index / roles.length) * Math.PI * 2 + Math.PI / 2;

    if (triggerDomEvent && window.onRoleSelectedIn3D) {
      window.onRoleSelectedIn3D(index);
    }
  }

  function animate() {
    requestAnimationFrame(animate);

    if (document.hidden) return;

    // Rotation continue ininterrompue
    if (!prefersReducedMotion) {
      baseRotationY += 0.0045;
    }

    // Amortissement fluide des tilts et focus
    currentTiltX += (targetTiltX - currentTiltX) * 0.08;
    currentTiltY += (targetTiltY - currentTiltY) * 0.08;
    currentFocusAngle += (targetFocusAngle - currentFocusAngle) * 0.05;

    if (constellationGroup) {
      constellationGroup.rotation.y = baseRotationY + currentFocusAngle + currentTiltY + userDragOffset;
      constellationGroup.rotation.x = currentTiltX;
    }

    // Pulsation douce du noyau
    if (!prefersReducedMotion && centerMesh) {
      const time = Date.now() * 0.0025;
      const scale = 1 + Math.sin(time) * 0.05;
      centerMesh.scale.set(scale, scale, scale);
      if (ringMesh) ringMesh.rotation.z += 0.004;
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }

  // Démarrage garanti
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init();
      setTimeout(onWindowResize, 300);
      setTimeout(onWindowResize, 1000);
    });
  } else {
    init();
    setTimeout(onWindowResize, 300);
    setTimeout(onWindowResize, 1000);
  }
})();
