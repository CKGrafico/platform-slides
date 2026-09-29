/**
 * The monolith material: the model. Off-black, with slow noise that seems to sit
 * deep inside the slab, as if you look into it. Three noise layers are sampled
 * along the view ray at growing depth, so the inside moves with parallax.
 *
 * It is the only material in the show that moves by time (uTime). That is on
 * purpose: the model is the only non-deterministic thing on screen.
 */
import { Color, ShaderMaterial } from 'three'
import { artUniforms } from './clock'
import { palette } from './palette'

const vertexShader = /* glsl */ `
varying vec3 vWorld;
varying vec3 vNormalW;
void main() {
  vec4 world = modelMatrix * vec4(position, 1.0);
  vWorld = world.xyz;
  vNormalW = normalize(mat3(modelMatrix) * normal);
  gl_Position = projectionMatrix * viewMatrix * world;
}
`

const fragmentShader = /* glsl */ `
uniform float uTime;
uniform float uCalm;
uniform vec3 uBase;
uniform vec3 uNoise;
uniform vec3 uLight;
varying vec3 vWorld;
varying vec3 vNormalW;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z);
}

float fbm(vec3 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p = p * 2.03 + 11.7;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 viewDir = normalize(vWorld - cameraPosition);
  // uCalm = 1 slows the inside down, for the moments where the agent behaves.
  float t = uTime * mix(0.09, 0.03, uCalm);
  float acc = 0.0;
  for (int i = 0; i < 3; i++) {
    float depth = 0.35 + float(i) * 0.55;
    vec3 p = (vWorld + viewDir * depth) * 1.35 + vec3(0.0, t * (1.0 + float(i) * 0.4), t * 0.6);
    acc += fbm(p) * (1.0 - float(i) * 0.28);
  }
  float m = smoothstep(0.45, 1.05, acc);
  vec3 col = mix(uBase, uNoise, m);
  // A very faint toon band, so the slab still reads as a solid object.
  float lit = step(0.35, dot(normalize(vNormalW), normalize(uLight)));
  col *= mix(0.86, 1.0, lit);
  gl_FragColor = vec4(col, 1.0);
  #include <colorspace_fragment>
}
`

export type MonolithMaterial = ShaderMaterial & {
  uniforms: { uCalm: { value: number } }
}

export function createMonolithMaterial(): MonolithMaterial {
  return new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime: artUniforms.uTime,
      uCalm: { value: 0 },
      uBase: { value: new Color(palette.monolith) },
      uNoise: { value: new Color(palette.monolithNoise) },
      uLight: { value: [-0.5, 0.8, 0.6] },
    },
  }) as MonolithMaterial
}
