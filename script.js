const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const canvas1 = document.getElementById("canvas1");
const ctx1 = canvas1.getContext("2d");
const SIZE = 128; // 🔥 lower resolution = fast render
let model = null;
let imageData = null;

/* ================= IMAGE LOAD ================= */

document.getElementById("imageInput").addEventListener("change", e => {
  const img = new Image();
  img.onload = () => {
    ctx1.drawImage(img, 0, 0, SIZE, SIZE);
    imageData = ctx1.getImageData(0, 0, SIZE, SIZE);
  };
  img.src = URL.createObjectURL(e.target.files[0]);
});

/* ================= MODEL ================= */

function createModel() {
  const m = tf.sequential();

  m.add(tf.layers.dense({ inputShape: [2], units: 128, activation: "relu" }));
  m.add(tf.layers.dense({ units: 128, activation: "relu" }));
  m.add(tf.layers.dense({ units: 3, activation: "sigmoid" }));

  m.compile({
    optimizer: tf.train.adam(0.01),
    loss: "meanSquaredError"
  });

  return m;
}

/* ================= DATA PREP ================= */

function prepareData() {
  const xs = [];
  const ys = [];

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (y * SIZE + x) * 4;

      xs.push([x / SIZE, y / SIZE]);

      ys.push([
        imageData.data[i] / 255,
        imageData.data[i + 1] / 255,
        imageData.data[i + 2] / 255
      ]);
    }
  }

  return {
    x: tf.tensor2d(xs),
    y: tf.tensor2d(ys)
  };
}

/* ================= TRAIN ================= */

document.getElementById("trainBtn").addEventListener("click", async () => {
  if (!imageData) {
    alert("Upload an image first");
    return;
  }

  model = createModel();
  const data = prepareData();

  const totalEpochs = 100;
  document.getElementById("epochDisplay").innerText = "Epoch: 0";

  await model.fit(data.x, data.y, {
    epochs: totalEpochs,
    batchSize: 1024,
    callbacks: {
      onEpochEnd: async (epoch) => {
        document.getElementById("epochDisplay").innerText =
          `Epoch: ${epoch + 1} / ${totalEpochs}`;

        await renderImage();
      }
    }
  });
  data.x.dispose();
  data.y.dispose();
});

/* ================= FAST RENDER ================= */

async function renderImage() {
  await tf.nextFrame(); // 👈 allow browser repaint

  const coords = [];
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      coords.push([x / SIZE, y / SIZE]);
    }
  }

  const inputTensor = tf.tensor2d(coords);
  const preds = model.predict(inputTensor);
  const values = await preds.data();

  const output = ctx.createImageData(SIZE, SIZE);
  let p = 0;

  for (let i = 0; i < values.length; i += 3) {
    output.data[p++] = values[i] * 255;
    output.data[p++] = values[i + 1] * 255;
    output.data[p++] = values[i + 2] * 255;
    output.data[p++] = 255;
  }

  ctx.putImageData(output, 0, 0);

  inputTensor.dispose();
  preds.dispose();
}

/* ================= MEMORY DECAY ================= */

document.getElementById("decayBtn").addEventListener("click", async () => {
  if (!model) return;

  const weights = model.getWeights();
  const damaged = weights.map(w =>
    tf.add(w, tf.randomNormal(w.shape, 0, 0.12))
  );

  model.setWeights(damaged);
  await renderImage();
});