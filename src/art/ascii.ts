import { CanvasTexture, Color, LinearFilter, ShaderMaterial, Vector2, Vector3 } from 'three'

/** Each unit moves as one body. Its marks and depth surface share this motion. */
const UNIT_MOTION = /* glsl */ `
  attribute vec3 aCenter;
  attribute float aUnitPhase;
  attribute float aPart;
  uniform float uTime;
  uniform float uFluidity;
  uniform float uIdle;
  uniform float uStream;
  uniform float uBend;
  uniform float uExtract;
  uniform float uDrift;
  uniform float uStretch;
  // Other builds per unit (src/art/forms.ts, option morph). Forms without them keep uMorph and uMorph2 at 0.
  attribute vec3 aMorphCenter;
  attribute vec3 aMorph2Center;
  uniform float uMorph;
  uniform float uMorph2;
  float unitScale() {
    return (aPart >= 4.0 && aPart < 8.0) ? 1.0 - clamp(uExtract - (aPart - 4.0), 0.0, 1.0) : 1.0;
  }
  mat3 unitSpin() {
    float angle = sin(uTime * 0.31 + aUnitPhase) * uFluidity * uIdle * 0.055;
    float cs = cos(angle);
    float sn = sin(angle);
    return mat3(cs, 0.0, -sn, 0.0, 1.0, 0.0, sn, 0.0, cs);
  }
  // Units leave one by one: each starts later than the one before, and all arrive by a weight of 1.
  float unitMorph(float weight) {
    if (weight <= 0.0) return 0.0;
    float lag = fract(aUnitPhase * 0.618) * 0.5;
    float m = clamp(weight * 1.5 - lag, 0.0, 1.0);
    return m * m * (3.0 - 2.0 * m);
  }
  vec3 unitPosition(vec3 point, vec3 morphPoint, vec3 morph2Point, mat3 spin) {
    float m1 = unitMorph(uMorph);
    float m2 = unitMorph(uMorph2);
    vec3 home = aCenter + (aMorphCenter - aCenter) * m1 + (aMorph2Center - aCenter) * m2;
    // On the way, a unit lifts out of the mass, so the change reads as taking apart and building again.
    vec3 lift = normalize(aCenter + vec3(1e-4)) * (sin(m1 * 3.14159265) + sin(m2 * 3.14159265)) * 2.4;
    point = point + (morphPoint - point) * m1 + (morph2Point - point) * m2 - home + aCenter;
    vec3 drift = vec3(sin(uTime * 0.42 + aUnitPhase), cos(uTime * 0.53 + aUnitPhase), sin(uTime * 0.37 + aUnitPhase));
    // Fluid units also breathe in and out of the mass.
    vec3 radial = normalize(aCenter + vec3(1e-4)) * sin(uTime * 0.45 + aUnitPhase * 1.7) * 1.2;
    vec3 center = aCenter;
    if (uStream > 0.5) {
      center.x = mod(center.x + uTime * uIdle * 2.5 + 11.0, 22.0) - 11.0;
      center.y += sin((center.x + 11.0) / 22.0 * 3.14159265) * uBend;
    }
    vec3 offset = spin * (point - aCenter) * unitScale();
    // A channel is scaled along x to its length. This keeps each bead its own size.
    offset.x /= max(uStretch, 0.001);
    return center + offset + (home - aCenter) + lift + (drift + radial) * uFluidity * uIdle * uDrift;
  }
`

/** Hide marks behind a nearer face without drawing a visible mesh. */
export function createAsciiDepthMaterial(surface: ShaderMaterial): ShaderMaterial {
  return new ShaderMaterial({
    colorWrite: false,
    depthWrite: true,
    uniforms: {
      uTime: surface.uniforms.uTime!,
      uFluidity: surface.uniforms.uFluidity!,
      uIdle: surface.uniforms.uIdle!,
      uStream: surface.uniforms.uStream!,
      uBend: surface.uniforms.uBend!,
      uExtract: surface.uniforms.uExtract!,
      uDrift: surface.uniforms.uDrift!,
      uStretch: surface.uniforms.uStretch!,
      uMorph: surface.uniforms.uMorph!,
      uMorph2: surface.uniforms.uMorph2!,
    },
    vertexShader: /* glsl */ `
      attribute vec3 aMorphPosition;
      attribute vec3 aMorph2Position;
      ${UNIT_MOTION}
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(unitPosition(position, aMorphPosition, aMorph2Position, unitSpin()), 1.0);
      }
    `,
    fragmentShader: /* glsl */ `void main() { gl_FragColor = vec4(0.0); }`,
  })
}

/** Screen-facing character marks. Geometry and progress supply the volume. */
export function createAsciiMaterial(size = 6.2): ShaderMaterial {
  const canvas = document.createElement('canvas')
  const cell = 64
  const glyphs = ['.', ':', '-', '+', 'x', '*', '#', '@']
  canvas.width = cell * glyphs.length
  canvas.height = cell
  const ctx = canvas.getContext('2d')!
  ctx.font = '600 46px "JetBrains Mono Variable"'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffffff'
  glyphs.forEach((glyph, i) => ctx.fillText(glyph, cell * (i + 0.5), cell * 0.48))
  const atlas = new CanvasTexture(canvas)
  atlas.minFilter = LinearFilter
  atlas.magFilter = LinearFilter
  atlas.generateMipmaps = false

  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: true,
    uniforms: {
      uAtlas: { value: atlas },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
      uTime: { value: 0 },
      uFluidity: { value: 0 },
      uIdle: { value: 0 },
      uStream: { value: 0 },
      uBend: { value: 0 },
      uWorkPart: { value: -1 },
      uWorkAccent: { value: 0 },
      uMarkParts: { value: new Vector2(-1, -1) },
      uMarks: { value: 0 },
      uExtract: { value: 0 },
      uDrift: { value: 0.12 },
      uStretch: { value: 1 },
      uMorph: { value: 0 },
      uMorph2: { value: 0 },
      uAssemble: { value: 1 },
      uOpacity: { value: 1 },
      uAccent: { value: 0 },
      uBlue: { value: new Color('#2F69FF') },
      uKey: { value: new Vector3(-0.45, 0.7, 1.0).normalize() },
    },
    vertexShader: /* glsl */ `
      attribute float aSeed;
      attribute vec3 aColor;
      attribute vec3 aScatter;
      attribute float aEdge;
      attribute vec3 aMorphPosition;
      attribute vec3 aMorphNormal;
      attribute vec3 aMorph2Position;
      attribute vec3 aMorph2Normal;
      ${UNIT_MOTION}
      uniform float uSize;
      uniform float uPixelRatio;
      uniform float uAssemble;
      uniform float uAccent;
      uniform float uWorkPart;
      uniform float uWorkAccent;
      uniform vec2 uMarkParts;
      uniform float uMarks;
      uniform vec3 uBlue;
      uniform vec3 uKey;
      varying vec3 vColor;
      varying float vGlyph;
      varying float vShade;
      varying float vFacing;
      varying float vUnitScale;
      void main() {
        mat3 spin = unitSpin();
        vec3 p = unitPosition(position + normal * 0.015, aMorphPosition + aMorphNormal * 0.015, aMorph2Position + aMorph2Normal * 0.015, spin);
        float formed = clamp((uAssemble - 0.3 * (1.0 - aEdge)) / 0.7, 0.0, 1.0);
        formed = formed * formed * (3.0 - 2.0 * formed);
        p += aScatter * (1.0 - formed) * 1.5;
        vec3 built = normal + (aMorphNormal - normal) * unitMorph(uMorph) + (aMorph2Normal - normal) * unitMorph(uMorph2);
        vec3 n = normalize(normalMatrix * spin * normalize(built + vec3(1e-4)));
        vFacing = n.z;
        vUnitScale = unitScale();
        float light = max(0.0, dot(n, uKey));
        vShade = 0.28 + light * 0.72;
        vGlyph = floor(clamp(light * 7.0 + aSeed * 0.9, 0.0, 7.0));
        float work = (abs(aPart - uWorkPart) < 0.1) ? uWorkAccent : 0.0;
        // Up to two more units of the body in the same blue, without the Issue's denser mark.
        float mark = (abs(aPart - uMarkParts.x) < 0.1 || abs(aPart - uMarkParts.y) < 0.1) ? uMarks : 0.0;
        float hot = max(uAccent, max(work, mark));
        vColor = mix(aColor, uBlue, hot);
        // The blue stays bright on its shadow side, so it never darkens to navy.
        vShade = mix(vShade, max(vShade, 0.85), hot);
        // The docked Issue uses the densest mark and a larger point. It reads as one solid blue unit.
        vGlyph = mix(vGlyph, 6.0, step(0.5, work));
        gl_PointSize = max(2.0, uSize * uPixelRatio * (1.0 + 0.3 * work));
        gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      uniform float uOpacity;
      varying vec3 vColor;
      varying float vGlyph;
      varying float vShade;
      varying float vFacing;
      varying float vUnitScale;
      void main() {
        vec2 uv = vec2((vGlyph + gl_PointCoord.x) / 8.0, 1.0 - gl_PointCoord.y);
        float ink = texture2D(uAtlas, uv).a;
        if (ink < 0.2 || uOpacity < 0.01 || vFacing < 0.0 || vUnitScale < 0.01) discard;
        gl_FragColor = vec4(vColor * vShade, ink * uOpacity);
        #include <colorspace_fragment>
      }
    `,
  })
  material.userData.glyphSize = size
  material.addEventListener('dispose', () => atlas.dispose())
  return material
}
