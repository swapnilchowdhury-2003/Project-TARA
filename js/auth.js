(function () {
  const CONSENT_KEY = 'taraConsent';
  const NAME_KEY = 'taraStudentName';

  function getStudentName() {
    return localStorage.getItem(NAME_KEY) || 'Learner';
  }

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  }

  function saveConsent(name) {
    const studentName = (name || 'Learner').trim() || 'Learner';
    localStorage.setItem(CONSENT_KEY, 'true');
    localStorage.setItem(NAME_KEY, studentName);
    return studentName;
  }

  function initConsentPage() {
    const form = document.getElementById('consentForm');
    if (!form) {
      return;
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const nameField = document.getElementById('studentName');
      saveConsent(nameField ? nameField.value : 'Learner');
      window.location.href = 'map.html';
    });
  }

  function initDashboardPage() {
    const welcome = document.querySelector('[data-dashboard-welcome]');
    if (welcome) {
      welcome.textContent = hasConsent() ? 'Welcome back, ' + getStudentName() : 'Welcome to TARA';
    }

    const note = document.querySelector('[data-dashboard-note]');
    if (note) {
      note.textContent = hasConsent()
        ? 'Your progress is saved locally on this device.'
        : 'Register once to save your progress locally on this device.';
    }
  }

  document.addEventListener('DOMContentLoaded', initConsentPage);
  document.addEventListener('DOMContentLoaded', initDashboardPage);

  window.TARA_AUTH = {
    hasConsent: hasConsent,
    saveConsent: saveConsent,
    getStudentName: getStudentName
  };
})();
