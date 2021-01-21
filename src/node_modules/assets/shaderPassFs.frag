precision mediump float;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
uniform sampler2D uRenderTexture;
uniform float uDisplacement;
void main( void ) {
    vec2 textureCoords = vTextureCoord;
        textureCoords.y += sin(textureCoords.x  * 3.141592) * uDisplacement/5.;
            gl_FragColor = texture2D(uRenderTexture, textureCoords);
}