# Concept renders

All images in `public/images/` are **original procedural concept visualizations**
generated with Blender (Cycles) from primitives and procedural shaders. These are
not photographs and not homes anyone has built. No third-party photos or textures
are used.

## Files

- `common.py`: scene setup, sky and lights, procedural materials (stucco, oak, stone,
  travertine, glass, foliage), geometry helpers, and the shot registry
- `houses.py`: house builders (California contemporary, hillside, modern farmhouse, Mediterranean)
- `scenes.py`: exterior shots plus the CLI
- `interiors.py`: living room, kitchens, office, primary suite
- `studies.py`: material close-up, study models, timber frame
- `run_all.sh`: renders every shot in order

## Regenerate

You need a Python that has the `bpy` module (`pip install bpy`, which requires Python 3.11) and Pillow.

```bash
python3.11 -m venv .bvenv && .bvenv/bin/pip install bpy pillow
BLENDER_PY=.bvenv/bin/python ./run_all.sh                          # final quality
RENDER_SCALE=0.5 RENDER_SAMPLES=28 BLENDER_PY=.bvenv/bin/python ./run_all.sh   # fast draft
.bvenv/bin/python scenes.py hero sierra-1                          # selected shots
.bvenv/bin/python scenes.py --preview hero                         # half-res check -> preview_hero.jpg
```

`og.jpg` (1200×630) is cropped automatically from `hero.jpg`. Set `RENDER_OUT` to
send the output to another directory.

The images currently committed are fast drafts: half resolution, 28 samples,
denoised, then upscaled. For sharper images, rerun at full quality: about 2–10 minutes per shot on 4 CPU cores.
