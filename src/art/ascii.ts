import { CanvasTexture, Color, LinearFilter, ShaderMaterial, Vector3 } from 'three'

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
  float unitScale() {
    return (aPart >= 4.0 && aPart < 8.0) ? 1.0 - clamp(uExtract - (aPart - 4.0), 0.0, 1.0) : 1.0;
  }
  mat3 unitSpin() {
    float angle = sin(uTime * 0.31 + aUnitPhase) * uFluidity * uIdle * 0.055;
    float cs = cos(angle);
    float sn = sin(angle);
    return mat3(cs, 0.0, -sn, 0.0, 1.0, 0.0, sn, 0.0, cs);
  }
  vec3 unitPosition(vec3 point, mat3 spin) {
    vec3 drift = vec3(sin(uTime * 0.42 + aUnitPhase), cos(uTime * 0.53 + aUnitPhase), sin(uTime * 0.37 + aUnitPhase));
    vec3 center = aCenter;
    if (uStream > 0.5) {
      center.x = mod(center.x + uTime * uIdle * 2.5 + 11.0, 22.0) - 11.0;
      center.y += sin((center.x + 11.0) / 22.0 * 3.14159265) * uBend;
    }
    return center + spin * (point - aCenter) * unitScale() + drift * uFluidity * uIdle * 0.12;
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
    },
    vertexShader: /* glsl */ `
      ${UNIT_MOTION}
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(unitPosition(position, unitSpin()), 1.0);
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
      uExtract: { value: 0 },
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
      ${UNIT_MOTION}
      uniform float uSize;
      uniform float uPixelRatio;
      uniform float uAssemble;
      uniform float uAccent;
      uniform float uWorkPart;
      uniform float uWorkAccent;
      uniform vec3 uBlue;
      uniform vec3 uKey;
      varying vec3 vColor;
      varying float vGlyph;
      varying float vShade;
      varying float vFacing;
      varying float vUnitScale;
      void main() {
        mat3 spin = unitSpin();
        vec3 p = unitPosition(position + normal * 0.015, spin);
        p += aScatter * (1.0 - uAssemble) * 1.5;
        vec3 n = normalize(normalMatrix * spin * normal);
        vFacing = n.z;
        vUnitScale = unitScale();
        float light = max(0.0, dot(n, uKey));
        vShade = 0.28 + light * 0.72;
        vGlyph = floor(clamp(light * 7.0 + aSeed * 0.9, 0.0, 7.0));
        float work = (abs(aPart - uWorkPart) < 0.1) ? uWorkAccent : 0.0;
        vColor = mix(aColor, uBlue, max(uAccent, work));
        vShade = mix(vShade, max(vShade, 0.5), max(uAccent, work));
        gl_PointSize = max(2.0, uSize * uPixelRatio);
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
