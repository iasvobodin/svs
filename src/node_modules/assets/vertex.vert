#ifdef GL_ES
precision mediump float;
#endif
// those are the mandatory attributes that the lib sets
attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;
// those are mandatory uniforms that the lib sets and that contain our model view and projection matrix
uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
// uniform float uTime;
uniform float uProgress; 
// uniform float uVawe;
varying vec2 vTextureCoord0;
varying vec2 vTextureCoord1;
varying vec2 vActiveTextureCoord;
varying vec2 vNextTextureCoord;
  
// textures matrices
uniform mat4 activeTexMatrix;
uniform mat4 nextTexMatrix;
// textures matrices
uniform mat4 uTextureMatrix0;
uniform mat4 uTextureMatrix1;
// pass your vertex and texture coords to the fragment shader
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
void main() {
vTextureCoord0 = (uTextureMatrix0  * vec4(aTextureCoord , 0.0, 1.0)).xy;
vTextureCoord1 = (uTextureMatrix1 * vec4(aTextureCoord, 0.0, 1.0)).xy;
// lowp float vVolna = sin( uTime + aVertexPosition.x + aVertexPosition.y);
gl_Position = uPMatrix  * uMVMatrix * vec4(aVertexPosition, 1.0); 

// vTextureCoord = aTextureCoord;
vVertexPosition = aVertexPosition;
vActiveTextureCoord = (activeTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
vNextTextureCoord = (nextTexMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
}