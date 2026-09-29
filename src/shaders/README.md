# Shaders

This folder holds shared GLSL and the material helpers. A shader that only one scene uses stays in that scene's folder.

1. Write GLSL in a `.glsl` file. Import it as a string with `import frag from './x.frag.glsl?raw'`.
2. Make the material with `createProgressMaterial({ vertexShader, fragmentShader, uniforms })`.
3. In the world part, call `useStandardUniforms(material)`. It updates `uTime`, `uProgress`, `uGlobal`, `uResolution`, `uPixelRatio`, and `uPointer` on each frame.
4. Drive the composition from `uProgress`. Use `uTime` only for ambient motion, so a seek gives the same picture.

See `docs/conventions.md` for the full rules.
