/**
 * ShaderMaterial with the standard uniforms every shader in this project gets.
 * Update them with useStandardUniforms(material) inside a world part.
 *
 * Standard uniforms:
 *   uTime       seconds since start. Ambient motion only.
 *   uProgress   local scene progress, 0..1. Drives the composition.
 *   uGlobal     global show progress, 0..1.
 *   uResolution drawing buffer size in pixels.
 *   uPixelRatio current renderer pixel ratio.
 *   uPointer    pointer in normalized device coordinates, -1..1.
 */
import { ShaderMaterial, Vector2, type IUniform, type ShaderMaterialParameters } from 'three'

export interface StandardUniforms {
  uTime: IUniform<number>
  uProgress: IUniform<number>
  uGlobal: IUniform<number>
  uResolution: IUniform<Vector2>
  uPixelRatio: IUniform<number>
  uPointer: IUniform<Vector2>
}

export type ProgressMaterial<U extends Record<string, IUniform> = Record<string, IUniform>> = ShaderMaterial & {
  uniforms: StandardUniforms & U
}

export function createProgressMaterial<U extends Record<string, IUniform>>(
  params: Omit<ShaderMaterialParameters, 'uniforms'> & { uniforms?: U },
): ProgressMaterial<U> {
  const { uniforms, ...rest } = params
  const standard: StandardUniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uGlobal: { value: 0 },
    uResolution: { value: new Vector2(1, 1) },
    uPixelRatio: { value: 1 },
    uPointer: { value: new Vector2() },
  }
  return new ShaderMaterial({ ...rest, uniforms: { ...standard, ...uniforms } }) as ProgressMaterial<U>
}

/** GLSL declarations for the standard uniforms. Prepend it to fragment shaders. */
export const STANDARD_UNIFORMS_GLSL = /* glsl */ `
uniform float uTime;
uniform float uProgress;
uniform float uGlobal;
uniform vec2 uResolution;
uniform float uPixelRatio;
uniform vec2 uPointer;
`
