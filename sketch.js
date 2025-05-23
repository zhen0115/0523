// sketch.js

let capture;
let facemesh;
const width = 640;
const height = 480;
let predictions = [];

// 第一組邊線的點的索引
const faceOutlineIndices = [
  409, 270, 269, 67, 0, 37, 39, 40, 185, 61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291
];

// 第二組要連接的點的索引
const secondLineIndices = [
  76, 77, 90, 180, 85, 16, 315, 404, 320, 307, 306, 408, 304, 303, 302, 11, 72, 73, 74, 184
];

function setup() {
  createCanvas(width, height);
  capture = createCapture(VIDEO);
  capture.size(width, height);
  capture.hide();

  facemesh = ml5.facemesh(capture, modelLoaded);

  facemesh.on('predict', results => {
    predictions = results;
  });
}

function modelLoaded() {
  console.log('Facemesh Model Loaded!');
}

function draw() {
  background(0);
  image(capture, 0, 0, width, height);

  // 將畫布置中
  translate((windowWidth - width) / 2, (windowHeight - height) / 2);

  drawFacemeshLines();
  drawSecondGroupLines();
  drawGreenBetweenGroups();
}

function drawFacemeshLines() {
  stroke(255, 0, 0); // 紅色
  strokeWeight(15);
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    beginShape();
    for (let i = 0; i < faceOutlineIndices.length; i++) {
      const index = faceOutlineIndices[i];
      vertex(keypoints[index][0], keypoints[index][1]);
    }
    endShape();
  }
}

function drawSecondGroupLines() {
  stroke(255, 255, 0); // 黃色
  strokeWeight(5);
  noFill();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;
    beginShape();
    for (let i = 0; i < secondLineIndices.length; i++) {
      const index = secondLineIndices[i];
      vertex(keypoints[index][0], keypoints[index][1]);
    }
    endShape();

    // 填充第二組陣列內部的顏色
    fill(255, 255, 0, 50); // 黃色，帶透明度
    beginShape();
    for (let i = 0; i < secondLineIndices.length; i++) {
      const index = secondLineIndices[i];
      vertex(keypoints[index][0], keypoints[index][1]);
    }
    endShape(CLOSE); // 閉合形狀以填充
  }
}

function drawGreenBetweenGroups() {
  stroke(0, 255, 0); // 綠色
  strokeWeight(5);

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 填充第一組和第二組之間的區域 (一種簡單的近似方法)
    fill(0, 255, 0, 50); // 綠色，帶透明度
    beginShape();
    // 添加第一組的一些點
    for (let i = 0; i < faceOutlineIndices.length; i += Math.floor(faceOutlineIndices.length / 5)) {
      const index = faceOutlineIndices[i];
      vertex(keypoints[index][0], keypoints[index][1]);
    }
    // 添加第二組的一些點 (反向順序連接)
    for (let i = secondLineIndices.length - 1; i >= 0; i -= Math.floor(secondLineIndices.length / 5)) {
      const index = secondLineIndices[i];
      vertex(keypoints[index][0], keypoints[index][1]);
    }
    endShape(CLOSE);
  }
}

function windowResized() {
  resizeCanvas(width, height);
}
