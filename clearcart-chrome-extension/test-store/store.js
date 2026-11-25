(function () {
  "use strict";

  var secondsLeft = 299;
  var timerClock = document.getElementById("timerClock");
  var resetBtn = document.getElementById("resetTrapsBtn");
  var thresholdCard = document.getElementById("thresholdCard");
  var thresholdDismissed = document.getElementById("thresholdDismissed");
  var skipThresholdBtn = document.getElementById("skipThresholdBtn");
  var vipCard = document.getElementById("vipCard");
  var vipDismissed = document.getElementById("vipDismissed");
  var claimVipBtn = document.getElementById("claimVipBtn");
  var declineVipBtn = document.getElementById("declineVipBtn");
  var warrantyCheckbox = document.getElementById("warrantyCheckbox");
  var autoRenewCheckbox = document.getElementById("autoRenewCheckbox");
  var warrantyFeeLabel = document.getElementById("warrantyFeeLabel");
  var totalDueLabel = document.getElementById("totalDueLabel");
  var payOrderBtn = document.getElementById("payOrderBtn");

  setInterval(function () {
    secondsLeft = secondsLeft > 1 ? secondsLeft - 1 : 299;
    var mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
    var secs = String(secondsLeft % 60).padStart(2, "0");
    if (timerClock) {
      timerClock.textContent = "00:" + mins + ":" + secs;
    }
  }, 1000);

  function syncTotals() {
    var warrantyOn = warrantyCheckbox && warrantyCheckbox.checked;
    var autoRenewOn = autoRenewCheckbox && autoRenewCheckbox.checked;
    var thresholdHidden = thresholdCard && thresholdCard.hidden;
    var vipHidden = vipCard && vipCard.hidden;

    if (warrantyFeeLabel) warrantyFeeLabel.textContent = warrantyOn ? "₹499" : "₹0 (Removed)";
    if (totalDueLabel) totalDueLabel.textContent = warrantyOn ? "₹4,998" : "₹4,499";
    if (resetBtn) {
      resetBtn.classList.toggle("is-visible", !warrantyOn || !autoRenewOn || thresholdHidden || vipHidden);
    }
  }

  if (skipThresholdBtn) {
    skipThresholdBtn.addEventListener("click", function () {
      thresholdCard.hidden = true;
      thresholdDismissed.hidden = false;
      syncTotals();
    });
  }

  function dismissVip() {
    vipCard.hidden = true;
    vipDismissed.hidden = false;
    syncTotals();
  }
  if (claimVipBtn) claimVipBtn.addEventListener("click", dismissVip);
  if (declineVipBtn) declineVipBtn.addEventListener("click", dismissVip);
  if (warrantyCheckbox) warrantyCheckbox.addEventListener("change", syncTotals);
  if (autoRenewCheckbox) autoRenewCheckbox.addEventListener("change", syncTotals);

  if (payOrderBtn) {
    payOrderBtn.addEventListener("click", function () {
      payOrderBtn.textContent = "Demo Checkout Recorded";
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      thresholdCard.hidden = false;
      thresholdDismissed.hidden = true;
      vipCard.hidden = false;
      vipDismissed.hidden = true;
      if (warrantyCheckbox) warrantyCheckbox.checked = true;
      if (autoRenewCheckbox) autoRenewCheckbox.checked = true;
      if (payOrderBtn) payOrderBtn.textContent = "Pay & Complete Order";
      syncTotals();
    });
  }

  syncTotals();
})();