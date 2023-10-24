document.addEventListener("DOMContentLoaded", () => {
    const elements = {
      welcomeContainer: document.querySelector(".welcome-container"),
      startSurveyButton: document.querySelector(".start-survey-button"),
      surveyContainer: document.querySelector(".survey-container"),
      questionNumber: document.querySelector(".question-number"),
      questionText: document.querySelector(".question-text"),
      ratingOptions: document.querySelectorAll('input[name="rating"]'),
      previousButton: document.querySelector(".previous-button"),
      nextButton: document.querySelector(".next-button"),
      skipButton: document.querySelector(".skip-button"),
      feedbackInput: document.querySelector(".feedback-input"),
      submitSurveyButton: document.querySelector(".submit-survey-button"),
      thankyouContainer: document.querySelector(".thankyou-container"),
    };
  
    const state = {
      currentQuestionIndex: 0,
      answers: [],
    };
  
    const questions = [
      {
        question: "How satisfied are you with our products?",
        type: "rating",
        min: 1,
        max: 5,
      },
      {
        question: "How fair are the prices compared to similar retailers?",
        type: "rating",
        min: 1,
        max: 5,
      },
      {
        question: "How satisfied are you with the value for money of your purchase?",
        type: "rating",
        min: 1,
        max: 5,
      },
      {
        question: "On a scale of 1-10, how likely are you to recommend us to your friends and family?",
        type: "rating",
        min: 1,
        max: 10,
      },
      {
        question: "What could we do to improve our service?",
        type: "text",
      },
    ];
  
    elements.startSurveyButton.addEventListener("click", () => {
      elements.welcomeContainer.style.display = "none";
      elements.surveyContainer.style.display = "block";
      showQuestion(state.currentQuestionIndex);
    });
  
    elements.previousButton.addEventListener("click", () => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex--;
        showQuestion(state.currentQuestionIndex);
      }
    });
  
    elements.nextButton.addEventListener("click", () => {
      if (validateAnswer()) {
        saveAnswer();
        if (state.currentQuestionIndex < questions.length - 1) {
          state.currentQuestionIndex++;
          showQuestion(state.currentQuestionIndex);
        } else {
          showConfirmationDialog();
        }
      }
    });
  
    elements.skipButton.addEventListener("click", () => {
      if (state.currentQuestionIndex < questions.length - 1) {
        state.currentQuestionIndex++;
        showQuestion(state.currentQuestionIndex);
      }
    });
  
    elements.submitSurveyButton.addEventListener("click", () => {
      showConfirmationDialog();
    });
  
    function showQuestion(index) {
      const currentQuestion = questions[index];
      elements.questionNumber.textContent = `${index + 1}/${questions.length}`;
      elements.questionText.textContent = currentQuestion.question;
      elements.feedbackInput.style.display = currentQuestion.type === "text" ? "block" : "none";
  
      if (currentQuestion.type === "rating") {
        elements.ratingOptions.forEach((rating) => {
          rating.checked = false;
          rating.disabled = false;
          rating.addEventListener("click", () => {
            elements.skipButton.disabled = true;
            elements.nextButton.disabled = false;
          });
        });
      }
  
      if (state.answers[index] !== undefined) {
        if (currentQuestion.type === "rating") {
          elements.ratingOptions[state.answers[index] - 1].checked = true;
          elements.nextButton.disabled = false;
        } else {
          elements.feedbackInput.value = state.answers[index];
          elements.nextButton.disabled = false;
        }
      } else {
        if (currentQuestion.type === "rating") {
          elements.nextButton.disabled = true;
          elements.skipButton.disabled = false;
        } else {
          elements.nextButton.disabled = true;
        }
      }
  
      elements.previousButton.disabled = index === 0;
    }
  
    function validateAnswer() {
      if (questions[state.currentQuestionIndex].type === "rating") {
        const selectedRating = Array.from(elements.ratingOptions).find((rating) => rating.checked);
        if (selectedRating) {
          return true;
        } else {
          alert("Please select a rating");
          return false;
        }
      } else {
        return true;
      }
    }
  
    function saveAnswer() {
        const currentQuestion = questions[state.currentQuestionIndex];
        const answer = {};
    
        if (currentQuestion.type === "rating") {
            const selectedRating = Array.from(elements.ratingOptions).findIndex((rating) => rating.checked);
            answer.type = "rating";
            answer.value = selectedRating + 1;
        } else {
            answer.type = "text";
            answer.value = elements.feedbackInput.value;
        }
        state.answers[state.currentQuestionIndex] = answer;    
        saveAnswerToLocalStorage(state.currentQuestionIndex, answer);
    }
    function saveAnswerToLocalStorage(questionIndex, answer) {
        const storageKey = `answer_${questionIndex}`;
        localStorage.setItem(storageKey, JSON.stringify(answer));
    }

  
    function showConfirmationDialog() {
      const confirmation = confirm("Are you sure you want to submit the survey?");
      if (confirmation) {
        submitSurvey();
      }
    }
  
    function submitSurvey() {
  
      elements.surveyContainer.style.display = "none";
      elements.thankyouContainer.style.display = "block";
  
      setTimeout(() => {
        elements.thankyouContainer.style.display = "none";
        elements.welcomeContainer.style.display = "block";
        state.currentQuestionIndex = 0;
        state.answers = [];
      }, 5000);
    }
});
  