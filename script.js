"use strict";

let gl;
let program;
let modelViewMatrix, projectionMatrix;
let modelViewMatrixLoc, projectionMatrixLoc;

// Buffers
let iBufferWall, iBufferFloor, iBufferRoof, iBufferPedestal, iBufferPicture;

// Cor e Textura
let colorLoc, useTextureLoc, texture, uTexture;
let textureWall, textureFloor, textureRoof, texturePedestal, texturePicture;

// Carregar texturas
const BASE_PATH = "/museu-cg";
function loadTexture(url, texObj) {
  const image = new Image();
  image.src = BASE_PATH + url;
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texObj);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.MIRRORED_REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
}

// Modelagem
let divideSierpinski = 1;
let sierpinski = getSierpinski(4);
let structure = getStructure();
let pedestal = getPedestal();
let picture = getPicture();
let allVertices = structure.concat(pedestal).concat(picture).concat(sierpinski);
let texCoords = getTextureVertices(10).concat(getTexturePedestal(1)).concat(getTexturePicture(1));

// Camera
let eye = vec3(0, 2, 1.75);
let theta = 0;
let at = computeAt();
let up = vec3(0, 1, 0);

function computeAt() {
  return add(eye, vec3(Math.sin(theta), 0, -Math.cos(theta)));
}

window.onload = function init() {
  const canvas = document.getElementById("gl-canvas");
  gl = WebGLUtils.setupWebGL(canvas);

  // Ajuste para resolução real do display
  canvas.width = canvas.clientWidth * window.devicePixelRatio;
  canvas.height = (canvas.clientWidth / 2) * window.devicePixelRatio;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);

  // Buffer de vértices
  let vBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(allVertices), gl.STATIC_DRAW);

  let positionLoc = gl.getAttribLocation(program, "aPosition");
  gl.vertexAttribPointer(positionLoc, 4, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(positionLoc);

  //Buffer de texturas
  let tBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

  let textureLoc = gl.getAttribLocation(program, "aTexCoord");
  gl.vertexAttribPointer(textureLoc, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(textureLoc);

  textureWall = gl.createTexture();
  loadTexture("/texture/wall.jpg", textureWall);

  textureFloor = gl.createTexture();
  loadTexture("/texture/floor.jpg", textureFloor);

  textureRoof = gl.createTexture();
  loadTexture("/texture/roof.jpg", textureRoof);

  texturePedestal = gl.createTexture();
  loadTexture("/texture/pedestal.jpg", texturePedestal);

  texturePicture = gl.createTexture();
  loadTexture("/texture/picture.jpg", texturePicture);

  // Buffers de índices
  iBufferWall = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferWall);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(getIndicesWall()), gl.STATIC_DRAW);

  iBufferFloor = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferFloor);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(getIndicesFloor()), gl.STATIC_DRAW);

  iBufferRoof = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferRoof);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(getIndicesRoof()), gl.STATIC_DRAW);

  iBufferPedestal = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferPedestal);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(getIndicesPedestal(structure.length)), gl.STATIC_DRAW);

  iBufferPicture = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferPicture);
  let i = structure.concat(pedestal).length;
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(getIndicesPicture(i)), gl.STATIC_DRAW);

  // Uniformes
  uTexture = gl.getUniformLocation(program, "uTexture");
  colorLoc = gl.getUniformLocation(program, "uColor");
  useTextureLoc = gl.getUniformLocation(program, "useTexture");
  modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
  projectionMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");

  document.addEventListener("keydown", keyHandler);

  render();
};

function keyHandler(e) {
  const speed = 0.25;
  const limit = 4.5;

  if (e.key === 'a') theta -= 0.1;   // girar à esquerda
  if (e.key === 'd') theta += 0.1;   // girar à direita

  if (e.key === 'w') {
    // Cálculo da posição futura
    let nextX = eye[0] + speed * Math.sin(theta);
    let nextZ = eye[2] - speed * Math.cos(theta);

    // Verifica se está dentro dos limites antes de mover
    if (Math.abs(nextX) <= limit) eye[0] = nextX;
    if (Math.abs(nextZ) <= limit) eye[2] = nextZ;
  }

  if (e.key === 's') {
    let nextX = eye[0] - speed * Math.sin(theta);
    let nextZ = eye[2] + speed * Math.cos(theta);

    if (Math.abs(nextX) <= limit) eye[0] = nextX;
    if (Math.abs(nextZ) <= limit) eye[2] = nextZ;
  }

  // Interações com o triângulo
  if (e.key === 'q' && divideSierpinski > 1) divideSierpinski -= 2;
  if (e.key === 'e' && divideSierpinski < 12) divideSierpinski += 2;

  at = computeAt(); // atualiza direção do olhar
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  modelViewMatrix = lookAt(eye, at, up);
  projectionMatrix = perspective(60, 1.0, 0.1, 100.0);

  gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
  gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix));

  // Wall
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureWall);
  gl.uniform1i(uTexture, 0);
  gl.uniform1i(useTextureLoc, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferWall);
  gl.drawElements(gl.TRIANGLE_STRIP, getIndicesWall().length, gl.UNSIGNED_BYTE, 0);

  // Floor
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureFloor);
  gl.uniform1i(uTexture, 0);
  gl.uniform1i(useTextureLoc, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferFloor);
  gl.drawElements(gl.TRIANGLE_STRIP, getIndicesFloor().length, gl.UNSIGNED_BYTE, 0);

  // Roof
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, textureRoof);
  gl.uniform1i(uTexture, 0);
  gl.uniform1i(useTextureLoc, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferRoof);
  gl.drawElements(gl.TRIANGLE_STRIP, getIndicesRoof().length, gl.UNSIGNED_BYTE, 0);

  // Pedestal
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturePedestal);
  gl.uniform1i(uTexture, 0);
  gl.uniform1i(useTextureLoc, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferPedestal);
  gl.drawElements(gl.TRIANGLE_STRIP, getIndicesPedestal().length, gl.UNSIGNED_BYTE, 0);

  // Picture
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texturePicture);
  gl.uniform1i(uTexture, 0);
  gl.uniform1i(useTextureLoc, true);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBufferPicture);
  gl.drawElements(gl.TRIANGLE_STRIP, getIndicesPicture().length, gl.UNSIGNED_BYTE, 0);

  // Triângulo de Sierpinski
  gl.uniform1i(useTextureLoc, false);
  gl.uniform4fv(colorLoc, [0, 0, 0, 1]);
  let indicesSierpinski = structure.concat(pedestal).concat(picture).length;
  gl.drawArrays(gl.TRIANGLES, indicesSierpinski, sierpinski.length / divideSierpinski);

  requestAnimationFrame(render);
}