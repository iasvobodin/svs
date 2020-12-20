export const vertex = `
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
`

export const fragment = `
#ifdef GL_ES
precision mediump float;
#endif
// get our varyings
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec2 vTextureCoord0;
varying vec2 vTextureCoord1;
varying vec2 vActiveTextureCoord;
varying vec2 vNextTextureCoord;
// the uniform we declared inside our javascript
// uniform float uTime;
uniform float uProgress; 
// our texture sampler (default name, to use a different name please refer to the documentation)
uniform sampler2D uSampler0;
uniform sampler2D uSampler1;
uniform sampler2D activeTex;
uniform sampler2D nextTex;
void main() {
float p = fract(uProgress);

  vec4 image1 = texture2D(activeTex, vActiveTextureCoord - fract(vActiveTextureCoord * vec2(8.,0.)) * p * 0.1);
  vec4 image2 = texture2D(nextTex, vNextTextureCoord - fract(vNextTextureCoord * vec2(8.,0.)) * (1. - p) * 0.1);
  gl_FragColor = mix(image1, image2, p);

}
`
