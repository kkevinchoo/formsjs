class formsjs {
    static init(containerId, quizData, config = {}) {
      this.container = document.getElementById(containerId)
      this.quizData = quizData
      this.config = {
        mode: config.mode || "inline",
        colors: {
          background: config.colors?.background || "#f0f0f0",
          question: config.colors?.question || "#333333",
          button: config.colors?.button || ["#E21B3C", "#1368CE", "#D89E00", "#26890C"],
          buttonText: config.colors?.buttonText || "#ffffff",
          timer: config.colors?.timer || "#FF8800",
          modalBackground: config.colors?.modalBackground || "rgba(0, 0, 0, 0.8)",
        },
        timer: config.timer === undefined ? 20 : config.timer,
        height: config.height || "auto",
        width: config.width || "100%",
        fontSize: config.fontSize || "1.6",
        onFinish:
          config.onFinish ||
          ((score, totalQuestions) => {
            alert(`Quiz finalizado. Puntuación: ${score}/${totalQuestions}`)
          }),
        onAnswer: config.onAnswer || ((isCorrect, answer) => {}),
      }
      this.currentQuestionIndex = 0
      this.score = 0
      this.startQuiz()
    }
  
    static startQuiz() {
      if (this.config.mode === "modal") {
        this.createModal()
      }
      this.showQuestion()
    }
  
    static createModal() {
      this.modal = document.createElement("div")
      this.modal.style.position = "fixed"
      this.modal.style.top = "0"
      this.modal.style.left = "0"
      this.modal.style.width = "100%"
      this.modal.style.height = "100%"
      this.modal.style.background = this.config.colors.modalBackground
      this.modal.style.display = "flex"
      this.modal.style.alignItems = "center"
      this.modal.style.justifyContent = "center"
      this.modal.innerHTML = `<div id="quiz-modal-content" style="background:${this.config.colors.background}; padding:20px; border-radius:10px; width:80%; max-width:600px;"></div>`
      document.body.appendChild(this.modal)
      this.container = document.getElementById("quiz-modal-content")
    }
  
    static showQuestion() {
      if (this.currentQuestionIndex >= this.quizData.questions.length) {
        this.showResults()
        return
      }
  
      const question = this.quizData.questions[this.currentQuestionIndex]
      let answersHTML = ""
  
      question.answers.forEach((answer, index) => {
        let iconHTML = ""
        if (answer.icon) {
          iconHTML = `<i class="${answer.icon}" style="font-size: 1.5em; margin: 5px;"></i>`
        }
        let imageHTML = ""
        if (answer.image) {
          imageHTML = `<img src="${answer.image}" alt="${answer.text}" style="max-width:50px; max-height:50px; margin:5px;">`
        }
  
        let content = ""
        switch (answer.iconPosition) {
          case "top":
            content = `<div style="display:flex; flex-direction:column; align-items:center;">
                                  ${iconHTML || imageHTML}
                                  <span>${answer.text}</span>
                                 </div>`
            break
          case "bottom":
            content = `<div style="display:flex; flex-direction:column; align-items:center;">
                                  <span>${answer.text}</span>
                                  ${iconHTML || imageHTML}
                                 </div>`
            break
          case "left":
            content = `<div style="display:flex; align-items:center;">
                                  ${iconHTML || imageHTML}
                                  <span>${answer.text}</span>
                                 </div>`
            break
          case "right":
          default:
            content = `<div style="display:flex; align-items:center; justify-content:space-between;">
                                  <span>${answer.text}</span>
                                  ${iconHTML || imageHTML}
                                 </div>`
            break
        }
  
        const color = this.config.colors.button[index % this.config.colors.button.length]
  
        answersHTML += `
                  <button class="answer-button" data-index="${index}" style="background-color:${color}; color:${this.config.colors.buttonText}; margin:5px; padding:10px; border:none; border-radius:5px; cursor:pointer; width: ${this.config.width}; height: ${this.config.height}; display:flex; justify-content:center; align-items:center; font-size:${this.config.fontSize};">
                      ${content}
                  </button>
              `
      })
  
      this.container.innerHTML = `
              <div class="quiz-container" style="text-align:center; background-color:${this.config.colors.background}; padding:20px; border-radius:10px;">
                  <h2 class="quiz-question" style="color:${this.config.colors.question};">${question.question}</h2>
                  ${question.image ? `<img src="${question.image}" class="quiz-image" style="max-width:100%; margin-bottom:10px;">` : ""}
                  ${question.icon ? `<i class="${question.icon}" style="font-size:2em; margin-bottom:10px;"></i>` : ""}
                  <div class="quiz-answers" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px;">${answersHTML}</div>
                  ${this.config.timer ? `<div class="quiz-timer" style="margin-top:20px; font-size:1.5em; color:${this.config.colors.timer};">⏳ ${this.config.timer}s</div>` : ""}
              </div>
          `
  
      document.querySelectorAll(".answer-button").forEach((button) => {
        button.addEventListener("click", (event) => {
          const index = event.target.closest(".answer-button").getAttribute("data-index")
          this.checkAnswer(Number.parseInt(index))
        })
      })
  
      if (this.config.timer) {
        this.startTimer()
      }
    }
  
    static startTimer() {
      let timeLeft = this.config.timer
      const timerElement = document.querySelector(".quiz-timer")
      if (this.timerInterval) clearInterval(this.timerInterval)
  
      this.timerInterval = setInterval(() => {
        timeLeft--
        timerElement.textContent = `⏳ ${timeLeft}s`
        if (timeLeft <= 0) {
          clearInterval(this.timerInterval)
          this.nextQuestion()
        }
      }, 1000)
    }
  
    static checkAnswer(index) {
      if (this.timerInterval) clearInterval(this.timerInterval)
      const question = this.quizData.questions[this.currentQuestionIndex]
      const isCorrect = question.answers[index].correct
  
      if (isCorrect) {
        this.score++
      }
  
      this.config.onAnswer(isCorrect, question.answers[index])
      this.nextQuestion()
    }
  
    static nextQuestion() {
      this.currentQuestionIndex++
      this.showQuestion()
    }
  
    static showResults() {
      this.container.innerHTML = `
              <div style="text-align:center; background-color:${this.config.colors.background}; padding:20px; border-radius:10px;">
                  <h1 style="font-size:2em; color:${this.config.colors.question};">QUIZ FINALIZADO</h1>
                  <p style="font-size:1.5em; color:${this.config.colors.question};">Puntuación: ${this.score}/${this.quizData.questions.length}</p>
              </div>
          `
      this.config.onFinish(this.score, this.quizData.questions.length)
      if (this.config.mode === "modal") {
        setTimeout(() => {
          document.body.removeChild(this.modal)
        }, 3000)
      }
    }
  }
  
  