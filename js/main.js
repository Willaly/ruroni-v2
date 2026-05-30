/* Ruroni CrossFit — Interactions */

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
if (menuToggle && nav) {
  const close = () => {
    nav.classList.remove('open');
    menuToggle.classList.remove('open');
    document.body.classList.remove('nav-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  };
  const toggle = () => {
    const willOpen = !nav.classList.contains('open');
    nav.classList.toggle('open', willOpen);
    menuToggle.classList.toggle('open', willOpen);
    document.body.classList.toggle('nav-open', willOpen);
    menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  };
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.addEventListener('click', toggle);
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  // Close on Escape
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}

// Header background on scroll
const header = document.querySelector('.header');
const onScroll = () => {
  if (window.scrollY > 50) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal-on-scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && reveals.length) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(el => io.observe(el));
}

// Form submit (placeholder — connecte à ton backend / Mailjet / Formspree)
const form = document.querySelector('form[data-form]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Envoi...';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Message envoyé ✓';
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.disabled = false;
      }, 2500);
    }, 800);
  });
}

/* =========================================================
   MODAL — Séance d'essai
   Injecté en JS pour être disponible sur toutes les pages
   ========================================================= */
const TRIAL_MODAL_HTML = `
<div class="modal-overlay" id="trial-modal" role="dialog" aria-modal="true" aria-labelledby="trial-title" aria-hidden="true">
  <div class="modal" role="document">
    <button class="modal__close" aria-label="Fermer">×</button>

    <div class="modal__header">
      <span class="eyebrow">Première séance offerte</span>
      <h2 id="trial-title">Réserve ta séance d'essai</h2>
      <p>Remplis le formulaire, on revient vers toi sous 24h pour confirmer ton créneau.</p>
    </div>

    <div class="modal__body">
      <form id="trial-form" data-trial-form>

        <div class="modal__row--double">
          <div>
            <label for="trial-firstname">Prénom <span class="req">*</span></label>
            <input type="text" id="trial-firstname" name="firstname" required autocomplete="given-name" />
          </div>
          <div>
            <label for="trial-lastname">Nom <span class="req">*</span></label>
            <input type="text" id="trial-lastname" name="lastname" required autocomplete="family-name" />
          </div>
        </div>

        <div class="modal__row--double">
          <div>
            <label for="trial-email">Email <span class="req">*</span></label>
            <input type="email" id="trial-email" name="email" required autocomplete="email" />
          </div>
          <div>
            <label for="trial-phone">Téléphone <span class="req">*</span></label>
            <input type="tel" id="trial-phone" name="phone" required autocomplete="tel" />
          </div>
        </div>

        <div class="modal__row--double">
          <div>
            <label for="trial-age">Âge <span class="req">*</span></label>
            <input type="number" id="trial-age" name="age" required min="14" max="99" />
          </div>
          <div>
            <label for="trial-day">Jour souhaité <span class="req">*</span></label>
            <select id="trial-day" name="day" required>
              <option value="">Choisir un jour…</option>
              <option>Lundi</option>
              <option>Mardi</option>
              <option>Mercredi</option>
              <option>Jeudi</option>
              <option>Vendredi</option>
              <option>Samedi</option>
              <option>Dimanche</option>
              <option>Indifférent</option>
            </select>
          </div>
        </div>

        <div class="modal__row">
          <label>Niveau <span class="req">*</span></label>
          <div class="level-grid">
            <label>
              <input type="radio" name="level" value="Débutant" required />
              <span class="icon">🥉</span>
              Débutant
            </label>
            <label>
              <input type="radio" name="level" value="Intermédiaire" />
              <span class="icon">🥈</span>
              Intermédiaire
            </label>
            <label>
              <input type="radio" name="level" value="Avancé" />
              <span class="icon">🥇</span>
              Avancé
            </label>
            <label>
              <input type="radio" name="level" value="Élite" />
              <span class="icon">🏆</span>
              Élite
            </label>
            <label>
              <input type="radio" name="level" value="God" />
              <span class="icon">⚡</span>
              God
            </label>
          </div>
        </div>

        <div class="modal__row">
          <label for="trial-slot">Créneau souhaité <span class="req">*</span></label>
          <select id="trial-slot" name="slot" required>
            <option value="">Choisir un créneau…</option>
            <optgroup label="Matin">
              <option>7h00</option>
              <option>10h00 (week-end)</option>
              <option>11h00 (week-end)</option>
              <option>12h00</option>
            </optgroup>
            <optgroup label="Soir (semaine)">
              <option>17h30</option>
              <option>18h30</option>
              <option>19h30</option>
              <option>20h30</option>
            </optgroup>
            <option>Indifférent / le coach me propose</option>
          </select>
        </div>

        <div class="modal__row">
          <label for="trial-message">Message (optionnel)</label>
          <textarea id="trial-message" name="message" placeholder="Une question ? Une contrainte physique à signaler ? Un objectif particulier ?"></textarea>
        </div>

        <button type="submit" class="btn modal__submit">Réserver ma séance d'essai</button>
        <p class="modal__note">
          ⓘ Tes infos sont envoyées à l'équipe Ruroni. On te confirme ton créneau par téléphone ou email sous 24h.
        </p>
      </form>
    </div>

    <div class="modal__success">
      <div class="check">✓</div>
      <h2>Demande envoyée !</h2>
      <p>Merci, on a bien reçu ta demande de séance d'essai.</p>
      <p style="color:var(--text-mute);">L'équipe te recontacte sous 24h pour confirmer ton créneau.</p>
      <button type="button" class="btn btn--outline modal__close-btn" style="margin-top:1.5rem;">Fermer</button>
    </div>
  </div>
</div>
`;

// Inject modal at end of body
document.body.insertAdjacentHTML('beforeend', TRIAL_MODAL_HTML);

const modal = document.getElementById('trial-modal');
const modalEl = modal.querySelector('.modal');
const trialForm = document.getElementById('trial-form');
let lastFocused = null;

function openTrial(e) {
  if (e) e.preventDefault();
  lastFocused = document.activeElement;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => modal.querySelector('input, select')?.focus(), 200);
}
function closeTrial() {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
  modalEl.classList.remove('modal--sent');
  if (trialForm) trialForm.reset();
  if (lastFocused) lastFocused.focus();
}

// Wire triggers
document.querySelectorAll('[data-trigger="trial-modal"]').forEach(el => {
  el.addEventListener('click', openTrial);
});
modal.querySelector('.modal__close').addEventListener('click', closeTrial);
modal.querySelector('.modal__close-btn').addEventListener('click', closeTrial);
modal.addEventListener('click', (e) => { if (e.target === modal) closeTrial(); });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('show')) closeTrial();
});

// Form submit → POST vers Fillout (via webhook proxy ou API directe)
trialForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = trialForm.querySelector('button[type="submit"]');
  const originalText = btn.textContent;
  btn.textContent = 'Envoi en cours…';
  btn.disabled = true;

  const data = Object.fromEntries(new FormData(trialForm).entries());
  // Métadonnées utiles côté Fillout
  data.source = 'site-ruroni-v2';
  data.submittedAt = new Date().toISOString();
  data.page = window.location.pathname;

  const cfg = window.RURONI_CONFIG || {};
  const endpoint = cfg.trialEndpoint;
  const isConfigured = endpoint && !endpoint.includes('REPLACE-ME') && !endpoint.includes('example.com');

  try {
    if (isConfigured) {
      const res = await fetch(endpoint, {
        method: cfg.trialMethod || 'POST',
        headers: cfg.trialHeaders || { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      console.log("[Ruroni] Submission envoyée à Fillout :", data);
    } else if (cfg.trialAllowSimulation !== false) {
      // Mode dev : pas d'endpoint, on simule
      console.log("[Ruroni · SIMULATION — endpoint non configuré] Données :", data);
      await new Promise(r => setTimeout(r, 700));
    } else {
      throw new Error('Endpoint Fillout non configuré (voir js/config.js)');
    }
    modalEl.classList.add('modal--sent');
  } catch (err) {
    console.error('[Ruroni] Erreur envoi :', err);
    btn.textContent = 'Erreur — réessayer';
    btn.disabled = false;
    // Affichage discret de l'erreur
    let errEl = trialForm.querySelector('.modal__error');
    if (!errEl) {
      errEl = document.createElement('p');
      errEl.className = 'modal__error';
      errEl.style.cssText = 'color:#ff6b5a;font-size:0.85rem;text-align:center;margin-top:0.75rem;';
      btn.parentNode.insertBefore(errEl, btn.nextSibling);
    }
    errEl.textContent = `Impossible d'envoyer ta demande. Réessaie ou appelle-nous au 06 07 52 41 17.`;
    setTimeout(() => { btn.textContent = originalText; }, 100);
  }
});

