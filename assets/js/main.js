/* ================================================
   CYBER APPAREL CO. — MAIN JS v2
   ================================================ */

'use strict';

/* ---- CURSOR ---- */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(loop);
  })();
})();

/* ---- NAV: active link + hamburger ---- */
(function initNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === path) a.classList.add('active');
  });

  const burger  = document.getElementById('hamburger');
  const mobMenu = document.getElementById('mobile-menu');
  if (burger && mobMenu) {
    burger.addEventListener('click', () => {
      mobMenu.classList.toggle('open');
      document.body.style.overflow = mobMenu.classList.contains('open') ? 'hidden' : '';
    });
    mobMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }
})();

/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
})();

/* ---- GALLERY (product page) ---- */
(function initGallery() {
  const main   = document.getElementById('gallery-main-img');
  const thumbs = document.querySelectorAll('.gallery-thumb');
  if (!main || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.src;
      if (main.src.endsWith(src)) return;
      main.classList.add('switching');
      setTimeout(() => {
        main.src = src;
        main.onload = () => main.classList.remove('switching');
      }, 200);
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
})();

/* ---- SHIRT FLIP (hero) ---- */
(function initShirtFlip() {
  const btn  = document.getElementById('shirt-flip-btn');
  const img  = document.getElementById('hero-shirt-img');
  if (!btn || !img) return;

  const front = img.dataset.front;
  const back  = img.dataset.back;
  let showingFront = true;

  btn.addEventListener('click', () => {
    img.style.opacity = '0';
    img.style.transform = 'scale(0.95)';
    setTimeout(() => {
      showingFront = !showingFront;
      img.src = showingFront ? front : back;
      btn.textContent = showingFront ? 'View Back →' : 'View Front →';
      img.style.opacity = '1';
      img.style.transform = 'scale(1)';
    }, 250);
  });
  img.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
})();

/* ---- SIZE SELECTOR ---- */
(function initSizes() {
  const btns = document.querySelectorAll('.size-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
})();

/* ---- HASH REVEAL ---- */
(function initHashReveal() {
  const block = document.getElementById('hash-reveal');
  if (!block) return;
  const header = block.querySelector('.hash-header');
  header.addEventListener('click', () => block.classList.toggle('open'));
})();

/* ---- VERIFY LOGIC ---- */
(function initVerify() {
  const form = document.getElementById('verify-form');
  if (!form) return;

  // Embedded fallback data so it works with file://
  const FALLBACK = {
    artifacts: [
      {
        id: 'CA-AI-CHUNK-0001',
        title: 'AI Gits Better By The Chunk',
        drop: 'Drop 001',
        release_date: '2025-06-01',
        creator_mark: 'Cyber Apparel Co. / CAC-MARK-001',
        copyright: '© 2025 Cyber Apparel Co. All rights reserved.',
        claimed_marks: ['CYBER APPAREL CO.','CAC','AI GITS BETTER BY THE CHUNK','AI .CHUNK','DROP 001'],
        sha256_garment:  'a3f8c2e1d94b76f05a2c3e8d1f94b76f05a2c3e8d1f94b76f05a2c3e8d1f94b',
        sha256_artwork:  'b7d2f1a0e83c65d14b3f2a1e83c65d14b3f2a1e83c65d14b3f2a1e83c65d147',
        sha256_metadata: 'c9e4d3b2f17a08e25c4d3b2f17a08e25c4d3b2f17a08e25c4d3b2f17a08e259',
        qr_destination: 'https://cyberapparel.co/verify?id=CA-AI-CHUNK-0001',
        status: 'AUTHENTIC',
        edition: 'Limited — 001 of 500',
        price: '$42.00'
      }
    ]
  };

  async function loadArtifacts() {
    try {
      const r = await fetch('../data/artifacts.json');
      return (await r.json()).artifacts;
    } catch {
      return FALLBACK.artifacts;
    }
  }

  function renderResult(artifact) {
    const wrap = document.getElementById('verify-result');
    const card = document.getElementById('result-card');
    wrap.classList.add('visible');

    if (!artifact) {
      card.className = 'result-card not-found';
      card.innerHTML = `
        <div class="result-status">
          <span class="status-pip err"></span>
          <span class="result-status-text" style="color:var(--rose);">Artifact Not Found</span>
        </div>
        <p style="font-size:0.78rem;color:var(--dim);line-height:1.8;">
          No record matching that ID exists in the Cyber Apparel Co. registry.<br/>
          Check the ID printed on your garment's interior label.
        </p>`;
      return;
    }

    const marks = artifact.claimed_marks.map(m => `<span class="result-badge">${m}</span>`).join(' ');

    card.className = 'result-card authentic';
    card.innerHTML = `
      <div class="result-status">
        <span class="status-pip ok"></span>
        <span class="result-status-text" style="color:var(--mint);">Authentic — ${artifact.status}</span>
        <span style="margin-left:auto;font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--dim);">${artifact.edition}</span>
      </div>

      <div class="result-row">
        <span class="result-key">Artifact ID</span>
        <span class="result-val mono">${artifact.id}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Drop</span>
        <span class="result-val">${artifact.drop}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Title</span>
        <span class="result-val">${artifact.title}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Release Date</span>
        <span class="result-val mono">${artifact.release_date}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Creator Mark</span>
        <span class="result-val mono" style="font-size:0.62rem;">${artifact.creator_mark}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Copyright</span>
        <span class="result-val" style="font-size:0.72rem;">${artifact.copyright}</span>
      </div>
      <div class="result-row">
        <span class="result-key">Claimed Marks</span>
        <span class="result-val">${marks}</span>
      </div>
      <div class="result-row">
        <span class="result-key">SHA-256 Garment</span>
        <div class="result-hash">${artifact.sha256_garment}</div>
      </div>
      <div class="result-row">
        <span class="result-key">SHA-256 Artwork</span>
        <div class="result-hash">${artifact.sha256_artwork}</div>
      </div>
      <div class="result-row">
        <span class="result-key">SHA-256 Metadata</span>
        <div class="result-hash">${artifact.sha256_metadata}</div>
      </div>
      <div class="result-row">
        <span class="result-key">QR Destination</span>
        <span class="result-val" style="font-size:0.68rem;">
          <a href="${artifact.qr_destination}" style="color:var(--mint);">${artifact.qr_destination}</a>
        </span>
      </div>`;

    wrap.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('artifact-id-input').value.trim().toUpperCase();
    const btn   = document.getElementById('verify-submit-btn');
    btn.textContent = 'SCANNING...';
    btn.disabled = true;
    try {
      const list = await loadArtifacts();
      renderResult(list.find(a => a.id === input) || null);
    } finally {
      btn.textContent = 'VERIFY';
      btn.disabled = false;
    }
  });

  // Auto-verify from ?id=
  const param = new URLSearchParams(window.location.search).get('id');
  if (param) {
    const inp = document.getElementById('artifact-id-input');
    if (inp) {
      inp.value = param;
      form.dispatchEvent(new Event('submit'));
    }
  }
})();
