// precision mediump float;
    
//         varying vec3 vVertexPosition;
//         varying vec2 vTextureCoord;
    
//         uniform sampler2D uRenderTexture;
//          uniform sampler2D displacementTexture;
    
//         uniform float uScrollEffect;
    
//         void main() {
//             vec2 textureCoords = vTextureCoord;
    
//             vec2 redTextCoords = vec2(vTextureCoord.x- uScrollEffect / 50000.0, vTextureCoord.y );
//             vec2 greenTextCoords = vec2(vTextureCoord.x ,vTextureCoord.y  + uScrollEffect / 60000.0 );
//             vec2 blueTextCoords = vec2(vTextureCoord.x - uScrollEffect / 65000.0, vTextureCoord.y );
    
//             vec4 red = texture2D(uRenderTexture, redTextCoords);
//             vec4 green = texture2D(uRenderTexture, greenTextCoords);
//             vec4 blue = texture2D(uRenderTexture, blueTextCoords);
    
//             vec4 finalColor = vec4(red.r, green.g, blue.b, min(1.0, red.a + blue.a + green.a));
//             gl_FragColor = finalColor;

//             //  vec2 textureCoords = vTextureCoord;
//             vec4 displacement = texture2D(displacementTexture, textureCoords);
    
//             // displace along Y axis
//              textureCoords.x -= (sin(displacement.r) / 5.0) * uScrollEffect;
//              textureCoords.y -= (sin(displacement.r) / 5.0) * uScrollEffect;
            
//             gl_FragColor = texture2D(uRenderTexture, textureCoords);
             
//             // gl_FragColor = texture2D (uRenderTexture , vec2(textureCoords.x/(1.+ abs(uScrollEffect)/ 3000. ),textureCoords.y)) ;
//         }

        precision mediump float;

        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;

        uniform sampler2D uRenderTexture;
        uniform sampler2D displacementTexture;

        uniform float uScrollEffect;

        void main( void ) {
            vec2 textureCoords = vTextureCoord;
            // vec4 displacement = texture2D(displacementTexture, textureCoords);

            // // displace along Y axis
            // textureCoords.x -= (sin(displacement.r) / 5.0) * uScrollEffect;
            //  textureCoords.y -= (sin(displacement.r) / 5.0) * uScrollEffect;

            gl_FragColor = texture2D(uRenderTexture, textureCoords);
        } 