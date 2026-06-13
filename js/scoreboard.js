(function () {
  function initScoreboardPage() {
    const tbody = document.getElementById('scoreboardBody');
    if (!tbody || !window.TARA_PROGRESS) {
      return;
    }

    const levels = ['1', '2', '3', '4', '5', '6', 'extra'];
    const scores = window.TARA_PROGRESS.getQuizScores();

    tbody.innerHTML = levels.map(function (level) {
      const meta = window.TARA_PROGRESS.getLevelMeta(level);
      const score = scores[level];
      const levelName = meta ? meta.title : (level === 'extra' ? 'Level Extra' : 'Level ' + level);
      const scoreText = score ? score.score + ' / ' + score.total : 'Not attempted';
      const statusClass = score ? 'badge text-bg-success' : 'badge text-bg-secondary';
      const dateText = score && score.updatedAt ? new Date(score.updatedAt).toLocaleDateString() : '-';

      return '<tr>' +
        '<td><strong>' + levelName + '</strong></td>' +
        '<td>' + scoreText + '</td>' +
        '<td><span class="' + statusClass + '">' + (score ? 'Completed' : 'Pending') + '</span></td>' +
        '<td>' + dateText + '</td>' +
      '</tr>';
    }).join('');
  }

  document.addEventListener('DOMContentLoaded', initScoreboardPage);
})();
