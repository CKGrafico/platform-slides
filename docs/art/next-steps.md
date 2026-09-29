# Next technical steps for the art

The style frame (the cover and part 10) is built on the art kit in `src/art/`. These are the next pieces of the kit, from the technical review of 2026-09-29. Build them before or while building the other parts.

## Done in the style frame

- Toon and line materials without tone mapping, and lights calibrated so the light band shows the palette color (ambient + key = pi).
- Grain on its own layer, blended with `soft-light`, so it adds texture without a grey veil.
- Screen anchors that update the camera matrices first and write only when a value changes.
- The entrance hides with `inner.visible`, so "outline first, then fill" is on screen, and from-values never render at build time.
- One flat master timeline for all choreographies, so start values chain in time order.
- Bounded ambient motion: a few degrees of sway; the cover orbit of the blue ball closes during the first move.
- Reduced motion freezes time and the boil. The low tier turns the boil off.
- Shader warm-up before the talk (`compileAsync`), shown in the debug panel.
- The title burn in 16 steps.

## To build next

1. **Routes.** A route system that owns `object.position` for bound actors, made of pure path segments (`orbitArc`, `arc`, `capture`, `spiral`, `escape`, `wobbly`, `park`, `cameraPin`), with a check that segments meet. Part 10 moves its proxy tweens to routes. Part 13 (the blue ball's journey) needs it.
2. **Swarms.** Instanced balls and moons on routes, for events and work items in bulk, with per-instance inking. Use a swarm for more than 8 copies of one element.
3. **Camera from choreographies.** `camera.hold`, `move` (arcs, FOV kick, distance in log space), `cut`, `matchCut`, and `follow`, composed into one track. A part must never import another part's shot.
4. **Choreography context.** `rest` on actors for initial states, `t.beat(sceneKey, n)` computed from the model, `claim()` so writers outside GSAP are checked, and the checks for writes outside a part's chapter and for jumps in value.
5. **Cold open.** At position 0: the void, then the core alone, then (after warm-up) the blue ball inks in and the title burns in, once. Reduced motion or a restored hash skips it.
6. **Kit additions.** Sketch lines (frame, slots, hollow columns, trails), capsule, disc with grid, wall, column, blob shadows under elements, and dust for exits.
7. **Burn.** Replace `feTurbulence` with `feImage` of a seeded tile. At most 2 burns at once, never during camera travel.

## Budgets (laptop GPU, 1080p, DPR at most 1.5)

| Item | Budget |
|---|---|
| Frame | GPU 8 ms, CPU 6 ms, p95 16.7 ms |
| Draw calls | 120. Each element costs 2 |
| Triangles | 250k |
| Shader programs | 16, none compiled after warm-up |
| Anchored labels | 20 |
| Burns at once | 2 |
