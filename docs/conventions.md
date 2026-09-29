# Asset, SVG, shader, and procedural conventions

Most visuals in this show will be made by AI agents. So the conventions prefer formats an agent can write and edit as code: SVG, GLSL, and TypeScript. Blender, After Effects, and Figma are allowed but never required.

## Text and languages

The keynote runs in English and Spanish. The presenter switches with `L` at any time. The playhead does not move, and no scene remounts.

- Every visible string lives in `src/i18n/locales/en.json` and `es.json`, under a flat key such as `intro.title`. English is the source of the keys.
- Render text with `<T k="intro.title" />`. For attributes, use `const t = useT()` and `t('intro.title')`. Placeholders work: `t('stats.runs', { count: 723 })` fills `{count}`.
- Never write visible text in JSX.
- **Both languages must take the same space.** Layouts break on long strings. `npm run i18n:check` compares the character count of every key. A translation more than 15% longer or shorter than the English text fails the check (short strings get 4 characters of slack). The check runs before every build. Fix a failure by rewriting one of the two strings, not by making the box bigger. A key can go on the allow list in `scripts/check-i18n.mjs` only with a written reason.
- Put text in boxes with a fixed size in `su` units, and mark the box with `data-fit="name"`. The debug panel lists every `data-fit` box whose text overflows in the current language, and outlines it.
- A GSAP timeline that splits text into lines or characters must rebuild when the language changes. Pass the locale in its dependencies: `useSceneTimeline(build, [locale])`, with `const { locale } = useI18n()`.
- The locale comes from `?lang=es` or `?lang=en`, then the last choice, then English.

## Assets

Files live in `public/assets/<kind>/`:

| Folder | Contents |
|---|---|
| `svg/` | SVG files that are too large to keep inline |
| `textures/` | textures for Three.js. Prefer `.webp`, or `.ktx2` for large ones |
| `models/` | `.glb` models. Compress them with Draco or Meshopt |
| `fonts/` | self-hosted fonts, `.woff2` only |
| `images/` | photos and bitmaps for DOM |
| `video/` | video, only when nothing else works. Video must have no audio track |
| `generated/` | AI-generated artwork. Keep the prompt next to the file as `<name>.prompt.md` |

There is no audio folder, loader, or asset type. The show is silent.

Use the helpers in `src/assets/`:

- `asset('models', 'thing.glb')` builds the URL.
- `useModel(url)` and `useColorTexture(url)` load and cache. They suspend, so wrap the part in `<Suspense fallback={null}>`.
- `preload.model(url)`, `preload.texture(url)`, and `preload.image(url)` start a download early. Call them at module level in the scene file, or in the previous scene's `onEnter`.

Memory rules:

- R3F disposes objects that you write as JSX.
- If you make a geometry, material, or texture with `new`, dispose it on unmount. `disposeObject(root)` frees everything under an object.
- Do not dispose loader results (`useModel`, `useColorTexture`). They are cached and shared. Clone them before you change them.
- Reuse one geometry for many objects. For more than about 50 copies, use `InstancedMesh`.

## SVG

Write SVG inline in the scene, as JSX, inside the `<Svg>` wrapper:

```tsx
<Svg title="Three steps in a row">
  <path data-anim="line" d="M200 450 L1400 450" />
  <circle data-anim="dot" cx="200" cy="450" r="12" />
</Svg>
```

- The default viewBox is `0 0 1600 900`, which is 16:9 in design units. Draw in these units.
- Name each part you animate with `data-anim="name"`. Find it with `svgPart(root, 'name')`, or all matches with `svgParts`. `svgPart` throws on a typo.
- Strokes do not scale with the SVG by default. Set `scaleStroke` to change that.
- Give a `title` for screen readers, or set `decorative`.
- Stroke drawing: `tl.fromTo(path, draw.from, draw.to(0.4), 0.1)` draws the path from local 0.1 to 0.5.
- Morphing: `tl.to(path, morphTo(otherPathData, 0.4), 0.5)`. MorphSVG handles paths with different point counts.
- Gradients, filters, masks, clipping, and markers go in `<defs>` inside the same `<Svg>`. Give each id a scene prefix (`intro-glow`), because all mounted scenes share one document.
- For SVG that an agent makes from data, write a small TypeScript function that returns path data. Keep the numbers in the scene folder.

## Shaders

- Put GLSL in `.glsl` files. A shader for one scene lives in that scene's folder. Shared GLSL lives in `src/shaders/`.
- Import GLSL as a string: `import frag from './x.frag.glsl?raw'`.
- Make the material with `createProgressMaterial({ vertexShader, fragmentShader, uniforms })`.
- Prepend `STANDARD_UNIFORMS_GLSL` to the fragment shader. It declares the standard uniforms.
- Call `useStandardUniforms(material)` in the world part. It updates the standard uniforms every frame and disposes the material on unmount.

| Uniform | Type | Meaning |
|---|---|---|
| `uTime` | float | seconds since start. Ambient motion only |
| `uProgress` | float | local scene progress, 0..1 |
| `uGlobal` | float | show progress, 0..1 |
| `uResolution` | vec2 | drawing buffer size in pixels |
| `uPixelRatio` | float | renderer pixel ratio |
| `uPointer` | vec2 | pointer in normalized device coordinates, -1..1 |

Add your own uniforms with a `u` prefix. Tween them in the scene timeline: `tl.to(material.uniforms.uReveal, { value: 1, duration: 0.5 }, 0.2)`. When a timeline drives `uProgress` itself, call `useStandardUniforms(material, { progress: false })`.

## Procedural visuals

A procedural system turns a few named parameters into a visual. Scenes change the parameters. They never change the internals.

Every system follows this shape (see `src/procedural/instancedGrid.ts`):

```ts
const system = createThing({ density: 0.5, chaos: 0 })
system.object        // a Three.js object to add to the scene
system.set({ chaos: 0.8 })  // cheap, safe to call every frame
system.dispose()     // frees GPU memory
```

- Name parameters by meaning: `density`, `chaos`, `activity`, `spread`. Not `particleCount2`.
- The output must be a pure function of the parameters. Use a seeded hash, not `Math.random()`, so a seek shows the same picture.
- `set()` must skip work when nothing changed.
- Use `useProcedural(() => createThing(...))` in a world part. It creates the system once and disposes it on unmount.
- Drive parameters with `useProgress` or a scene timeline.
- For 2D procedural drawing, put `<FxCanvas draw={fn} />` in the scene's `fx` part. `draw(ctx, size, local)` must be a pure function of its arguments.
