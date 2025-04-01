class formsjs {
  static init(containerId, quizData, config = {}) {
    this.responses = [];
    this.currentQuestionIndex = 0;
    this.timerInterval = null;
    this.modal = null;

    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Contenedor con ID ${containerId} no encontrado`);
      return;
    }
    this.quizData = quizData;
    this.config = {
      mode: config.mode || "inline",
      colors: {
        background: config.colors?.background || "#f0f0f0",
        question: config.colors?.question || "#333333",
        button: config.colors?.button || [
          "#E21B3C",
          "#1368CE",
          "#D89E00",
          "#26890C",
        ],
        buttonText: config.colors?.buttonText || "#ffffff",
        timer: config.colors?.timer || "#FF8800",
        modalBackground: config.colors?.modalBackground || "rgba(0, 0, 0, 0.8)",
      },
      timer: config.timer === undefined ? 0 : config.timer,
      height: config.height || "auto",
      width: config.width || "100%",
      buttonWidth: config.buttonWidth || "100%", // Nuevo: ancho por defecto de los botones
      fontSize: config.fontSize || "1.6em",
      isGraded: config.isGraded || false,
      textFinishTitle: config.textFinishTitle || "Quiz finalizado",
      textFinishText: config.textFinishText || "",
      onFinish:
        config.onFinish ||
        ((responses) => {
          alert("Quiz completado");
        }),
      onAnswer: config.onAnswer || ((response) => {}),
    };

    this.startQuiz();
  }

  static getFilteredQuestions() {
    return this.quizData.questions.filter((question, index) => {
      if (!question.condition) return true;

      const { questionIndex, expectedAnswer } = question.condition;
      if (questionIndex >= 0 && questionIndex < this.responses.length) {
        const prevAnswer = this.responses[questionIndex];
        return prevAnswer?.isCorrect === expectedAnswer;
      }
      return false;
    });
  }

  static startQuiz() {
    if (this.config.mode === "modal") {
      this.createModal();
    }
    this.showQuestion();
  }

  static createModal() {
    this.modal = document.createElement("div");
    this.modal.style.position = "fixed";
    this.modal.style.top = "0";
    this.modal.style.left = "0";
    this.modal.style.width = "100%";
    this.modal.style.height = "100%";
    this.modal.style.background = this.config.colors.modalBackground;
    this.modal.style.display = "flex";
    this.modal.style.alignItems = "center";
    this.modal.style.justifyContent = "center";
    this.modal.style.zIndex = "1000";
    this.modal.innerHTML = `<div id="quiz-modal-content" style="background:${this.config.colors.background}; padding:20px; border-radius:10px; width:80%; max-width:600px;"></div>`;
    document.body.appendChild(this.modal);
    this.container = document.getElementById("quiz-modal-content");
  }

  static showQuestion() {
    const filteredQuestions = this.getFilteredQuestions();

    if (this.currentQuestionIndex >= filteredQuestions.length) {
      this.showResults();
      return;
    }

    const question = filteredQuestions[this.currentQuestionIndex];
    let answersHTML = "";

    if (question.type === "choice") {
      question.answers.forEach((answer, index) => {
        const color =
          this.config.colors.button[index % this.config.colors.button.length];
        const buttonWidth = answer.width || this.config.buttonWidth;

        answersHTML += `
                <button class="answer-button" data-index="${index}" 
                    style="background-color:${color}; color:${this.config.colors.buttonText}; 
                    margin:5px; padding:10px; border:none; border-radius:5px; 
                    cursor:pointer; width:${buttonWidth}; height:${this.config.height}; 
                    font-size:${this.config.fontSize}; text-align:center;">
                    ${answer.text}
                </button>
            `;
      });
    } else if (question.type === "text") {
      answersHTML = `
            <input type="text" class="text-answer" 
                style="width:100%; padding:10px; font-size:${this.config.fontSize}; 
                margin:10px 0; border-radius:5px; border:1px solid #ccc;">
            <button class="submit-text-answer" 
                style="background-color:${this.config.colors.button[0]}; 
                color:${this.config.colors.buttonText}; padding:10px 20px; 
                border:none; border-radius:5px; cursor:pointer;">
                Continuar
            </button>
        `;
    }

    this.container.innerHTML = `
        <div class="quiz-container" style="text-align:center; background-color:${
          this.config.colors.background
        }; padding:20px; border-radius:10px;">
            <h2 class="quiz-question" style="color:${
              this.config.colors.question
            };">${question.question}</h2>
            <div class="quiz-answers" style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px;">
                ${answersHTML}
            </div>
            ${
              this.config.timer
                ? `<div class="quiz-timer" style="margin-top:20px; font-size:1.5em; color:${this.config.colors.timer};">⏳ ${this.config.timer}s</div>`
                : ""
            }
        </div>
    `;

    // Agregar event listeners después de crear el HTML
    if (question.type === "choice") {
      document.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = parseInt(event.target.getAttribute("data-index"));
          this.handleAnswer(question, question.answers[index]);
        });
      });
    } else if (question.type === "text") {
      document
        .querySelector(".submit-text-answer")
        .addEventListener("click", () => {
          const textValue = document.querySelector(".text-answer").value;
          this.handleAnswer(question, { text: textValue, correct: true });
        });
    }

    if (this.config.timer) {
      this.startTimer(question);
    }
  }

  static startTimer(question) {
    let timeLeft = this.config.timer;
    const timerElement = document.querySelector(".quiz-timer");
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `⏳ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(this.timerInterval);
        this.handleAnswer(question, { text: "Sin respuesta", correct: false });
      }
    }, 1000);
  }

  static handleAnswer(question, answer) {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }

    const response = {
      question: question.question,
      answer: answer.text,
      isCorrect: answer.correct,
      correctAnswer:
        question.type === "choice"
          ? question.answers.find((a) => a.correct)?.text
          : null,
    };

    this.responses.push(response);
    if (this.config.onAnswer) {
      this.config.onAnswer(response);
    }

    this.currentQuestionIndex++;
    this.showQuestion();
  }

  static showResults() {
    const filteredQuestions = this.getFilteredQuestions();
    const score = this.config.isGraded
      ? this.responses.filter((r) => r.isCorrect).length
      : null;
    const total = this.config.isGraded ? filteredQuestions.length : null;

    this.container.innerHTML = `
            <div style="text-align:center; background-color:${
              this.config.colors.background
            }; padding:20px; border-radius:10px;">
                <h1 style="font-size:2em; color:${
                  this.config.colors.question
                };">${this.config.textFinishTitle}</h1>
                ${
                  this.config.isGraded
                    ? `<p style="font-size:1.5em; color:${this.config.colors.question};">Puntuación: ${score}/${total}</p>`
                    : ""
                }
                <p style="font-size:1.2em; color:${
                  this.config.colors.question
                };">${this.config.textFinishText}</p>
            </div>
        `;

    if (this.config.onFinish) {
      this.config.onFinish(this.responses);
    }

    if (this.config.mode === "modal") {
      setTimeout(() => {
        if (this.modal && document.body.contains(this.modal)) {
          document.body.removeChild(this.modal);
        }
      }, 3000);
    }
  }

  static destroy() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    if (this.modal && document.body.contains(this.modal)) {
      document.body.removeChild(this.modal);
    }
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  static calculateAnswersLayout(answers) {
    const hasCustomWidths = answers.some((a) => a.width);

    if (!hasCustomWidths) {
      return "display:flex; flex-direction:column; gap:10px; width:100%;";
    }

    return "display:flex; flex-wrap:wrap; justify-content:center; gap:10px;";
  }
}
