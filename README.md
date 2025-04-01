# FormsJS Quiz Library

## Características
- Modos inline y modal
- Temporizador configurable
- Preguntas condicionales
- Tipos de pregunta: selección múltiple y texto
- Personalización de colores y estilos
- Soporte para íconos e imágenes
- Callbacks para manejo de respuestas

## Instalación
Incluye el archivo JS:
```html
<script src="formsjs.min.js"></script>
```

## Configuración
```js
const config = {
  mode: "inline", // "inline" | "modal"
  timer: 20,      // Segundos por pregunta (0 = desactivado)
  height: "300px",
  width: "100%",
  buttonWidth: "25%",
  fontSize: "1.6em",
  isGraded: false,
  textFinishTitle: "Quiz Finalizado",
  textFinishText: "Gracias por participar",
  colors: {
    background: "#f4f4f4",
    question: "#333333",
    button: ["#007BFF", "#28a745", "#ffc107", "#dc3545"],
    buttonText: "#ffffff",
    timer: "#17a2b8",
    modalBackground: "rgba(0, 0, 0, 0.8)"
  },
  onFinish: (responses) => {},
  onAnswer: (response) => {}
};
```

## Estructura de Datos
```js
const quizData = {
  questions: [
    {
      question: "Texto de la pregunta",
      type: "choice", // "choice" | "text"
      image: "url-opcional.jpg",
      icon: "fa-icono",
      condition: { 
        questionIndex: 0, 
        expectedAnswer: true 
      },
      answers: [
        { 
          text: "Opción 1",
          correct: true,
          width: "25%",
          image: "icono.jpg",
          icon: "fa-user"
        }
      ]
    }
  ]
};
```

## Uso Básico
```js
// Inicializar quiz
formsjs.init('quiz-container', quizData, config);

// Destruir instancia
formsjs.destroy();
```

## Tipos de Preguntas
- Selección múltiple:
    - Usar type: "choice"
    - Definir correct: boolean en respuestas
- Texto abierto:
    - Usar type: "text"
    - No requiere definición de respuestas

## Preguntas Condicionales
```js
condition: {
  questionIndex: 0,          // Índice de pregunta referenciada
  expectedAnswer: true|false // Respuesta requerida para mostrar
}
```

## Métodos Públicos
- init(containerId, quizData, config): Inicializa el quiz
- destroy(): Limpia recursos y remueve elementos
- startQuiz(): Reinicia el cuestionario

## Ejemplo Completo
```js
// Configuración
const quizConfig = {
  mode: "modal",
  timer: 15,
  buttonWidth: "45%",
  onFinish: (responses) => console.log(responses)
};

// Datos del quiz
const quizData = {
  questions: [
    {
      question: "¿Cómo prefieres aprender?",
      type: "choice",
      answers: [
        { text: "Vídeos", correct: true, width: "30%" },
        { text: "Lecturas", correct: false },
        { text: "Práctica", correct: false }
      ]
    }
  ]
};

// Inicializar
formsjs.init('quiz-container', quizData, quizConfig);
```

## Notas
- Los estilos se pueden sobreescribir via CSS
- Requiere un contenedor HTML con el ID especificado
- Compatible con navegadores modernos (ES6+)
