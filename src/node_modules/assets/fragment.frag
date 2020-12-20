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

  vec4 image1 = texture2D(activeTex, vActiveTextureCoord - fract(vActiveTextureCoord * vec2(11.,0.)) * p * 0.1);
  vec4 image2 = texture2D(nextTex, vNextTextureCoord - fract(vNextTextureCoord * vec2(11.,0.)) * (1. - p) * 0.1);
  gl_FragColor = mix(image1, image2, p);
}