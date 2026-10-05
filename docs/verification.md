The browser review on 2026-10-05 covered all 31 stops in English and Spanish at 1280 by 720 pixels.
The visible text had no overflow, viewport clipping, or text overlaps.
The normal motion pass also covered handoffs and reverse navigation. Both browser tabs reported no runtime errors.

Two screenshots at the same stop differed with normal motion and matched exactly with reduced motion.
After two round trips through the show, the reduced motion renderer retained 80 geometries, 54 textures, and two shader programs.
Normal motion adds one depth geometry when the Issue first travels between assemblies. The settled browser view reached 60 frames per second.

The raw observations are in `artifacts/rebuild/layout-checks.json` and `artifacts/motion/layouts.json`.
Draft 6 repeats the full language review in `artifacts/rebuild/product-close-checks.json` after the phase and closing text changes.
The screenshots show the Spanish cover and the complete system. These checks cover this desktop viewport, not every device or projector.
The required type, lint, language, and production build commands pass.
