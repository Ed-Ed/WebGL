export const FragmentShaderText = `#version 300 es
    precision mediump float;

    // input from vertex shader
    in vec3 fragPos;
    in vec3 fragNormal;
    in vec2 fragTexCoord;
    in vec3 fragColor;

    // camera attributes
    uniform vec3 cameraPos;

    // light attributes
    uniform vec3 lightPos;
    uniform vec3 lightColor;

    // texture attributes
    uniform bool isTextured;
    uniform sampler2D diffuseTexture;
    uniform sampler2D normalTexture;

    // material properties
    uniform float shininess;

    // output to buffer
    out vec4 fragmentColor;

    void main()
    {
        // normal mapping
        vec3 normal;
        if (isTextured == true) {
            normal = texture(normalTexture, fragTexCoord).rgb;
            normal = normalize(normal * 2.0f - 1.0f);
        } else {
            normal = normalize(fragNormal);
        }

        // ambient
        vec3 Ka = lightColor;

        // diffuse
        vec3 lightDir = normalize(lightPos - fragPos);
        vec3 Kd = Ka * max(dot(normal, lightDir), 0.0f);

        // specular
        vec3 viewDir = normalize(cameraPos - fragPos);
        vec3 reflectDir = reflect(-lightDir, normal);
        vec3 Ks = pow(max(dot(viewDir, reflectDir), 0.0f), shininess) * lightColor;

        // attenuation
        float distance = length(lightPos - fragPos);
        // 1.0f / (light.constant + light.linear * distance + light.quadratic * (distance * distance));
        float attenuation = 1.0f / (1.0f + 0.1f * distance + 0.01f * (distance * distance));
        Ka *= attenuation;
        Kd *= attenuation;
        Ks *= attenuation;

        vec3 result;
        if (isTextured == true) {
            vec3 texture = texture(diffuseTexture, fragTexCoord).rgb;
            result = (Ka + Kd + Ks) * texture;
        } else {
            result = (Ka + Kd + Ks) * fragColor;
        }

        fragmentColor = vec4(result, 1.0);
    }
`;
