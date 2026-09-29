// Neutral test pattern: a ring whose radius follows uProgress.
varying vec2 vUv;

void main() {
  vec2 p = vUv - 0.5;
  float d = length(p);
  float radius = mix(0.05, 0.45, uProgress);
  float ring = smoothstep(0.012, 0.0, abs(d - radius));
  float shimmer = 0.04 * sin(uTime * 1.5 + d * 40.0);
  vec3 color = vec3(0.12) + vec3(0.8) * ring + shimmer;
  gl_FragColor = vec4(color, 1.0);
}
