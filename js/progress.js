(function () {
  const PROGRESS_KEY = 'taraProgress';
  const SCORES_KEY = 'taraQuizScores';
  const THEME_KEY = 'taraTheme';
  const LEVEL_ORDER = ['1', '2', '3', '4', '5', '6', 'extra'];
  const LEVELS = {
    '1': { levelPage: 'level-1.html', quizPage: 'quiz/quiz.html?level=1', totalTopics: 2, title: 'Level 1' },
    '2': { levelPage: 'level-2.html', quizPage: 'quiz/quiz.html?level=2', totalTopics: 4, title: 'Level 2' },
    '3': { levelPage: 'level-3.html', quizPage: 'quiz/quiz.html?level=3', totalTopics: 5, title: 'Level 3' },
    '4': { levelPage: 'level-4.html', quizPage: 'quiz/quiz.html?level=4', totalTopics: 5, title: 'Level 4' },
    '5': { levelPage: 'level-5.html', quizPage: 'quiz/quiz.html?level=5', totalTopics: 10, title: 'Level 5' },
    '6': { levelPage: 'level-6.html', quizPage: 'quiz/quiz.html?level=6', totalTopics: 4, title: 'Level 6' },
    extra: { levelPage: 'level-extra.html', quizPage: 'quiz/quiz.html?level=extra', totalTopics: 9, title: 'Level Extra' }
  };
  const TOPIC_SEQUENCE = {
    '1': ['topic-1-1.html', 'topic-1-2.html'],
    '2': ['topic-2-1.html', 'topic-2-2.html', 'topic-2-3.html', 'topic-2-4.html'],
    '3': ['topic-3-1.html', 'topic-3-2.html', 'topic-3-3.html', 'topic-3-4.html', 'topic-3-5.html'],
    '4': ['topic-4-1.html', 'topic-4-2.html', 'topic-4-3.html', 'topic-4-4.html', 'topic-4-5.html'],
    '5': ['topic-5-1.html', 'topic-5-2.html', 'topic-5-3.html', 'topic-5-4.html', 'topic-5-5.html', 'topic-5-6.html', 'topic-5-7.html', 'topic-5-8.html', 'topic-5-9.html', 'topic-5-10.html'],
    '6': ['topic-6-1.html', 'topic-6-2.html', 'topic-6-3.html', 'topic-6-4.html'],
    extra: ['topic-extra-1.html', 'topic-extra-2.html', 'topic-extra-3.html', 'topic-extra-4.html', 'topic-extra-5.html', 'topic-extra-6.html', 'topic-extra-7.html', 'topic-extra-8.html', 'topic-extra-9.html']
  };

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getProgressState() {
    const state = readJson(PROGRESS_KEY, { completed: {} });
    if (!state.completed) {
      state.completed = {};
    }
    return state;
  }

  function getQuizScores() {
    return readJson(SCORES_KEY, {});
  }

  function saveQuizScore(level, score, total) {
    const scores = getQuizScores();
    scores[level] = {
      score: score,
      total: total,
      updatedAt: new Date().toISOString()
    };
    writeJson(SCORES_KEY, scores);
  }

  function getLevelMeta(level) {
    return LEVELS[level] || null;
  }

  function getCompletedCount(level) {
    const state = getProgressState();
    const total = getLevelMeta(level) ? getLevelMeta(level).totalTopics : 0;
    return Math.max(0, Math.min(Number(state.completed[level] || 0), total));
  }

  function markTopicCompleted(level, topicIndex) {
    const state = getProgressState();
    const current = Number(state.completed[level] || 0);
    state.completed[level] = Math.max(current, Number(topicIndex) || 0);
    writeJson(PROGRESS_KEY, state);
    return state.completed[level];
  }

  function updateDashboardSummary() {
    const completedTopics = LEVEL_ORDER.reduce(function (sum, level) {
      return sum + getCompletedCount(level);
    }, 0);
    const quizAttempts = Object.keys(getQuizScores()).length;

    const completedElement = document.querySelector('[data-dashboard-completed]');
    if (completedElement) {
      completedElement.textContent = completedTopics;
    }

    const quizElement = document.querySelector('[data-dashboard-quizzes]');
    if (quizElement) {
      quizElement.textContent = quizAttempts;
    }
  }

  function getSitePrefix() {
    const path = window.location.pathname.replace(/\\/g, '/');
    if (/\/topics\//.test(path)) {
      return '../../';
    }
    if (/\/quiz\//.test(path)) {
      return '../';
    }
    return '';
  }

  function injectSiteChrome() {
    if (document.querySelector('[data-tara-site-header]')) {
      return;
    }

    const prefix = getSitePrefix();
    const headerHtml = `
      <header class="tara-site-header navbar navbar-expand-lg navbar-dark">
        <div class="container tara-shell py-2">
          <a class="navbar-brand tara-brand d-flex align-items-center gap-2" href="${prefix}index.html">
            <span class="tara-stars"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></span>
            <span>TARA</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#taraNav" aria-controls="taraNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="taraNav">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center gap-lg-2">
              <li class="nav-item"><a class="nav-link" href="${prefix}index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefix}map.html">Map</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefix}dashboard.html">Dashboard</a></li>
              <li class="nav-item"><a class="nav-link" href="${prefix}scoreboard.html">Scoreboard</a></li>
            </ul>
          </div>
        </div>
      </header>`;

    const footerHtml = `
      <footer class="tara-site-footer mt-auto">
        <div class="container tara-shell py-4">
          <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <div class="tara-footer-stars mb-2"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
              <div class="fw-semibold text-white">TARA Learning Journey</div>
              <div class="tara-footer-text">Learn programming through Bangladeshi math patterns.</div>
            </div>
            <div class="tara-footer-credit">Made by Swapnil Chowdhury</div>
          </div>
        </div>
      </footer>`;

    document.body.insertAdjacentHTML('afterbegin', headerHtml);
    document.body.insertAdjacentHTML('beforeend', footerHtml);
  }

  function getSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'auto';
  }

  function getResolvedTheme() {
    const storedTheme = getStoredTheme();
    return storedTheme === 'dark' || storedTheme === 'light' ? storedTheme : getSystemTheme();
  }

  function applyTheme(theme) {
    document.body.classList.toggle('theme-dark', theme === 'dark');
    document.body.classList.toggle('theme-light', theme === 'light');
    document.documentElement.setAttribute('data-tara-theme', theme);

    const toggleButton = document.querySelector('[data-theme-toggle]');
    if (toggleButton) {
      toggleButton.innerHTML = theme === 'dark'
        ? '<i class="fa-solid fa-sun me-2"></i>Light mode'
        : '<i class="fa-solid fa-moon me-2"></i>Dark mode';
      toggleButton.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  function initThemeToggle() {
    const themeButton = document.createElement('button');
    themeButton.type = 'button';
    themeButton.className = 'tara-theme-toggle btn btn-dark shadow';
    themeButton.setAttribute('data-theme-toggle', 'true');

    themeButton.addEventListener('click', function () {
      const nextTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
      localStorage.setItem(THEME_KEY, nextTheme);
      applyTheme(nextTheme);
    });

    document.body.appendChild(themeButton);
    applyTheme(getResolvedTheme());
  }

  function initLevelPage() {
    const shell = document.querySelector('[data-level-page]');
    if (!shell) {
      return;
    }

    const level = shell.dataset.level;
    const total = Number(shell.dataset.total || 0);
    const completed = getCompletedCount(level);
    const progressFill = shell.querySelector('[data-progress-fill]');
    const progressLabel = shell.querySelector('[data-progress-label]');
    const quizWrap = shell.querySelector('[data-level-quiz-wrap]');
    const quizLink = shell.querySelector('[data-level-quiz]');

    if (progressFill) {
      progressFill.style.width = total ? (completed / total) * 100 + '%' : '0%';
    }

    if (progressLabel) {
      progressLabel.textContent = completed + ' / ' + total + ' completed';
    }

    shell.querySelectorAll('[data-topic-card]').forEach(function (card) {
      const index = Number(card.dataset.topicIndex || 0);
      const link = card.querySelector('[data-topic-link]');
      const status = card.querySelector('[data-topic-status]');
      const topicUrl = card.dataset.topicUrl || '';

      card.classList.remove('is-locked', 'is-unlocked', 'is-complete');

      if (index <= completed) {
        card.classList.add('is-complete');
        if (status) {
          status.textContent = 'Completed';
        }
        if (link) {
          link.className = 'btn btn-primary w-100';
          link.href = topicUrl;
          link.textContent = 'Review Topic';
          link.removeAttribute('aria-disabled');
        }
      } else if (index === completed + 1) {
        card.classList.add('is-unlocked');
        if (status) {
          status.textContent = 'Unlocked';
        }
        if (link) {
          link.className = 'btn btn-dark w-100';
          link.href = topicUrl;
          link.textContent = 'Open Topic';
          link.removeAttribute('aria-disabled');
        }
      } else {
        card.classList.add('is-locked');
        if (status) {
          status.textContent = 'Locked';
        }
        if (link) {
          link.className = 'btn btn-outline-secondary w-100';
          link.href = '#';
          link.textContent = 'Locked';
          link.setAttribute('aria-disabled', 'true');
        }
      }
    });

    if (quizWrap && quizLink) {
      const quizUrl = shell.dataset.quizUrl || quizLink.getAttribute('href') || '#';
      quizLink.href = quizUrl;
      quizWrap.classList.toggle('d-none', completed < total);
    }
  }

  function initTopicPage() {
    const shell = document.querySelector('[data-topic-page]');
    if (!shell) {
      return;
    }

    const level = shell.dataset.level;
    const topicIndex = Number(shell.dataset.topicIndex || 0);
    const levelUrl = shell.dataset.levelUrl || 'dashboard.html';
    const quizUrl = shell.dataset.quizUrl || '';
    const backButton = shell.querySelector('[data-back-to-level]');
    const nextButton = shell.querySelector('[data-next-topic]');
    const quizButton = shell.querySelector('[data-level-quiz]');
    const topicFiles = TOPIC_SEQUENCE[level] || [];
    const nextFile = topicFiles[topicIndex] || '';

    markTopicCompleted(level, topicIndex);

    if (backButton) {
      backButton.href = levelUrl;
    }

    if (nextButton && quizButton) {
      if (nextFile) {
        nextButton.hidden = false;
        nextButton.href = nextFile;
        quizButton.hidden = true;
        quizButton.classList.add('d-none');
      } else {
        nextButton.hidden = true;
        quizButton.hidden = false;
        quizButton.href = quizUrl;
        quizButton.classList.remove('d-none');
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    injectSiteChrome();
    updateDashboardSummary();
    initLevelPage();
    initTopicPage();
    initThemeToggle();
  });

  window.TARA_PROGRESS = {
    getLevelMeta: getLevelMeta,
    getCompletedCount: getCompletedCount,
    markTopicCompleted: markTopicCompleted,
    saveQuizScore: saveQuizScore,
    getQuizScores: getQuizScores
  };
})();
