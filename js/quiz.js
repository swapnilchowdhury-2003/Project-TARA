(function () {
  const QUESTIONS = [
    {
      prompt: 'Which choice best describes a variable?',
      options: ['A named box for storing a value', 'A type of loop', 'A broken program', 'A shortcut key'],
      answer: 0
    },
    {
      prompt: 'Which symbol usually means addition?',
      options: ['+', '-', '*', '/'],
      answer: 0
    },
    {
      prompt: 'What does input mean?',
      options: ['Data received from the user', 'Data sent to the printer', 'A hidden error', 'A drawing tool'],
      answer: 0
    },
    {
      prompt: 'Which one is closest to an expression?',
      options: ['2 + 3', 'A full paragraph', 'A file folder', 'A mouse click'],
      answer: 0
    },
    {
      prompt: 'What does a counter usually do?',
      options: ['Counts how many times something happens', 'Deletes the screen', 'Changes the font', 'Makes a sound'],
      answer: 0
    },
    {
      prompt: 'An if/else statement helps a program to:',
      options: ['Choose between two paths', 'Draw a circle', 'Make the text smaller', 'Open a new tab'],
      answer: 0
    },
    {
      prompt: 'A loop is used when we want to:',
      options: ['Repeat steps', 'Hide numbers', 'Stop the computer', 'Change the language'],
      answer: 0
    },
    {
      prompt: 'What is a pattern?',
      options: ['A rule that repeats in order', 'A broken pencil', 'A random mistake', 'A single number only'],
      answer: 0
    },
    {
      prompt: 'Which value is a prime number?',
      options: ['7', '8', '9', '10'],
      answer: 0
    },
    {
      prompt: 'What does break do inside a loop?',
      options: ['Stops the loop early', 'Starts a new file', 'Creates a picture', 'Adds more items'],
      answer: 0
    },
    {
      prompt: 'Which list can store many values together?',
      options: ['Array', 'Timer', 'Printer', 'Cursor'],
      answer: 0
    },
    {
      prompt: 'Factorial is the product of:',
      options: ['All whole numbers down to 1', 'Only even numbers', 'Only prime numbers', 'Only decimal numbers'],
      answer: 0
    },
    {
      prompt: 'Fibonacci numbers are built by:',
      options: ['Adding the previous two numbers', 'Multiplying by 10', 'Subtracting 5 each time', 'Writing random digits'],
      answer: 0
    },
    {
      prompt: 'What does reverse mean for a string?',
      options: ['Reading it backward', 'Deleting it', 'Changing its color', 'Making it louder'],
      answer: 0
    },
    {
      prompt: 'A palindrome is a word or number that:',
      options: ['Reads the same forward and backward', 'Has no vowels', 'Is always even', 'Must be long'],
      answer: 0
    },
    {
      prompt: 'A matrix is best described as:',
      options: ['Rows and columns of values', 'A single button', 'A random sentence', 'A type of paint'],
      answer: 0
    },
    {
      prompt: 'What is a function?',
      options: ['A reusable block of code', 'A broken loop', 'A file name only', 'A color picker'],
      answer: 0
    },
    {
      prompt: 'A parameter is:',
      options: ['A value sent into a function', 'A screen border', 'A keyboard shortcut', 'A hidden file'],
      answer: 0
    },
    {
      prompt: 'What does encapsulation focus on?',
      options: ['Keeping data and methods together', 'Printing only numbers', 'Removing all classes', 'Turning off the internet'],
      answer: 0
    },
    {
      prompt: 'What does inheritance allow?',
      options: ['One class to reuse another class’s features', 'A program to stop forever', 'A variable to change color', 'A string to become a number'],
      answer: 0
    }
  ];

  function buildQuizQuestions(container, levelLabel) {
    if (!container) {
      return;
    }

    container.innerHTML = QUESTIONS.map(function (question, index) {
      const fieldName = 'question-' + index;
      const options = question.options.map(function (option, optionIndex) {
        const optionId = fieldName + '-' + optionIndex;
        return '<div class="form-check mb-2">' +
          '<input class="form-check-input" type="radio" name="' + fieldName + '" id="' + optionId + '" value="' + optionIndex + '">' +
          '<label class="form-check-label" for="' + optionId + '">' + option + '</label>' +
        '</div>';
      }).join('');

      return '<section class="tara-quiz-card">' +
        '<p class="tara-badge mb-3">' + levelLabel + ' · Question ' + (index + 1) + '</p>' +
        '<h3 class="tara-question-title h5 mb-3">' + question.prompt + '</h3>' +
        options +
      '</section>';
    }).join('');
  }

  function initQuizPage() {
    const shell = document.querySelector('[data-quiz-page]');
    if (!shell) {
      return;
    }

    const level = new URLSearchParams(window.location.search).get('level') || shell.dataset.level || '1';
      const timerElement = document.querySelector('[data-quiz-timer]') || document.getElementById('quizTimer');
      const form = document.querySelector('[data-quiz-form]') || document.getElementById('quizForm');
      const questionsContainer = document.querySelector('[data-question-list]') || document.getElementById('quizQuestions');
      const resultElement = document.querySelector('[data-quiz-result]') || document.getElementById('quizResult');
    const submitButton = form ? form.querySelector('button[type="submit"]') : null;
    const levelLabel = level === 'extra' ? 'Level Extra' : 'Level ' + level;
    const duration = Number(shell.dataset.duration || 1200);
    const questions = QUESTIONS;
    let remaining = duration;
    let submitted = false;

    buildQuizQuestions(questionsContainer, levelLabel);

    function renderTimer() {
      if (!timerElement) {
        return;
      }
      const minutes = String(Math.floor(remaining / 60)).padStart(2, '0');
      const seconds = String(remaining % 60).padStart(2, '0');
      timerElement.textContent = minutes + ':' + seconds;
    }

    function finishQuiz(autoSubmitted) {
      if (submitted) {
        return;
      }
      submitted = true;

      if (submitButton) {
        submitButton.disabled = true;
      }

      const score = questions.reduce(function (total, question, index) {
        const selected = form ? form.querySelector('input[name="question-' + index + '"]:checked') : null;
        return total + (selected && Number(selected.value) === question.answer ? 1 : 0);
      }, 0);

      if (window.TARA_PROGRESS && window.TARA_PROGRESS.saveQuizScore) {
        window.TARA_PROGRESS.saveQuizScore(level, score, questions.length);
      }

      if (resultElement) {
        resultElement.textContent = (autoSubmitted ? 'Time is up. ' : '') + 'You scored ' + score + ' / ' + questions.length + '. Redirecting to the scoreboard...';
      }

      window.setTimeout(function () {
        window.location.href = '../scoreboard.html';
      }, 900);
    }

    renderTimer();

    const timerId = window.setInterval(function () {
      remaining -= 1;
      renderTimer();
      if (remaining <= 0) {
        window.clearInterval(timerId);
        finishQuiz(true);
      }
    }, 1000);

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        window.clearInterval(timerId);
        finishQuiz(false);
      });
    }
  }

    document.addEventListener('DOMContentLoaded', initQuizPage);
})();
