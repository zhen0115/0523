function setup() {
  // 創建一個 640x480 的畫布
  createCanvas(640, 480);

  // 將畫布置中在視窗中間
  let x = (windowWidth - width) / 2;
  let y = (windowHeight - height) / 2;
  canvas.position(x, y);

  // 設定線條顏色為紅色
  stroke(255, 0, 0);
  // 設定線條粗細為 15
  strokeWeight(15);

  // facemesh 的關鍵點編號
  const keypointsIndices = [
    409, 270, 269, 267, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405,
    321, 375, 291, 76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304,
    303, 302, 11, 72, 73, 74, 184,
  ];

  // 載入 facemesh 模型
  ml5.facemesh(modelLoaded).then(model => {
    facemeshModel = model;
    facemeshModel.on('predict', results => {
      predictions = results;
    });
  });
}

let facemeshModel;
let predictions = [];

function modelLoaded() {
  console.log('Facemesh 模型已載入！');
}

function draw() {
  // 清空畫布
  clear();

  // 如果有偵測到人臉
  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 迭代關鍵點編號並畫線
    for (let i = 0; i < keypointsIndices.length - 1; i++) {
      const index1 = keypointsIndices[i];
      const index2 = keypointsIndices[i + 1];
      line(keypoints[index1][0], keypoints[index1][1], keypoints[index2][0], keypoints[index2][1]);
    }
  }
}
