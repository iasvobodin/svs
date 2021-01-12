#ifdef GL_ES
precision mediump float;
#endif

varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform sampler2D uSampler0;
uniform float uOpacityTitle;
void main() {
    vec4 tex1 = texture2D(uSampler0, vTextureCoord);
    gl_FragColor = mix( vec4(0.,0.,0.,1.), tex1, uOpacityTitle);
}