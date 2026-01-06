# Neural Memory Decay Simulator

A small browser-based simulator that visualizes how a simple neural memory trace decays over time. This is a minimal interactive demo implemented with plain HTML, CSS, and JavaScript.

## Demo

- Open [index.html](index.html) in a browser to run the simulator locally.
- Or serve the folder and visit `http://localhost:8000` (example using Python):

```bash
python -m http.server 8000
```

## Features

- Visualizes a decaying memory trace over time.
- Interactive controls to start/stop the simulation and adjust parameters.
- Lightweight: single-page app using `index.html`, `style.css`, and `script.js`.

## Files

- [index.html](index.html) — the demo page and UI.
- [style.css](style.css) — styles for the UI and visualization.
- [script.js](script.js) — simulator logic and rendering.

## Usage

1. Open [index.html](index.html) in a modern browser.
2. Use the on-page controls to start the simulation and change parameters such as decay rate, input strength, or time scale.

## Development

- No build step required — edit `script.js` and `style.css` and refresh the page to see changes.
- To run a simple local server (recommended for some browser restrictions), use:

```bash
python -m http.server 8000
```

## Contributing

Contributions are welcome — open issues or submit pull requests for improvements and new visualizations.


