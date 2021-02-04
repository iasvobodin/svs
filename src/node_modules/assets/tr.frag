precision mediump float;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform vec3 uColor;
uniform float uTRprogress;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
	return 1.-smoothstep(_radius-(_radius*0.01),
                         _radius+(_radius*0.01),
                         dot(dist,dist)*4.0);
}

void main() {
    vec2 textureCoord = vTextureCoord;
    vec3 color = vec3(circle(vec2(vVertexPosition.x*2., vVertexPosition.y),0.9));
    gl_FragColor = vec4(uColor,1.);
}