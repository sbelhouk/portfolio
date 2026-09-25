/**
 * Script Principal d'Interactions — Portfolio Soukaina Belhouk
 * Navigation, ScrollSpy, Filtres, Modale Expérience, Formulaire & Accessibilité
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // ========================================================================
  // 1. GESTION DE LA NAVIGATION & SCROLLSPY
  // ========================================================================
  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  // Effet d'élévation de la navbar au scroll
  const handleNavScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll();

  // Menu Mobile
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Fermer le menu mobile au clic sur un lien
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    // Fermer avec la touche Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ScrollSpy avec IntersectionObserver
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(sec => spyObserver.observe(sec));

  // ========================================================================
  // 2. SCROLL REVEAL FLUIDE
  // ========================================================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => revealObserver.observe(el));

  // ========================================================================
  // 3. MES CASQUETTES (SYNCHRONISATION ACCORDÉON & 3D)
  // ========================================================================
  const casquetteCards = document.querySelectorAll('.casquette-card');

  casquetteCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      casquetteCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      if (window.setActiveRoleFromCard) {
        window.setActiveRoleFromCard(index);
      }
    });
  });

  // Callback appelé depuis la 3D quand l'utilisateur clique sur un nœud
  window.onRoleSelectedIn3D = function (index) {
    casquetteCards.forEach((card, idx) => {
      if (idx === index) {
        card.classList.add('active');
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        card.classList.remove('active');
      }
    });
  };

  // ========================================================================
  // 4. MES EXPÉRIENCES (FILTRAGE & VUE DÉTAILLÉE MODALE)
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const expCards = document.querySelectorAll('.experience-card');

  // Filtrage
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      expCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; }, 10);
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 200);
        }
      });
    });
  });

  // Données détaillées des expériences (Source de vérité exacte du profil de Soukaina Belhouk)
  const experienceDetails = {
    'meyers': {
      company: 'Meyers Assurances (Meyersa)',
      role: 'Formatrice Commerciale',
      period: '2024 — Présent',
      location: 'Casablanca, Maroc',
      context: 'Courtage en assurances — accompagnement de la montée en compétences des équipes commerciales.',
      missions: [
        'Conception et déploiement de dispositifs complets de formation commerciale sur-mesure.',
        'Animation de formations présentielles dynamiques et conduite de séances de coaching individuel terrain.',
        'Accompagnement continu des équipes commerciales vers l’amélioration de leurs taux de conversion et résultats.',
        'Création d’outils pédagogiques, argumentaires structurés et supports de formation adaptés aux spécificités de l’assurance.'
      ],
      skills: ['Ingénierie pédagogique', 'Formation présentielle', 'Coaching individuel', 'Assurance santé & prévoyance', 'Création de supports'],
      synergy: 'Casquettes mobilisées : Formatrice, Coach & Commerciale.'
    },
        'alkimy': {
      company: 'Alkimiy',
      role: 'Sales Business Developer – Closing High Ticket',
      period: '2026 — Aujourd\'hui',
      location: 'Casablanca · Hybride',
      context: 'Closing de programmes d\'accompagnement premium auprès d\'entrepreneurs et porteurs de projets.',
      missions: [
        'Entretiens individuels approfondis et qualification stratégique des porteurs de projets.',
        'Vente consultative d\'excellence selon la méthodologie SPIN Selling, de la découverte à la décision.',
        'Traitement et levée des objections complexes avec une approche éthique et bienveillante.',
        'Closing de programmes d\'accompagnement haut de gamme à forte valeur ajoutée.',
        'Suivi relationnel et accompagnement personnalisé vers l\'atteinte des objectifs.'
      ],
      skills: ['Closing High Ticket', 'Vente consultative', 'Méthode SPIN Selling', 'Qualification de prospects', 'Gestion des objections'],
      synergy: 'Casquettes mobilisées : Commerciale, Coach & Stratégie.'
    },
    'alkimiy': {
      company: 'Alkimiy',
      role: 'Sales Business Developer – Closing High Ticket',
      period: '2026 — Aujourd\'hui',
      location: 'Casablanca · Hybride',
      context: 'Closing de programmes d\'accompagnement premium auprès d\'entrepreneurs et porteurs de projets.',
      missions: [
        'Entretiens individuels approfondis et qualification stratégique des porteurs de projets.',
        'Vente consultative d\'excellence selon la méthodologie SPIN Selling, de la découverte à la décision.',
        'Traitement et levée des objections complexes avec une approche éthique et bienveillante.',
        'Closing de programmes d\'accompagnement haut de gamme à forte valeur ajoutée.',
        'Suivi relationnel et accompagnement personnalisé vers l\'atteinte des objectifs.'
      ],
      skills: ['Closing High Ticket', 'Vente consultative', 'Méthode SPIN Selling', 'Qualification de prospects', 'Gestion des objections'],
      synergy: 'Casquettes mobilisées : Commerciale, Coach & Stratégie.'
    },
'olm': {
      company: 'OLM Assurances',
      role: 'Manager Commercial & Formation',
      period: '2023 — 2024',
      location: 'Casablanca, Maroc',
      context: 'Courtage en assurances — pilotage direct de la performance commerciale et formation continue.',
      missions: [
        'Management, encadrement et coaching opérationnel des équipes de conseillers commerciaux.',
        'Suivi rigoureux et analyse des indicateurs de performance commerciale (KPI, taux de transformation, DMT).',
        'Conception et animation de formations ciblées sur les produits d’assurance et les techniques de vente.',
        'Mise en place de plans d’action correctifs, challenges d’équipe et accompagnement personnalisé des télévendeurs.'
      ],
      skills: ['Management commercial', 'Pilotage KPI', 'Coaching de performance', 'Ingénierie de formation', 'Animation commerciale'],
      synergy: 'Casquettes mobilisées : Manager, Formatrice & Commerciale.'
    },
    'inveko': {
      company: 'Inveko',
      role: 'Responsable Formation',
      period: '2021 — 2022',
      location: 'Casablanca, Maroc',
      context: 'Structure dynamique intervenant dans les secteurs de l’assurance et de l’environnement.',
      missions: [
        'Pilotage stratégique de l’ensemble du département formation de l’entreprise.',
        'Conception de modules e-learning interactifs et administration complète de la plateforme LMS.',
        'Suivi des indicateurs clés d’acquisition des compétences et réalisation d’audits internes qualité.',
        'Harmonisation des parcours d’intégration et professionnalisation continue des collaborateurs.'
      ],
      skills: ['Direction de la formation', 'E-learning', 'Administration LMS', 'Audits internes', 'Conduite de projets pédagogiques'],
      synergy: 'Casquettes mobilisées : Formatrice, Cheffe de projet & Digital.'
    },
    'courtalys': {
      company: 'Courtalys Assurances',
      role: 'Responsable Formation & RH',
      period: '2019 — 2020',
      location: 'Casablanca, Maroc',
      context: 'Cabinet de courtage en assurances en phase de structuration et de croissance.',
      missions: [
        'Pilotage intégral de la politique de recrutement et élaboration du plan de formation annuel.',
        'Déploiement de la stratégie de marque employeur et attractivité des profils commerciaux.',
        'Accompagnement individuel des collaborateurs et gestion dynamique des carrières.',
        'Conseil en droit du travail, gestion sociale et suivi des indicateurs RH de fidélisation.'
      ],
      skills: ['Recrutement', 'Plan de formation', 'Marque employeur', 'Gestion des carrières', 'Droit social / RH'],
      synergy: 'Casquettes mobilisées : Formatrice, Manager & Cheffe de projet.'
    },
    'freelance': {
      company: 'Formations & Coaching By Sou (Freelance)',
      role: 'Responsable Projet, Formatrice & Coach',
      period: '2015 — 2019',
      location: 'Casablanca, Maroc',
      context: 'Activité indépendante de formation, coaching linguistique et accompagnement de professionnels.',
      missions: [
        'Création, ingénierie et pilotage de projets de formation sur-mesure pour des structures et indépendants.',
        'Animation d’ateliers pratiques en techniques de vente consultative et communication interpersonnelle.',
        'Coaching linguistique et posture professionnelle pour cadres et équipes commerciales.',
        'Développement d’outils d’évaluation des compétences et suivi personnalisé de l’évolution des apprenants.'
      ],
      skills: ['Gestion de projet autonome', 'Coaching linguistique', 'Communication interpersonnelle', 'Pédagogie active', 'Intelligence relationnelle'],
      synergy: 'Casquettes mobilisées : Coach, Formatrice & Cheffe de projet.'
    },
    'rpcm': {
      company: 'RPCM Télécommunications (Right Place Call Morocco)',
      role: 'Manager / Formatrice Commerciale',
      period: '2012 — 2015',
      location: 'Casablanca, Maroc',
      context: 'Centre d’appel opérant sur des comptes majeurs : Orange France & Orange Business Services.',
      missions: [
        'Management hiérarchique et fonctionnel de superviseurs et d’équipes commerciales en centre d’appel.',
        'Pilotage des campagnes stratégiques pour Orange France et Orange Business Services.',
        'Conception et animation des formations initiales et continues en techniques de vente et relation client.',
        'Coaching terrain en double écoute, débriefing et suivi quotidien des KPI quantitatifs et qualitatifs.'
      ],
      skills: ['Management de superviseurs', 'Campagnes Orange France / OBS', 'Télévente & centre d’appel', 'Suivi KPI ViciDial', 'Coaching terrain'],
      synergy: 'Casquettes mobilisées : Manager, Formatrice & Commerciale.'
    },
    'intelcia': {
      company: 'Intelcia',
      role: 'Experte certifiée Google Ads',
      period: '2011 — 2012',
      location: 'Casablanca, Maroc',
      context: 'Leader des services externalisés — pôle acquisition et performance digitale.',
      missions: [
        'Gestion, paramétrage et optimisation continue de campagnes de référencement payant Google Ads (Search & Display).',
        'Analyse des performances de trafic, calcul du retour sur investissement publicitaire (ROAS) et ajustement des enchères.',
        'Accompagnement commercial et conseil en stratégie de visibilité en ligne.',
        'Obtention des certifications officielles Google Ads Search & Display.'
      ],
      skills: ['Google Ads Search', 'Google Ads Display', 'Marketing digital', 'Analyse du ROI', 'Acquisition de trafic'],
      synergy: 'Casquettes mobilisées : Digital & IA, Commerciale.'
    },
    'mismed': {
      company: 'MIS MED Direct',
      role: 'Conseillère Commerciale',
      period: '2008 — 2011',
      location: 'Casablanca, Maroc',
      context: 'Spécialiste de la vente directe à distance de contrats d’assurance santé.',
      missions: [
        'Prospection et vente de contrats de mutuelle et santé par téléphone auprès d’une clientèle de particuliers.',
        'Analyse fine des besoins, bilan de situation et présentation des garanties adaptées.',
        'Traitement des objections, négociation et concrétisation des souscriptions.',
        'Suivi de la satisfaction et fidélisation de la clientèle.'
      ],
      skills: ['Télévente santé', 'Découverte des besoins', 'Traitement des objections', 'Fidélisation client', 'Rigueur d’écoute'],
      synergy: 'Casquettes mobilisées : Commerciale.'
    },
    'majorel': {
      company: 'Majorel / Phone Group',
      role: 'Téléconseillère – Orange France',
      period: '2008 — 2010',
      location: 'Casablanca · Sur site',
      context: 'Service client Orange Mobile — 3 activités majeures au service des abonnés.',
      missions: [
        'Relation Client : accueil personnalisé, écoute active, conseil sur les offres et fidélisation des abonnés Orange Mobile.',
        'SAV (Service Après-Vente) : prise en charge des réclamations et résolution d\'incidents clients.',
        'Support Technique N2 : diagnostic des pannes et coordination avec les équipes d\'expertise technique Orange France.',
        'Respect rigoureux des normes de qualité de service et dépassement des indicateurs de satisfaction (CSAT).'
      ],
      skills: ['Relation client', 'Service après-vente (SAV)', 'Support technique N2', 'Téléphonie mobile', 'Fidélisation'],
      synergy: 'Casquettes mobilisées : Commerciale, Écoute active & Rigueur opérationnelle.'
    }
  };

  const modalBackdrop = document.querySelector('.exp-modal-backdrop');
  const modalContent = document.querySelector('.exp-modal-body');
  const modalCloseBtn = document.querySelector('.modal-close-btn');

  const openExpModal = (expId) => {
    const data = experienceDetails[expId];
    if (!data || !modalBackdrop || !modalContent) return;

    modalContent.innerHTML = `
      <div style="margin-bottom: 20px;">
        <span style="font-size: 0.8rem; font-weight: 700; color: var(--gold-champagne); letter-spacing: 0.1em; text-transform: uppercase;">${data.period} · ${data.location}</span>
        <h3 style="font-size: 1.6rem; margin-top: 6px; margin-bottom: 4px;">${data.company}</h3>
        <p style="font-size: 1.1rem; color: var(--gold-light); font-weight: 600;">${data.role}</p>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px;">
        <p style="font-size: 0.95rem; color: var(--text-secondary); line-height: 1.6; margin: 0;"><strong>Contexte :</strong> ${data.context}</p>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-sans); font-size: 0.95rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--gold-champagne); margin-bottom: 14px;">Missions & Réalisations</h4>
        <ul style="list-style: none; display: flex; flex-direction: column; gap: 10px; padding: 0;">
          ${data.missions.map(m => `
            <li style="display: flex; gap: 10px; font-size: 0.92rem; color: var(--text-primary); line-height: 1.55;">
              <span style="color: var(--gold-champagne); font-weight: bold;">●</span>
              <span>${m}</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 24px;">
        <h4 style="font-family: var(--font-sans); font-size: 0.85rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-muted); margin-bottom: 10px;">Compétences mobilisées</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${data.skills.map(s => `
            <span style="font-size: 0.76rem; padding: 4px 10px; background: var(--gold-subtle); border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); color: var(--gold-light);">${s}</span>
          `).join('')}
        </div>
      </div>

      <div style="padding-top: 16px; border-top: 1px solid var(--border-light); font-size: 0.88rem; color: var(--gold-champagne); font-style: italic;">
        ${data.synergy}
      </div>
    `;

    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeExpModal = () => {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  expCards.forEach(card => {
    card.addEventListener('click', () => {
      const expId = card.getAttribute('data-exp-id');
      if (expId) openExpModal(expId);
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeExpModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeExpModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop && modalBackdrop.classList.contains('open')) {
      closeExpModal();
    }
  });

  // ========================================================================
  // 5. CONTACT (COPIE PRESSE-PAPIERS & FORMULAIRE)
  // ========================================================================
  const copyBtns = document.querySelectorAll('.copy-trigger');
  copyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-copy');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          const originalText = btn.getAttribute('data-label') || '';
          const valEl = btn.querySelector('.val-text');
          if (valEl) {
            valEl.textContent = 'Copié dans le presse-papiers ✓';
            setTimeout(() => {
              valEl.textContent = textToCopy;
            }, 2500);
          }
        }).catch(err => {
          console.warn('Erreur copie :', err);
        });
      }
    });
  });


  // ========================================================================
  // 6. ANIMATION 3D DE L'ESCALIER DU PARCOURS (DESSIN DESCENDANT DES MARCHES)
  // ========================================================================
  const staircaseStage = document.getElementById('staircase-stage');
  const stairSvg = document.getElementById('staircase-svg');
  const stairBgPath = document.getElementById('stair-bg-path');
  const stairDrawPath = document.getElementById('stair-draw-path');
  const stairTracer = document.getElementById('stair-tracer');
  const stairStepItems = document.querySelectorAll('.stair-step-item');
  const stairReplayBtn = document.getElementById('stair-replay-trigger');

  let stairAnimFrame = null;
  let isStairAnimating = false;
  let stairDrawn = false;
  let stepThresholds = [];

  // Calcule et trace le parcours en escalier 3D dynamique
  function buildStaircasePath() {
    if (!staircaseStage || !stairSvg || !stairBgPath || !stairDrawPath || stairStepItems.length === 0) return;

    const stageRect = staircaseStage.getBoundingClientRect();
    const stageWidth = stageRect.width;
    const stageHeight = stageRect.height;

    // Met à jour la viewBox du SVG pour matcher les dimensions réelles en pixels
    stairSvg.setAttribute('viewBox', `0 0 ${stageWidth} ${stageHeight}`);

    const isMobile = window.innerWidth < 768;
    const points = [];

    stairStepItems.forEach((item, index) => {
      const card = item.querySelector('.stair-card-3d') || item;
      const cardRect = card.getBoundingClientRect();

      const topY = cardRect.top - stageRect.top;
      const midY = topY + cardRect.height * 0.45;
      const bottomY = topY + cardRect.height;
      const leftX = cardRect.left - stageRect.left;
      const rightX = cardRect.right - stageRect.left;
      const centerX = (leftX + rightX) / 2;

      points.push({
        index,
        leftX,
        rightX,
        centerX,
        topY,
        midY,
        bottomY,
        isLeft: item.classList.contains('stair-step-left'),
        isRight: item.classList.contains('stair-step-right'),
        isPinnacle: item.classList.contains('stair-step-pinnacle')
      });
    });

    let d = '';

    if (isMobile) {
      // Sur mobile : tracé en escalier descendant le long du flanc gauche
      const railX = Math.max(16, points[0].leftX - 12);
      d = `M ${railX} ${Math.max(0, points[0].topY - 20)}`;

      points.forEach((pt, i) => {
        // Descente verticale (contre-marche)
        d += ` L ${railX} ${pt.midY}`;
        // Marche vers la carte
        d += ` L ${pt.leftX + 24} ${pt.midY}`;
        if (i < points.length - 1) {
          // Retour au rail
          d += ` L ${railX} ${pt.midY}`;
        }
      });
    } else {
      // Sur Desktop : Tracé architectural en escalier descendant alterné
      const first = points[0];
      const startX = first.leftX + 20;
      const startY = Math.max(10, first.topY - 25);

      d = `M ${startX} ${startY}`;
      // Descente vers la première marche
      d += ` L ${startX} ${first.midY}`;

      for (let i = 0; i < points.length; i++) {
        const cur = points[i];
        const next = points[i + 1];

        if (cur.isLeft) {
          // Traverse la marche gauche vers la droite
          d += ` L ${cur.rightX} ${cur.midY}`;

          if (next) {
            const midDropY = cur.midY + (next.midY - cur.midY) * 0.5;
            // Descente verticale de marche (riser)
            d += ` L ${cur.rightX} ${midDropY}`;
            // Enjambée horizontale vers la droite
            if (next.isRight) {
              d += ` L ${next.leftX} ${midDropY}`;
              // Descente vers la marche droite
              d += ` L ${next.leftX} ${next.midY}`;
            } else if (next.isPinnacle) {
              d += ` L ${next.centerX} ${midDropY}`;
              d += ` L ${next.centerX} ${next.topY}`;
            }
          }
        } else if (cur.isRight) {
          // Traverse la marche droite vers la gauche
          d += ` L ${cur.leftX} ${cur.midY}`;

          if (next) {
            const midDropY = cur.midY + (next.midY - cur.midY) * 0.5;
            // Descente verticale de marche (riser)
            d += ` L ${cur.leftX} ${midDropY}`;
            // Enjambée horizontale vers la gauche
            if (next.isLeft) {
              d += ` L ${next.rightX} ${midDropY}`;
              // Descente vers la marche gauche
              d += ` L ${next.rightX} ${next.midY}`;
            } else if (next.isPinnacle) {
              d += ` L ${next.centerX} ${midDropY}`;
              d += ` L ${next.centerX} ${next.topY}`;
            }
          }
        } else if (cur.isPinnacle) {
          // Arrivée au palier sommet (Alkimy - Aujourd'hui)
          d += ` L ${cur.centerX} ${cur.midY}`;
          d += ` L ${cur.rightX - 30} ${cur.midY}`;
          d += ` L ${cur.leftX + 30} ${cur.midY}`;
          d += ` L ${cur.centerX} ${cur.midY}`;
        }
      }
    }

    // Applique le tracé sur le fond (guide estompé) et sur le tracé actif
    stairBgPath.setAttribute('d', d);
    stairDrawPath.setAttribute('d', d);

    // Calcule la longueur totale du tracé
    const totalLength = stairDrawPath.getTotalLength();
    stairDrawPath.style.strokeDasharray = `${totalLength} ${totalLength}`;

    // Calcule les seuils de progression pour révéler chaque marche au bon moment
    stepThresholds = [];
    const stepCount = stairStepItems.length;
    for (let i = 0; i < stepCount; i++) {
      // Seuil proportionnel échelonné
      stepThresholds.push((i + 0.6) / stepCount);
    }

    return totalLength;
  }

  // Animation fluide de descente de l'escalier (3D drawing)
  function runStaircaseAnimation(duration = 3200) {
    if (isStairAnimating) return;
    isStairAnimating = true;

    const totalLength = buildStaircasePath();
    if (!totalLength || totalLength <= 0) {
      isStairAnimating = false;
      return;
    }

    // Réinitialise l'état de toutes les marches
    stairStepItems.forEach(item => item.classList.remove('revealed-step'));
    stairDrawPath.style.strokeDashoffset = totalLength;

    if (stairTracer) {
      stairTracer.classList.add('active');
      const startPt = stairDrawPath.getPointAtLength(0);
      stairTracer.setAttribute('cx', startPt.x);
      stairTracer.setAttribute('cy', startPt.y);
    }

    let startTime = null;

    function animateStep(timestamp) {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const linearProgress = Math.min(elapsed / duration, 1);

      // Courbe d'accélération/décélération fluide (ease-in-out cubique)
      const easeProgress = linearProgress < 0.5
        ? 4 * linearProgress * linearProgress * linearProgress
        : 1 - Math.pow(-2 * linearProgress + 2, 3) / 2;

      const currentLength = totalLength * easeProgress;
      stairDrawPath.style.strokeDashoffset = totalLength - currentLength;

      // Positionne l'orbe traceur le long du chemin
      if (stairTracer && currentLength > 0) {
        try {
          const pt = stairDrawPath.getPointAtLength(currentLength);
          stairTracer.setAttribute('cx', pt.x);
          stairTracer.setAttribute('cy', pt.y);
        } catch (e) {}
      }

      // Révèle chaque marche 3D dès que l'orbe traceur atteint son palier
      stepThresholds.forEach((thresh, idx) => {
        if (easeProgress >= thresh && stairStepItems[idx]) {
          if (!stairStepItems[idx].classList.contains('revealed-step')) {
            stairStepItems[idx].classList.add('revealed-step');
          }
        }
      });

      if (linearProgress < 1) {
        stairAnimFrame = requestAnimationFrame(animateStep);
      } else {
        // Animation achevée : assure que toutes les marches sont bien révélées
        stairStepItems.forEach(item => item.classList.add('revealed-step'));
        stairDrawPath.style.strokeDashoffset = 0;
        isStairAnimating = false;
        stairDrawn = true;
      }
    }

    if (stairAnimFrame) cancelAnimationFrame(stairAnimFrame);
    stairAnimFrame = requestAnimationFrame(animateStep);
  }

  // Observer pour déclencher la descente 3D au scroll vers la section Parcours
  const parcoursSection = document.getElementById('parcours');
  if (parcoursSection) {
    const stairObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !stairDrawn) {
          // Petit délai pour laisser le rendu visuel s'installer
          setTimeout(() => {
            runStaircaseAnimation(3200);
          }, 200);
          stairObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    stairObserver.observe(parcoursSection);
  }

  // Bouton interactif pour rejouer l'animation de descente
  if (stairReplayBtn) {
    stairReplayBtn.addEventListener('click', () => {
      runStaircaseAnimation(2800);
    });
  }

  // Recalcul du tracé vectoriel au redimensionnement de la fenêtre
  let resizeTimeout = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      buildStaircasePath();
      if (stairDrawn) {
        stairDrawPath.style.strokeDashoffset = 0;
      }
    }, 150);
  }, { passive: true });

  // Initialisation au chargement
  setTimeout(() => {
    buildStaircasePath();
  }, 300);

});
