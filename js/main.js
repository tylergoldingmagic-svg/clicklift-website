/* Click Lift site script: header, mobile menu, starfield, typed service line,
   scroll reveals, stat counters, service animations, the clients rocket, the About badge tilt
   and the contact form.
   No dependencies. */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Header: solid background once you scroll ---------- */
  const header = document.querySelector('[data-header]');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('[data-nav-toggle]');
  const menu = document.querySelector('[data-nav-menu]');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      if (header) header.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    const desktop = window.matchMedia('(min-width: 821px)');
    const closeOnDesktop = (event) => { if (event.matches) setOpen(false); };
    if (desktop.addEventListener) desktop.addEventListener('change', closeOnDesktop);
  }

  /* ---------- Starfield ---------- */
  const canvas = document.querySelector('[data-starfield]');
  if (canvas && canvas.getContext) initStarfield(canvas);

  function initStarfield(canvas) {
    const ctx = canvas.getContext('2d');
    const COLORS = ['255,255,255', '255,255,255', '255,255,255', '226,210,255', '226,210,255', '255,226,176'];
    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    let width = 0;
    let height = 0;
    let lastWidth = 0;
    let stars = [];
    let streak = null;
    let nextStreak = performance.now() + 2500;
    let running = false;
    let inView = true;
    let rafId = 0;
    let lastTime = 0;

    function makeStars() {
      const count = Math.round(Math.min(460, Math.max(120, (width * height) / 2600)));
      stars = [];
      for (let i = 0; i < count; i += 1) {
        const depth = Math.random();
        stars.push({
          x: Math.random(), // positions are stored 0..1 so resizes don't reshuffle the sky
          y: Math.random(),
          depth,
          r: 0.3 + depth * depth * 1.2 + (Math.random() < 0.025 ? 0.7 : 0),
          alpha: 0.25 + Math.random() * 0.7,
          speed: 0.5 + Math.random() * 1.8,
          phase: Math.random() * Math.PI * 2,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        });
      }
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!stars.length || Math.abs(width - lastWidth) > 40) {
        makeStars();
        lastWidth = width;
      }
      if (!running) draw(performance.now(), 0);
    }

    function drawStreak(now) {
      if (!streak) {
        if (now < nextStreak) return;
        streak = {
          x: width * (0.05 + Math.random() * 0.55),
          y: height * (0.3 + Math.random() * 0.4),
          angle: -Math.PI / 5 - Math.random() * 0.3, // up and to the right, like the logo
          length: 110 + Math.random() * 110,
          speed: 650 + Math.random() * 350,
          start: now,
          life: 950,
        };
      }
      const t = (now - streak.start) / streak.life;
      if (t >= 1) {
        streak = null;
        nextStreak = now + 6000 + Math.random() * 8000;
        return;
      }
      const distance = (streak.speed * (now - streak.start)) / 1000;
      const headX = streak.x + Math.cos(streak.angle) * distance;
      const headY = streak.y + Math.sin(streak.angle) * distance;
      const tailX = headX - Math.cos(streak.angle) * streak.length;
      const tailY = headY - Math.sin(streak.angle) * streak.length;
      const fade = Math.sin(Math.PI * t);
      const gradient = ctx.createLinearGradient(tailX, tailY, headX, headY);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
      gradient.addColorStop(1, `rgba(255, 236, 200, ${0.8 * fade})`);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.4;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.stroke();
    }

    function draw(now, dt) {
      const animate = !reduceMotion.matches;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.04;
      pointer.y += (pointer.ty - pointer.y) * 0.04;

      for (const star of stars) {
        if (animate) {
          star.x -= (0.0015 + star.depth * 0.006) * dt; // slow drift
          if (star.x < -0.01) star.x += 1.02;
        }
        const twinkle = animate ? 0.6 + 0.4 * Math.sin(now * 0.001 * star.speed + star.phase) : 1;
        const x = star.x * width + pointer.x * star.depth * 18;
        const y = star.y * height + pointer.y * star.depth * 12;
        ctx.fillStyle = `rgb(${star.color})`;
        ctx.globalAlpha = star.alpha * twinkle;
        ctx.beginPath();
        ctx.arc(x, y, star.r, 0, Math.PI * 2);
        ctx.fill();
        if (star.r > 1.2) {
          ctx.globalAlpha = star.alpha * twinkle * 0.12;
          ctx.beginPath();
          ctx.arc(x, y, star.r * 4, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      if (animate) drawStreak(now);
      ctx.globalAlpha = 1;
    }

    function frame(now) {
      if (!running) return;
      const dt = lastTime ? Math.min(0.05, (now - lastTime) / 1000) : 0;
      lastTime = now;
      draw(now, dt);
      rafId = requestAnimationFrame(frame);
    }

    function start() {
      if (running || reduceMotion.matches || !inView || document.hidden) return;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }).observe(canvas);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', () => {
        stop();
        draw(performance.now(), 0);
        start();
      });
    }
    window.addEventListener('pointermove', (event) => {
      pointer.tx = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (event.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 120);
    });

    resize();
    start();
  }

  /* ---------- Hero typewriter: types out one service at a time ---------- */
  const typer = document.querySelector('[data-typer]');
  if (typer) initTyper(typer);

  function initTyper(el) {
    const output = el.querySelector('[data-typer-text]');
    const words = (el.dataset.words || '').split('|').map((word) => word.trim()).filter(Boolean);
    if (!output || !words.length) return;

    const TYPE_MIN = 45; // ms per letter, randomised so it types like a person
    const TYPE_MAX = 120;
    const DELETE = 32; // ms per letter when backspacing
    const HOLD = 1900; // how long a finished service stays up
    const GAP = 420; // empty pause before the next one
    const STILL = 2800; // reduced motion: whole services swap in, no typing

    let word = 0;
    let letters = 0;
    let deleting = false;
    let timer = 0;
    let paused = false;
    let inView = true;

    const typing = (on) => el.classList.toggle('is-typing', on);
    const later = (ms) => {
      clearTimeout(timer);
      timer = setTimeout(step, ms);
    };

    function step() {
      if (reduceMotion.matches) {
        if (output.textContent === words[word]) word = (word + 1) % words.length;
        output.textContent = words[word];
        letters = words[word].length;
        deleting = true; // if motion is switched back on, this one gets backspaced next
        typing(false);
        later(STILL);
        return;
      }

      const text = words[word];
      if (!deleting) {
        letters += 1;
        output.textContent = text.slice(0, letters);
        if (letters < text.length) {
          typing(true);
          later(TYPE_MIN + Math.random() * (TYPE_MAX - TYPE_MIN));
        } else {
          typing(false); // the caret blinks while the finished service sits there
          deleting = true;
          later(HOLD);
        }
      } else {
        letters -= 1;
        output.textContent = text.slice(0, letters);
        if (letters > 0) {
          typing(true);
          later(DELETE);
        } else {
          typing(false);
          deleting = false;
          word = (word + 1) % words.length;
          later(GAP);
        }
      }
    }

    // Only type while the hero is on screen and the tab is visible.
    const pause = () => {
      paused = true;
      clearTimeout(timer);
    };
    const resume = () => {
      if (!paused || !inView || document.hidden) return;
      paused = false;
      later(300);
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) resume(); else pause();
      }).observe(el);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? pause() : resume()));

    if (reduceMotion.matches) {
      output.textContent = words[0];
      letters = words[0].length;
      deleting = true;
      later(STILL);
    } else {
      output.textContent = '';
      later(700); // let the hero fade in first
    }
    if (document.hidden) pause(); // opened in a background tab: start when it's shown
    el.classList.add('is-ready');
  }

  /* ---------- Scroll reveals ---------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const format = new Intl.NumberFormat('en-US');
    const run = (el) => {
      const target = Number(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const started = performance.now();
      const tick = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - Math.pow(1 - progress, 4);
        el.textContent = format.format(Math.round(target * eased)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          run(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => {
      if (Number(el.dataset.count) > 0) {
        el.textContent = `0${el.dataset.suffix || ''}`;
        counterObserver.observe(el);
      }
    });
  }

  /* ---------- Service animations: only run while they're on screen ---------- */
  const scenes = document.querySelectorAll('[data-scene]');
  if ('IntersectionObserver' in window && scenes.length) {
    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.target.classList.toggle('is-paused', !entry.isIntersecting));
    }, { rootMargin: '60px 0px' });
    scenes.forEach((scene) => sceneObserver.observe(scene));
  }

  /* ---------- "Whatever you freaking need" card: a new banner every pass ---------- */
  const tow = document.querySelector('[data-tow]');
  if (tow) initTow(tow);

  function initTow(el) {
    const banner = el.querySelector('[data-tow-text]');
    const lines = (el.dataset.banners || '').split('|').map((line) => line.trim()).filter(Boolean);
    if (!banner || !lines.length) return;
    let current = 0;
    const show = () => {
      // Reduced motion: the banner holds still, so it shows the slogan (the last line).
      if (reduceMotion.matches) current = lines.length - 1;
      banner.textContent = lines[current];
    };
    el.addEventListener('animationiteration', (event) => {
      if (event.target !== el) return; // ignore the bob and flutter animations inside
      current = (current + 1) % lines.length;
      show();
    });
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', () => {
        current = 0;
        show();
      });
    }
    show();
  }

  /* ---------- Clients: the rocket makes the rounds ---------- */
  const clientsBoard = document.querySelector('[data-clients]');
  if (clientsBoard) initClientTour(clientsBoard);

  function initClientTour(board) {
    const rocket = board.querySelector('[data-clients-rocket]');
    const canvas = board.querySelector('[data-clients-trail]');
    const tiles = Array.from(board.querySelectorAll('[data-client]'));
    if (!rocket || !canvas || !canvas.getContext || !tiles.length) return;

    const ctx = canvas.getContext('2d');
    const BLEED = 48; // the trail canvas reaches past the board by this much (matches the CSS)
    const TRAIL_LIFE = 1100; // ms a trail dot takes to fade
    let width = 0;
    let height = 0;
    let running = false;
    let inView = false;
    let rafId = 0;
    let lastTime = 0;
    let pausedAt = 0;
    let pos = null; // rocket position, in px from the board's top-left
    let heading = -45; // degrees; -90 is straight up, the logo flies at -45
    let flight = null;
    let docked = null;
    let dockUntil = 0;
    let hovered = null; // the rocket stays put while someone is looking at its card
    let trail = [];
    let lastDot = null;

    function sizeCanvas() {
      const rect = board.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width + BLEED * 2;
      height = rect.height + BLEED * 2;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Where the rocket parks: just off the top-right corner of a card.
    function dockPoint(tile) {
      const b = board.getBoundingClientRect();
      const r = tile.getBoundingClientRect();
      return { x: r.right - b.left - 2, y: r.top - b.top + 2 };
    }

    function pickNext() {
      const vh = window.innerHeight;
      const others = tiles.filter((tile) => tile !== docked && (!flight || tile !== flight.tile));
      const onScreen = others.filter((tile) => {
        const r = tile.getBoundingClientRect();
        return r.bottom > 60 && r.top < vh - 60;
      });
      const pool = onScreen.length ? onScreen : others;
      return pool[Math.floor(Math.random() * pool.length)];
    }

    function flyTo(tile, now) {
      if (!tile) return;
      const from = pos || { x: -BLEED * 0.6, y: -BLEED * 0.6 };
      const to = dockPoint(tile);
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const dist = Math.hypot(dx, dy) || 1;
      const bend = (Math.random() < 0.5 ? -1 : 1) * Math.min(110, dist * 0.32);
      flight = {
        tile,
        from,
        // the control point sits off to one side, so every hop is a gentle arc
        ctrl: { x: (from.x + to.x) / 2 - (dy / dist) * bend, y: (from.y + to.y) / 2 + (dx / dist) * bend },
        start: now,
        duration: Math.min(2100, 620 + dist * 1.05),
      };
      if (docked) docked.classList.remove('is-lit');
      docked = null;
      rocket.classList.add('is-flying');
    }

    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const bezier = (a, c, b, t) => ({
      x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
      y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
    });
    const tangent = (a, c, b, t) => ({
      x: 2 * (1 - t) * (c.x - a.x) + 2 * t * (b.x - c.x),
      y: 2 * (1 - t) * (c.y - a.y) + 2 * t * (b.y - c.y),
    });
    const turnToward = (target, amount) => {
      const delta = ((target - heading + 540) % 360) - 180;
      heading += delta * amount;
    };

    function frame(now) {
      if (!running) return;
      const dt = lastTime ? Math.min(64, now - lastTime) : 16;
      lastTime = now;

      if (flight) {
        const t = Math.min(1, (now - flight.start) / flight.duration);
        const e = ease(t);
        const to = dockPoint(flight.tile); // follows the card if it moves (hover lift, resize)
        pos = bezier(flight.from, flight.ctrl, to, e);
        const d = tangent(flight.from, flight.ctrl, to, Math.min(0.995, Math.max(0.005, e)));
        turnToward(Math.atan2(d.y, d.x) * (180 / Math.PI), Math.min(1, dt / 60));
        const tail = { x: pos.x - Math.cos(heading * Math.PI / 180) * 13, y: pos.y - Math.sin(heading * Math.PI / 180) * 13 };
        if (!lastDot || Math.hypot(tail.x - lastDot.x, tail.y - lastDot.y) > 7) {
          trail.push({ x: tail.x, y: tail.y, born: now });
          lastDot = tail;
        }
        if (t >= 1) {
          docked = flight.tile;
          docked.classList.add('is-lit');
          flight = null;
          lastDot = null;
          rocket.classList.remove('is-flying');
          dockUntil = now + 1500 + Math.random() * 900;
        }
      } else if (docked) {
        const p = dockPoint(docked);
        pos = { x: p.x, y: p.y + Math.sin(now / 420) * 2 }; // gentle hover while parked
        turnToward(-45, Math.min(1, dt / 220)); // settle into the logo's angle
        if (now > dockUntil && docked !== hovered) flyTo(pickNext(), now);
      } else {
        flyTo(pickNext(), now);
      }

      draw(now);
      rafId = requestAnimationFrame(frame);
    }

    function draw(now) {
      ctx.clearRect(0, 0, width, height);
      trail = trail.filter((dot) => now - dot.born < TRAIL_LIFE);
      for (const dot of trail) {
        const life = 1 - (now - dot.born) / TRAIL_LIFE;
        ctx.globalAlpha = 0.85 * life;
        ctx.fillStyle = '#ffd58a';
        ctx.beginPath();
        ctx.arc(dot.x + BLEED, dot.y + BLEED, 0.8 + life * 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (pos) {
        rocket.style.transform = `translate(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px) rotate(${(heading + 90).toFixed(1)}deg) translate(-50%, -50%)`;
      }
    }

    function start() {
      if (running || !inView || document.hidden || reduceMotion.matches) return;
      const now = performance.now();
      if (pausedAt) {
        // pick up where it left off instead of jumping ahead
        const gap = now - pausedAt;
        if (flight) flight.start += gap;
        dockUntil += gap;
        trail.forEach((dot) => { dot.born += gap; });
        pausedAt = 0;
      }
      sizeCanvas();
      rocket.hidden = false;
      running = true;
      lastTime = 0;
      rafId = requestAnimationFrame(frame);
    }

    function stop() {
      if (!running) return;
      running = false;
      pausedAt = performance.now();
      cancelAnimationFrame(rafId);
    }

    // Hover or tab to a logo and the rocket heads straight there.
    tiles.forEach((tile) => {
      const visit = () => {
        hovered = tile;
        if (running && docked !== tile && (!flight || flight.tile !== tile)) flyTo(tile, performance.now());
      };
      const leave = () => {
        if (hovered !== tile) return;
        hovered = null;
        dockUntil = Math.max(dockUntil, performance.now() + 700);
      };
      tile.addEventListener('pointerenter', visit);
      tile.addEventListener('focusin', visit);
      tile.addEventListener('pointerleave', leave);
      tile.addEventListener('focusout', leave);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        if (inView) start(); else stop();
      }, { threshold: 0.12 }).observe(board);
    }
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', () => {
        if (reduceMotion.matches) {
          stop();
          rocket.hidden = true;
          tiles.forEach((tile) => tile.classList.remove('is-lit'));
          ctx.clearRect(0, 0, width, height);
        } else {
          start();
        }
      });
    }
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (running) sizeCanvas();
      }, 150);
    });
  }

  /* ---------- About: Tyler's crew badge turns to face the pointer (and leans with the scroll on touch screens) ---------- */
  const badgeFigure = document.querySelector('[data-badge]');
  if (badgeFigure) initBadge(badgeFigure);

  function initBadge(figure) {
    const badge = figure.querySelector('.badge');
    if (!badge) return;

    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    const MAX_X = 7; // degrees the card leans top to bottom
    const MAX_Y = 10; // degrees it turns left to right
    const now = { rx: 0, ry: 0, gx: 0, gy: 0, lift: 0 };
    const goal = { rx: 0, ry: 0, gx: 0, gy: 0, lift: 0 };
    let pointer = null; // last mouse position, while the mouse is in the window
    let inView = false;
    let rafId = 0;
    let lastTime = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    // Where the card should face.
    function aim() {
      const rect = figure.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (pointer && finePointer.matches) {
        // Face the mouse, wherever it is on the page; lift a little when it's on the card.
        const nx = clamp((pointer.x - cx) / (rect.width * 0.9), -1, 1);
        const ny = clamp((pointer.y - cy) / (rect.height * 0.75), -1, 1);
        goal.rx = -ny * MAX_X;
        goal.ry = nx * MAX_Y;
        goal.gx = nx;
        goal.gy = ny;
        goal.lift = pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom ? 1 : 0;
      } else {
        // No mouse: lean gently as the card travels up the screen.
        const view = window.innerHeight || 1;
        const p = clamp((cy - view / 2) / (view * 0.6), -1, 1);
        goal.rx = p * 6;
        goal.ry = -p * 4;
        goal.gx = -p * 0.8;
        goal.gy = p * 0.6;
        goal.lift = 0;
      }
    }

    function paint() {
      badge.style.setProperty('--rx', now.rx.toFixed(3));
      badge.style.setProperty('--ry', now.ry.toFixed(3));
      badge.style.setProperty('--gx', now.gx.toFixed(3));
      badge.style.setProperty('--gy', now.gy.toFixed(3));
      badge.style.setProperty('--glare', Math.min(1, Math.hypot(now.gx, now.gy)).toFixed(3));
      badge.style.setProperty('--lift', now.lift.toFixed(3));
    }

    function frame(time) {
      const dt = lastTime ? Math.min(0.05, (time - lastTime) / 1000) : 1 / 60;
      lastTime = time;
      const ease = 1 - Math.exp(-dt * 7); // smooth follow, frame-rate independent
      let settled = true;
      Object.keys(goal).forEach((key) => {
        const diff = goal[key] - now[key];
        if (Math.abs(diff) > 0.002) settled = false;
        now[key] += diff * ease;
      });
      paint();
      if (settled) {
        rafId = 0;
        lastTime = 0;
      } else {
        rafId = requestAnimationFrame(frame);
      }
    }

    function kick() {
      if (!inView || reduceMotion.matches) return;
      aim();
      if (!rafId) rafId = requestAnimationFrame(frame);
    }

    function rest() {
      cancelAnimationFrame(rafId);
      rafId = 0;
      lastTime = 0;
      Object.keys(goal).forEach((key) => { goal[key] = 0; now[key] = 0; });
      paint();
    }

    window.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      pointer = { x: event.clientX, y: event.clientY };
      kick();
    }, { passive: true });
    document.documentElement.addEventListener('pointerleave', () => {
      pointer = null;
      kick();
    });
    window.addEventListener('scroll', kick, { passive: true });
    window.addEventListener('resize', kick);
    if (finePointer.addEventListener) finePointer.addEventListener('change', kick);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        inView = entries[0].isIntersecting;
        figure.classList.toggle('is-paused', !inView);
        kick();
      }).observe(figure);
    } else {
      inView = true;
    }
    if (reduceMotion.addEventListener) {
      reduceMotion.addEventListener('change', () => (reduceMotion.matches ? rest() : kick()));
    }
  }

  /* ---------- Service CTAs pre-select what the visitor needs ---------- */
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-need]');
    if (!trigger) return;
    const value = trigger.getAttribute('data-need');
    const box = Array.from(document.querySelectorAll('input[name="needs"]')).find((input) => input.value === value);
    if (box) box.checked = true;
  });

  /* ---------- Contact form ---------- */
  const form = document.querySelector('[data-contact-form]');
  if (form) initForm(form);

  function initForm(form) {
    const status = form.querySelector('[data-form-status]');
    const submit = form.querySelector('[data-submit]');
    const submitLabel = form.querySelector('[data-submit-label]');
    const success = document.querySelector('[data-form-success]');
    const successText = success ? success.querySelector('[data-success-text]') : null;
    const resetButton = success ? success.querySelector('[data-form-reset]') : null;
    const action = form.getAttribute('action');
    const endpoint = action.replace('formsubmit.co/', 'formsubmit.co/ajax/');
    const inbox = action.split('/').pop();
    const required = Array.from(form.querySelectorAll('input[required], textarea[required]'));

    const setFieldError = (field, show) => {
      const error = document.getElementById(`${field.id}-error`);
      if (show) {
        field.setAttribute('aria-invalid', 'true');
        if (error) {
          error.hidden = false;
          field.setAttribute('aria-describedby', error.id);
        }
      } else {
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        if (error) error.hidden = true;
      }
    };

    const validate = (field) => {
      const valid = field.value.trim() !== '' && field.checkValidity();
      setFieldError(field, !valid);
      return valid;
    };

    required.forEach((field) => {
      field.addEventListener('blur', () => { if (field.value) validate(field); });
      field.addEventListener('input', () => {
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
      });
    });

    const setStatus = (content, isError) => {
      status.replaceChildren(...(Array.isArray(content) ? content : [content]));
      status.classList.toggle('is-error', Boolean(isError));
    };

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      setStatus('', false);

      const invalid = required.filter((field) => !validate(field));
      if (invalid.length) {
        invalid[0].focus();
        setStatus('Please fill in the highlighted fields.', true);
        return;
      }

      const formData = new FormData(form);
      const needs = formData.getAll('needs');
      formData.delete('needs');
      const data = Object.fromEntries(formData.entries());
      if (needs.length) data.needs = needs.join(', ');
      if (data._honey) return; // bots fill hidden fields; people don't

      submit.disabled = true;
      submit.setAttribute('aria-busy', 'true');
      submitLabel.textContent = 'Sending…';

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || String(result.success) !== 'true') {
          throw new Error(result.message || `Request failed (${response.status})`);
        }
        form.reset();
        form.hidden = true;
        if (successText) {
          successText.textContent = `Thanks, ${data.first_name.trim()}! We'll be in touch soon about whatever you freaking need.`;
        }
        if (success) {
          success.hidden = false;
          success.focus();
        }
      } catch (error) {
        const body = [
          `Name: ${data.first_name} ${data.last_name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone}`,
          `Needs: ${data.needs || 'Not sure yet'}`,
          '',
          data.message || '',
        ].join('\n');
        const link = document.createElement('a');
        link.href = `mailto:${inbox}?subject=${encodeURIComponent('Website inquiry')}&body=${encodeURIComponent(body)}`;
        link.textContent = 'email us directly';
        setStatus([
          document.createTextNode("Hmm, that didn't send. Please "),
          link,
          document.createTextNode(" and we'll get right back to you."),
        ], true);
      } finally {
        submit.disabled = false;
        submit.removeAttribute('aria-busy');
        submitLabel.textContent = 'Send it';
      }
    });

    if (resetButton) {
      resetButton.addEventListener('click', () => {
        success.hidden = true;
        form.hidden = false;
        const first = form.querySelector('#first-name');
        if (first) first.focus();
      });
    }
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
})();
