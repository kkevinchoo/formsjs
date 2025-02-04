# formsjs

## Instalación
1. Agrega `formsjs.js` en tu proyecto.
2. Usa `formsjs.init("contenedor", quizData, config);`.

## Configuración
```json
{
  "mode": "modal | inline",
  "colors": {
    "background": "#f4f4f4",
    "button": "#007BFF",
    "buttonText": "#fff",
    "modalBackground": "rgba(0, 0, 0, 0.8)"
  },
  "timer": 15,
  "onFinish": "función al terminar",
  "onAnswer": "función al responder"
}