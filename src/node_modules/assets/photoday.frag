precision mediump float;
varying vec3 vVertexPosition;
varying vec2 vTextureCoord;
varying vec3 vOriginalVertexPosition;
uniform sampler2D planeTexture;

vec3 getNormal(vec3 pos, vec3 originalPos) {
    float diff = 0.2;
    vec3 neighbour1 = vec3(originalPos.x + diff, originalPos.y, originalPos.z);
    vec3 neighbour2 = vec3(originalPos.x, pos.y + diff, originalPos.z);
    vec3 tangent = (neighbour1 - pos);
    vec3 bitangent = (neighbour2 - pos);
    return normalize(cross(tangent, bitangent));
}

void main() {
    vec4 finalColor = texture2D(planeTexture, vTextureCoord);
    vec3 normal = getNormal(vVertexPosition, vOriginalVertexPosition);

    vec3 lightPos = normalize(vec3(0.4, 0.4, 1.0));
    float light = smoothstep(0.45, 1.0, dot(normal, lightPos));

    float lightStrength = 0.35;
    float ambientLight = 1.0 - lightStrength;
    finalColor.rgb = finalColor.rgb * light * lightStrength + finalColor.rgb * ambientLight;

    finalColor = vec4(finalColor.rgb * finalColor.a, finalColor.a);
    gl_FragColor = finalColor;
}