/**
 * ShadyMart Mock Store Interactions
 * Simulates ticking timers, fake social proof fluctuations, Prime upsell, and modals.
 */

document.addEventListener('DOMContentLoaded', () => {
  const timerEl = document.getElementById('demo-timer');
  const btnTriggerModal = document.getElementById('btn-trigger-modal');
  const btnTogglePatterns = document.getElementById('btn-toggle-patterns');
  const modal = document.getElementById('confirmshaming-modal');
  const btnDeclineShame = document.getElementById('btn-decline-shame');
  const btnFaintClose = document.getElementById('btn-faint-close');
  const btnClaim = document.getElementById('btn-claim-discount');

  let secondsRemaining = 14 * 60 + 59;
  let patternsActive = true;

  // 1. Ticking Countdown Timer
  setInterval(() => {
    if (secondsRemaining > 0) {
      secondsRemaining--;
    } else {
      secondsRemaining = 15 * 60; // Auto-resets
    }

    const mins = Math.floor(secondsRemaining / 60);
    const secs = secondsRemaining % 60;
    const formatted = `00:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    if (timerEl) {
      timerEl.textContent = formatted;
    }
  }, 1000);

  // 2. Fluctuating Social Proof Viewers
  const socialProofEl = document.querySelector('#dp-social-proof strong');
  setInterval(() => {
    if (socialProofEl && patternsActive) {
      const randomCount = Math.floor(Math.random() * 15) + 35;
      socialProofEl.textContent = `${randomCount} people`;
    }
  }, 6000);

  // 3. Modal Controls
  btnTriggerModal.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  const closeModal = (e) => {
    if (e) e.preventDefault();
    modal.style.display = 'none';
  };

  btnDeclineShame.addEventListener('click', closeModal);
  btnFaintClose.addEventListener('click', closeModal);
  btnClaim.addEventListener('click', () => {
    alert('Coupon applied! (Simulated)');
    closeModal();
  });

  // 4. Toggle All Dark Patterns (Demonstrate Grade F -> Grade A)
  btnTogglePatterns.addEventListener('click', () => {
    patternsActive = !patternsActive;

    const urgencyBanner = document.getElementById('dp-urgency-banner');
    const mrpSavings = document.getElementById('dp-mrp-savings');
    const primeUpsell = document.getElementById('dp-prime-upsell');
    const thresholdTrap = document.getElementById('dp-threshold-trap');
    const missedSection = document.getElementById('dp-nagging-section');
    const socialProof = document.getElementById('dp-social-proof');
    const scarcity = document.getElementById('dp-scarcity');
    const addons = document.getElementById('dp-addons');
    const warrantyCheck = document.getElementById('warranty-check');
    const vipCheck = document.getElementById('vip-check');
    const ltdBadge = document.getElementById('dp-ltd-badge');
    const endsinBadge = document.getElementById('dp-endsin-badge');

    if (!patternsActive) {
      // Turn patterns OFF -> Clean ethical store (Grade A)
      urgencyBanner.style.display = 'none';
      mrpSavings.style.display = 'none';
      primeUpsell.style.display = 'none';
      thresholdTrap.style.display = 'none';
      missedSection.style.display = 'none';
      socialProof.style.display = 'none';
      scarcity.style.display = 'none';
      warrantyCheck.checked = false;
      vipCheck.checked = false;
      addons.style.display = 'none';
      modal.style.display = 'none';
      if (ltdBadge) ltdBadge.style.display = 'none';
      if (endsinBadge) endsinBadge.style.display = 'none';

      btnTogglePatterns.textContent = '😈 Restore Dark Patterns (-> Grade F)';
      btnTogglePatterns.className = 'demo-btn';
    } else {
      // Turn patterns ON -> Predatory store (Grade F)
      urgencyBanner.style.display = 'flex';
      mrpSavings.style.display = 'block';
      primeUpsell.style.display = 'block';
      thresholdTrap.style.display = 'flex';
      missedSection.style.display = 'block';
      socialProof.style.display = 'flex';
      scarcity.style.display = 'flex';
      warrantyCheck.checked = true;
      vipCheck.checked = true;
      addons.style.display = 'flex';
      if (ltdBadge) ltdBadge.style.display = 'inline-block';
      if (endsinBadge) endsinBadge.style.display = 'inline-block';

      btnTogglePatterns.textContent = '🧹 Clean Site (Turn Patterns Off -> Grade A)';
      btnTogglePatterns.className = 'demo-btn demo-btn-danger';
    }
  });
});
