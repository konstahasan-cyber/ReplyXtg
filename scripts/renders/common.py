"""Shared helpers for Aurelia Grove procedural concept renders (Blender / bpy 5.x).

Everything here is generated from primitives and procedural shaders: no photos,
no third-party textures. Output images are concept visualizations only.
"""
import math
import os
import random
import tempfile

import bpy
from mathutils import Vector

OUT_DIR = os.environ.get(
    "RENDER_OUT",
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "images")),
)


# --------------------------------------------------------------------------- scene

def reset(seed=7):
    random.seed(seed)
    bpy.ops.wm.read_factory_settings(use_empty=True)
    _mats.clear()
    _texcache.clear()
    s = bpy.context.scene
    s.render.engine = "CYCLES"
    s.cycles.device = "CPU"
    s.cycles.use_denoising = True
    try:
        s.cycles.denoiser = "OPENIMAGEDENOISE"
    except TypeError:
        pass
    s.cycles.max_bounces = 6
    s.cycles.diffuse_bounces = 3
    s.cycles.glossy_bounces = 3
    s.cycles.transmission_bounces = 6
    s.cycles.transparent_max_bounces = 8
    s.cycles.caustics_reflective = False
    s.cycles.caustics_refractive = False
    s.cycles.blur_glossy = 1.0
    s.cycles.sample_clamp_indirect = 8.0
    s.render.film_transparent = False
    for vt, look in (("AgX", "AgX - Medium High Contrast"), ("Filmic", "Filmic - Medium High Contrast")):
        try:
            s.view_settings.view_transform = vt
            try:
                s.view_settings.look = look
            except TypeError:
                pass
            break
        except TypeError:
            continue
    s.view_settings.exposure = 0.0
    return s


def world_sky(elevation=12, rotation=210, strength=1.0, sun_disc=False, air=1.0, aerosol=1.2):
    s = bpy.context.scene
    w = bpy.data.worlds.new("World")
    s.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    sky = nt.nodes.new("ShaderNodeTexSky")
    for t in ("MULTIPLE_SCATTERING", "SINGLE_SCATTERING", "NISHITA"):
        try:
            sky.sky_type = t
            break
        except TypeError:
            continue
    sky.sun_disc = sun_disc
    if sun_disc:
        sky.sun_size = math.radians(1.2)
    sky.sun_elevation = math.radians(elevation)
    sky.sun_rotation = math.radians(rotation)
    sky.air_density = air
    sky.aerosol_density = aerosol
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(sky.outputs["Color"], bg.inputs["Color"])
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])
    return sky


def world_gradient(top=(0.05, 0.07, 0.12), bottom=(0.35, 0.25, 0.22), strength=1.0):
    """Simple vertical gradient world, for dusk or studio."""
    s = bpy.context.scene
    w = bpy.data.worlds.new("World")
    s.world = w
    w.use_nodes = True
    nt = w.node_tree
    nt.nodes.clear()
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = -0.05
    mr.inputs["From Max"].default_value = 0.6
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*bottom, 1)
    ramp.color_ramp.elements[1].color = (*top, 1)
    bg = nt.nodes.new("ShaderNodeBackground")
    bg.inputs["Strength"].default_value = strength
    out = nt.nodes.new("ShaderNodeOutputWorld")
    nt.links.new(tc.outputs["Generated"], sep.inputs[0])
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], bg.inputs["Color"])
    nt.links.new(bg.outputs["Background"], out.inputs["Surface"])


def sun(elevation=12, rotation=210, strength=4.0, color=(1.0, 0.86, 0.68), angle=1.5):
    d = bpy.data.lights.new("Sun", "SUN")
    d.energy = strength
    d.color = color
    d.angle = math.radians(angle)
    o = bpy.data.objects.new("Sun", d)
    bpy.context.collection.objects.link(o)
    # Blender sky: rotation measured from +Y? Align sun so it matches sky direction.
    el = math.radians(elevation)
    rot = math.radians(rotation)
    # matches the sky texture convention: rotation 0 puts the sun toward +Y, CCW positive
    direction = Vector((-math.sin(rot) * math.cos(el), math.cos(rot) * math.cos(el), math.sin(el)))
    o.rotation_euler = (-direction).to_track_quat("-Z", "Y").to_euler()
    return o


def area_light(loc, target, size=4, energy=500, color=(1, 0.9, 0.8), shape="RECTANGLE", size_y=None):
    d = bpy.data.lights.new("Area", "AREA")
    d.energy = energy
    d.color = color
    d.shape = shape
    d.size = size
    if size_y:
        d.size_y = size_y
    o = bpy.data.objects.new("Area", d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    look_at(o, target)
    return o


def point_light(loc, energy=60, color=(1, 0.75, 0.5), radius=0.1):
    d = bpy.data.lights.new("Pt", "POINT")
    d.energy = energy
    d.color = color
    d.shadow_soft_size = radius
    o = bpy.data.objects.new("Pt", d)
    bpy.context.collection.objects.link(o)
    o.location = loc
    return o


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def camera(loc, target, lens=30, shift_x=0.0, shift_y=0.0, dof=None, fstop=4.0):
    c = bpy.data.cameras.new("Cam")
    c.lens = lens
    c.shift_x = shift_x
    c.shift_y = shift_y
    c.clip_start = 0.05
    c.clip_end = 3000
    if dof:
        c.dof.use_dof = True
        c.dof.focus_distance = dof
        c.dof.aperture_fstop = fstop
    o = bpy.data.objects.new("Cam", c)
    bpy.context.collection.objects.link(o)
    o.location = loc
    look_at(o, target)
    bpy.context.scene.camera = o
    return o


def render(name, w, h, samples=64, scale=1.0, quality=82):
    from PIL import Image

    s = bpy.context.scene
    s.cycles.samples = samples
    s.render.resolution_x = int(w * scale)
    s.render.resolution_y = int(h * scale)
    s.render.resolution_percentage = 100
    s.render.image_settings.file_format = "PNG"
    s.render.image_settings.color_depth = "8"
    tmp = os.path.join(tempfile.gettempdir(), f"ag_{name}.png")
    s.render.filepath = tmp
    bpy.ops.render.render(write_still=True)
    os.makedirs(OUT_DIR, exist_ok=True)
    im = Image.open(tmp).convert("RGB")
    if im.size != (w, h):
        im = im.resize((w, h), Image.LANCZOS)
    out = os.path.join(OUT_DIR, f"{name}.jpg")
    im.save(out, "JPEG", quality=quality, optimize=True, progressive=True)
    print("WROTE", out, os.path.getsize(out) // 1024, "KB")
    if name == "hero":
        # Open Graph image: 1200x630 crop weighted toward the house
        og = im.resize((1200, int(1200 * h / w)), Image.LANCZOS)
        top = max(0, (og.height - 630) // 2 + 10)
        og = og.crop((0, top, 1200, top + 630))
        og.save(os.path.join(OUT_DIR, "og.jpg"), "JPEG", quality=84, optimize=True, progressive=True)
    return out


# --------------------------------------------------------------------------- materials

_mats = {}


def _new_mat(name):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    return m, nt, nt.nodes["Principled BSDF"]


def hex2lin(h):
    h = h.lstrip("#")
    c = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    return tuple(((x + 0.055) / 1.055) ** 2.4 if x > 0.04045 else x / 12.92 for x in c)


def mat_plain(name, color, rough=0.6, metal=0.0, spec=0.5, coat=0.0):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rough
    p.inputs["Metallic"].default_value = metal
    p.inputs["Specular IOR Level"].default_value = spec
    p.inputs["Coat Weight"].default_value = coat
    _mats[name] = m
    return m


def _noise_bump(nt, p, scale=40, strength=0.15, detail=6, distance=0.02):
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = detail
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = strength
    b.inputs["Distance"].default_value = distance
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    return n


def mat_stucco(name="stucco", color=(0.86, 0.83, 0.77)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.85
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 3
    n.inputs["Detail"].default_value = 4
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    c2 = tuple(x * 0.93 for x in color)
    ramp.color_ramp.elements[0].color = (*c2, 1)
    ramp.color_ramp.elements[1].color = (*color, 1)
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    _noise_bump(nt, p, scale=120, strength=0.08)
    _mats[name] = m
    return m


def mat_wood(name="oak", color=(0.42, 0.25, 0.13), scale=1.0, rough=0.55, axis="Z", planks=None):
    """Oak-like wood: streaky stretched-noise grain, optional plank/board variation via brick texture.
    `axis` is the grain direction."""
    if name in _mats:
        return _mats[name]
    if planks is None:
        planks = axis == "X"
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    # stretch along grain axis
    sc = {"Z": (30, 30, 0.8), "X": (0.8, 30, 30), "Y": (30, 0.8, 30)}[axis]
    mp.inputs["Scale"].default_value = tuple(v * scale for v in sc)
    grain = nt.nodes.new("ShaderNodeTexNoise")
    grain.inputs["Scale"].default_value = 1.0
    grain.inputs["Detail"].default_value = 8
    grain.inputs["Distortion"].default_value = 0.3
    big = nt.nodes.new("ShaderNodeTexNoise")
    big.inputs["Scale"].default_value = 0.15
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "FLOAT"
    mix.inputs[0].default_value = 0.45
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].position = 0.3
    ramp.color_ramp.elements[1].position = 0.75
    dark = tuple(x * 0.68 for x in color)
    light = tuple(min(1, x * 1.18) for x in color)
    ramp.color_ramp.elements[0].color = (*dark, 1)
    ramp.color_ramp.elements[1].color = (*light, 1)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], grain.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], big.inputs["Vector"])
    nt.links.new(grain.outputs["Fac"], mix.inputs[2])
    nt.links.new(big.outputs["Fac"], mix.inputs[3])
    nt.links.new(mix.outputs[0], ramp.inputs["Fac"])
    col = ramp.outputs["Color"]
    if planks:
        # planks along X: brick texture in (x, y) object space
        mp2 = nt.nodes.new("ShaderNodeMapping")
        mp2.inputs["Scale"].default_value = (0.25, 1.0, 1.0)
        br = nt.nodes.new("ShaderNodeTexBrick")
        br.inputs["Scale"].default_value = 1.25
        br.inputs["Mortar Size"].default_value = 0.004
        br.inputs["Bias"].default_value = 0.0
        br.inputs["Color1"].default_value = (1.0, 1.0, 1.0, 1)
        br.inputs["Color2"].default_value = (0.78, 0.78, 0.78, 1)
        br.inputs["Mortar"].default_value = (0.25, 0.25, 0.25, 1)
        br.offset = 0.37
        mul = nt.nodes.new("ShaderNodeMix")
        mul.data_type = "RGBA"
        mul.blend_type = "MULTIPLY"
        mul.inputs[0].default_value = 1.0
        nt.links.new(tc.outputs["Object"], mp2.inputs["Vector"])
        nt.links.new(mp2.outputs["Vector"], br.inputs["Vector"])
        nt.links.new(col, mul.inputs[6])
        nt.links.new(br.outputs["Color"], mul.inputs[7])
        col = mul.outputs[2]
        b = nt.nodes.new("ShaderNodeBump")
        b.inputs["Strength"].default_value = 0.3
        b.inputs["Distance"].default_value = 0.005
        nt.links.new(br.outputs["Fac"], b.inputs["Height"])
        nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    nt.links.new(col, p.inputs["Base Color"])
    _mats[name] = m
    return m


def mat_stone(name="stone", c1=(0.42, 0.38, 0.33), c2=(0.62, 0.57, 0.5), scale=3.0, rough=0.8):
    """Stacked stone / travertine via voronoi + noise."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = rough
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (scale, scale, scale * 2.2)
    vor = nt.nodes.new("ShaderNodeTexVoronoi")
    vor.inputs["Scale"].default_value = 2.0
    vor.inputs["Randomness"].default_value = 0.8
    vor2 = nt.nodes.new("ShaderNodeTexVoronoi")
    vor2.feature = "DISTANCE_TO_EDGE"
    vor2.inputs["Scale"].default_value = 2.0
    vor2.inputs["Randomness"].default_value = 0.8
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 18
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1)
    ramp.color_ramp.elements[1].color = (*c2, 1)
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.blend_type = "MULTIPLY"
    mix.inputs[0].default_value = 0.35
    edge = nt.nodes.new("ShaderNodeMapRange")
    edge.inputs["From Min"].default_value = 0.0
    edge.inputs["From Max"].default_value = 0.04
    edge.inputs["To Min"].default_value = 0.35
    edge.inputs["To Max"].default_value = 1.0
    mul = nt.nodes.new("ShaderNodeMix")
    mul.data_type = "RGBA"
    mul.blend_type = "MULTIPLY"
    mul.inputs[0].default_value = 1.0
    for a, b in (
        (tc.outputs["Object"], mp.inputs["Vector"]),
        (mp.outputs["Vector"], vor.inputs["Vector"]),
        (mp.outputs["Vector"], vor2.inputs["Vector"]),
        (mp.outputs["Vector"], noise.inputs["Vector"]),
        (vor.outputs["Color"], mix.inputs[6]),
        (noise.outputs["Color"], mix.inputs[7]),
    ):
        nt.links.new(a, b)
    # stone colour from the voronoi cell id
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(vor.outputs["Color"], sep.inputs[0])
    nt.links.new(sep.outputs[0], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], mul.inputs[6])
    nt.links.new(vor2.outputs["Distance"], edge.inputs["Value"])
    comb = nt.nodes.new("ShaderNodeCombineColor")
    nt.links.new(edge.outputs["Result"], comb.inputs[0])
    nt.links.new(edge.outputs["Result"], comb.inputs[1])
    nt.links.new(edge.outputs["Result"], comb.inputs[2])
    nt.links.new(comb.outputs[0], mul.inputs[7])
    nt.links.new(mul.outputs[2], p.inputs["Base Color"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.6
    b.inputs["Distance"].default_value = 0.03
    nt.links.new(edge.outputs["Result"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_travertine(name="travertine", color=(0.78, 0.71, 0.6)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.5
    tc = nt.nodes.new("ShaderNodeTexCoord")
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Scale"].default_value = (1.5, 1.5, 12)
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 3
    noise.inputs["Detail"].default_value = 10
    noise.inputs["Distortion"].default_value = 0.6
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*tuple(x * 0.8 for x in color), 1)
    ramp.color_ramp.elements[1].color = (*color, 1)
    nt.links.new(tc.outputs["Object"], mp.inputs["Vector"])
    nt.links.new(mp.outputs["Vector"], noise.inputs["Vector"])
    nt.links.new(noise.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    _noise_bump(nt, p, scale=60, strength=0.12)
    _mats[name] = m
    return m


def mat_glass(name="glass", tint=(0.8, 0.86, 0.85)):
    """Thin architectural glass: fresnel mix of transparent and glossy (cheap, shows interiors)."""
    if name in _mats:
        return _mats[name]
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    nt = m.node_tree
    nt.nodes.clear()
    out = nt.nodes.new("ShaderNodeOutputMaterial")
    tr = nt.nodes.new("ShaderNodeBsdfTransparent")
    tr.inputs["Color"].default_value = (*tint, 1)
    gl = nt.nodes.new("ShaderNodeBsdfGlossy")
    gl.inputs["Roughness"].default_value = 0.02
    gl.inputs["Color"].default_value = (1, 1, 1, 1)
    lw = nt.nodes.new("ShaderNodeLayerWeight")
    lw.inputs["Blend"].default_value = 0.25
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["To Min"].default_value = 0.06
    mr.inputs["To Max"].default_value = 0.6
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(lw.outputs["Fresnel"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], mix.inputs["Fac"])
    nt.links.new(tr.outputs[0], mix.inputs[1])
    nt.links.new(gl.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    _mats[name] = m
    return m


def mat_emit(name, color=(1.0, 0.72, 0.42), strength=3.0):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Emission Color"].default_value = (*color, 1)
    p.inputs["Emission Strength"].default_value = strength
    _mats[name] = m
    return m


def mat_interior_glow(name="interior", color=(0.95, 0.7, 0.45), strength=1.5, wall=(0.75, 0.68, 0.58)):
    """Diffuse warm wall that also glows a little — reads as lit interior through glass."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*wall, 1)
    p.inputs["Roughness"].default_value = 0.9
    p.inputs["Emission Color"].default_value = (*color, 1)
    p.inputs["Emission Strength"].default_value = strength
    _mats[name] = m
    return m


def mat_grass(name="grass", c1=(0.06, 0.11, 0.035), c2=(0.16, 0.2, 0.07), scale=0.6):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.95
    p.inputs["Specular IOR Level"].default_value = 0.2
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = scale
    n.inputs["Detail"].default_value = 8
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1)
    ramp.color_ramp.elements[1].color = (*c2, 1)
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    _noise_bump(nt, p, scale=300, strength=0.5, distance=0.05)
    _mats[name] = m
    return m


def mat_gravel(name="gravel", color=(0.55, 0.5, 0.44)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.95
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v = nt.nodes.new("ShaderNodeTexVoronoi")
    v.inputs["Scale"].default_value = 60
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*tuple(x * 0.7 for x in color), 1)
    ramp.color_ramp.elements[1].color = (*color, 1)
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(tc.outputs["Object"], v.inputs["Vector"])
    nt.links.new(v.outputs["Color"], sep.inputs[0])
    nt.links.new(sep.outputs[0], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.4
    nt.links.new(v.outputs["Distance"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_water(name="water", color=(0.05, 0.22, 0.24)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = 0.03
    p.inputs["Specular IOR Level"].default_value = 0.8
    n = _noise_bump(nt, p, scale=4, strength=0.08, distance=0.1)
    _mats[name] = m
    return m


def mat_foliage(name="foliage", c1=(0.05, 0.09, 0.04), c2=(0.16, 0.2, 0.1)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.7
    p.inputs["Subsurface Weight"].default_value = 0.0
    tc = nt.nodes.new("ShaderNodeTexCoord")
    v = nt.nodes.new("ShaderNodeTexVoronoi")
    v.inputs["Scale"].default_value = 14
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1)
    ramp.color_ramp.elements[1].color = (*c2, 1)
    sep = nt.nodes.new("ShaderNodeSeparateColor")
    nt.links.new(tc.outputs["Object"], v.inputs["Vector"])
    nt.links.new(v.outputs["Color"], sep.inputs[0])
    nt.links.new(sep.outputs[1], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.9
    nt.links.new(v.outputs["Distance"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_fabric(name="fabric", color=(0.78, 0.74, 0.67)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = 0.95
    p.inputs["Sheen Weight"].default_value = 0.4
    _noise_bump(nt, p, scale=400, strength=0.15)
    _mats[name] = m
    return m


def mat_tile_roof(name="tileroof", color=(0.55, 0.24, 0.13)):
    """Terracotta barrel tile impression via wave bump."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.75
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.wave_profile = "SIN"
    wave.inputs["Scale"].default_value = 1.6
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 1.5
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*tuple(x * 0.7 for x in color), 1)
    ramp.color_ramp.elements[1].color = (*tuple(min(1, x * 1.2) for x in color), 1)
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.8
    b.inputs["Distance"].default_value = 0.08
    nt.links.new(wave.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_metal_roof(name="metalroof", color=(0.035, 0.038, 0.038)):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Metallic"].default_value = 0.3
    p.inputs["Roughness"].default_value = 0.6
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.wave_profile = "SAW"
    wave.inputs["Scale"].default_value = 1.2
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.3
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_boards(name="boards", color=(0.9, 0.88, 0.84), spacing=4.0):
    """Board-and-batten white siding (vertical battens via bump)."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = 0.7
    tc = nt.nodes.new("ShaderNodeTexCoord")
    wave = nt.nodes.new("ShaderNodeTexWave")
    wave.wave_type = "BANDS"
    wave.bands_direction = "X"
    wave.wave_profile = "SAW"
    wave.inputs["Scale"].default_value = spacing
    mp = nt.nodes.new("ShaderNodeMapping")
    mp.inputs["Rotation"].default_value = (0, 0, math.radians(45))
    w2 = nt.nodes.new("ShaderNodeTexWave")
    w2.wave_type = "BANDS"
    w2.bands_direction = "Y"
    w2.wave_profile = "SAW"
    w2.inputs["Scale"].default_value = spacing
    mx = nt.nodes.new("ShaderNodeMath")
    mx.operation = "MAXIMUM"
    gt = nt.nodes.new("ShaderNodeMath")
    gt.operation = "GREATER_THAN"
    gt.inputs[1].default_value = 0.93
    nt.links.new(tc.outputs["Object"], wave.inputs["Vector"])
    nt.links.new(tc.outputs["Object"], w2.inputs["Vector"])
    nt.links.new(wave.outputs["Fac"], mx.inputs[0])
    nt.links.new(w2.outputs["Fac"], mx.inputs[1])
    nt.links.new(mx.outputs[0], gt.inputs[0])
    b = nt.nodes.new("ShaderNodeBump")
    b.inputs["Strength"].default_value = 0.6
    b.inputs["Distance"].default_value = 0.02
    nt.links.new(gt.outputs[0], b.inputs["Height"])
    nt.links.new(b.outputs["Normal"], p.inputs["Normal"])
    _mats[name] = m
    return m


def mat_hills(name="hills", haze=(0.55, 0.5, 0.48), near=250, far=1800, golden=True):
    """Dry golden California hills with oak dots, fading into aerial haze with distance."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.95
    p.inputs["Specular IOR Level"].default_value = 0.1
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 0.01
    n.inputs["Detail"].default_value = 6
    v = nt.nodes.new("ShaderNodeTexVoronoi")
    v.inputs["Scale"].default_value = 0.08
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    if golden:
        ramp.color_ramp.elements[0].color = (0.2, 0.15, 0.07, 1)
        ramp.color_ramp.elements[1].color = (0.42, 0.32, 0.16, 1)
    else:
        ramp.color_ramp.elements[0].color = (0.06, 0.08, 0.04, 1)
        ramp.color_ramp.elements[1].color = (0.16, 0.17, 0.09, 1)
    dots = nt.nodes.new("ShaderNodeMath")
    dots.operation = "LESS_THAN"
    dots.inputs[1].default_value = 0.12
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[7].default_value = (0.04, 0.055, 0.03, 1)
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(tc.outputs["Object"], v.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(v.outputs["Distance"], dots.inputs[0])
    nt.links.new(dots.outputs[0], mix.inputs[0])
    nt.links.new(ramp.outputs["Color"], mix.inputs[6])
    _haze(nt, mix.outputs[2], p, haze, near, far)
    _mats[name] = m
    return m


def _haze(nt, color_out, p, haze, near, far):
    """Blend toward a haze colour with camera distance (cheap aerial perspective).
    Haze goes partly into emission so distant forms lift toward the sky tone."""
    cam = nt.nodes.new("ShaderNodeCameraData")
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = near
    mr.inputs["From Max"].default_value = far
    mr.inputs["To Max"].default_value = 0.85
    mix = nt.nodes.new("ShaderNodeMix")
    mix.data_type = "RGBA"
    mix.inputs[7].default_value = (*haze, 1)
    nt.links.new(cam.outputs["View Distance"], mr.inputs["Value"])
    nt.links.new(mr.outputs["Result"], mix.inputs[0])
    nt.links.new(color_out, mix.inputs[6])
    nt.links.new(mix.outputs[2], p.inputs["Base Color"])
    p.inputs["Emission Color"].default_value = (*haze, 1)
    em = nt.nodes.new("ShaderNodeMath")
    em.operation = "MULTIPLY"
    em.inputs[1].default_value = 0.6
    nt.links.new(mr.outputs["Result"], em.inputs[0])
    nt.links.new(em.outputs[0], p.inputs["Emission Strength"])


# --------------------------------------------------------------------------- geometry

def _link(obj):
    bpy.context.collection.objects.link(obj)
    return obj


def box(name, loc, size, mat=None, bevel=0.015, rot=(0, 0, 0)):
    """Axis-aligned box. loc = min-corner (x, y, z); size = (sx, sy, sz)."""
    import bmesh

    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x = (v.co.x + 0.5) * size[0]
        v.co.y = (v.co.y + 0.5) * size[1]
        v.co.z = (v.co.z + 0.5) * size[2]
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new(name, me))
    o.location = loc
    o.rotation_euler = rot
    if mat:
        me.materials.append(mat)
    if bevel and min(size) > bevel * 2.5:
        bv = o.modifiers.new("bevel", "BEVEL")
        bv.width = bevel
        bv.segments = 2
        bv.limit_method = "ANGLE"
    return o


def cbox(name, center, size, mat=None, bevel=0.015, rot=(0, 0, 0)):
    """Box by center."""
    o = box(name, (0, 0, 0), size, mat, bevel, rot=(0, 0, 0))
    for v in o.data.vertices:
        v.co.x -= size[0] / 2
        v.co.y -= size[1] / 2
        v.co.z -= size[2] / 2
    o.location = center
    o.rotation_euler = rot
    return o


def plane(name, loc, size, mat=None, rot=(0, 0, 0)):
    import bmesh

    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=1, y_segments=1, size=0.5)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new(name, me))
    o.location = loc
    o.rotation_euler = rot
    if mat:
        me.materials.append(mat)
    return o


def cylinder(name, loc, r, h, mat=None, verts=24, r2=None):
    import bmesh

    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=True, segments=verts, radius1=r, radius2=r if r2 is None else r2, depth=h)
    for v in bm.verts:
        v.co.z += h / 2
    bm.to_mesh(me)
    bm.free()
    for poly in me.polygons:
        poly.use_smooth = True
    o = _link(bpy.data.objects.new(name, me))
    o.location = loc
    if mat:
        me.materials.append(mat)
    return o


def blob(name, loc, radius, mat, squash=(1, 1, 1), noise=0.35, subdiv=3, seed=None, fine=0.12):
    """Displaced icosphere (big lumps + fine leafy breakup): shrubs and tree canopies."""
    import bmesh

    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=subdiv, radius=radius)
    bm.to_mesh(me)
    bm.free()
    for poly in me.polygons:
        poly.use_smooth = True
    o = _link(bpy.data.objects.new(name, me))
    o.location = loc
    o.scale = squash
    me.materials.append(mat)
    tex = _tex("lumps", "CLOUDS", 0.8, 2)
    d = o.modifiers.new("disp", "DISPLACE")
    d.texture = tex
    d.strength = radius * noise
    d.mid_level = 0.5
    d.texture_coords = "GLOBAL"
    if fine:
        sub = o.modifiers.new("sub", "SUBSURF")
        sub.levels = 1
        sub.render_levels = 1
        t2 = _tex("leafy", "VORONOI", 0.12, 0)
        d2 = o.modifiers.new("disp2", "DISPLACE")
        d2.texture = t2
        d2.strength = fine
        d2.mid_level = 0.6
        d2.texture_coords = "GLOBAL"
    return o


_texcache = {}


def _tex(key, kind, scale, depth):
    k = (key, kind, scale, depth)
    if k not in _texcache:
        t = bpy.data.textures.new(key, kind)
        t.noise_scale = scale
        if kind == "CLOUDS":
            t.noise_depth = depth
        _texcache[k] = t
    return _texcache[k]


def leaf_cloud(name, center, radius, mat, squash=(1, 1, 1), n=2500, leaf=0.16, seed=0, core=True, core_r=0.62):
    """Canopy made of thousands of small randomly-oriented leaf quads in one mesh,
    with a dark inner core so it doesn't read as see-through."""
    import bmesh

    rnd = random.Random(seed)
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    sx, sy, sz = squash
    for i in range(n):
        # point biased toward the outer shell, lumpy via a few sub-centres
        u = rnd.uniform(-1, 1)
        th = rnd.uniform(0, math.tau)
        r = radius * (rnd.random() ** 0.35)
        sq = math.sqrt(1 - u * u)
        p = Vector((sq * math.cos(th) * r * sx, sq * math.sin(th) * r * sy, u * r * sz))
        # random leaf orientation
        a = Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1))).normalized()
        b = a.cross(Vector((rnd.uniform(-1, 1), rnd.uniform(-1, 1), rnd.uniform(-1, 1)))).normalized()
        s_ = leaf * rnd.uniform(0.6, 1.3)
        vs = [bm.verts.new(p + a * s_ * 0.5), bm.verts.new(p + b * s_ * 0.3),
              bm.verts.new(p - a * s_ * 0.5), bm.verts.new(p - b * s_ * 0.3)]
        bm.faces.new(vs)
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new(name, me))
    o.location = center
    me.materials.append(mat)
    if core:
        c = blob(name + "_core", center, radius * core_r, mat_plain("leafcore", (0.02, 0.03, 0.014), 0.9),
                 squash=squash, noise=0.25, subdiv=2, fine=0)
    return o


def mat_leaf(name, c1, c2):
    """Two-sided leaf with slight translucency and per-face colour variation."""
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.55
    p.inputs["Specular IOR Level"].default_value = 0.35
    oi = nt.nodes.new("ShaderNodeObjectInfo")
    ga = nt.nodes.new("ShaderNodeNewGeometry")
    tc = nt.nodes.new("ShaderNodeTexCoord")
    n = nt.nodes.new("ShaderNodeTexNoise")
    n.inputs["Scale"].default_value = 3.0
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    ramp.color_ramp.elements[0].color = (*c1, 1)
    ramp.color_ramp.elements[1].color = (*c2, 1)
    nt.links.new(tc.outputs["Object"], n.inputs["Vector"])
    nt.links.new(n.outputs["Fac"], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], p.inputs["Base Color"])
    out = nt.nodes["Material Output"]
    tl = nt.nodes.new("ShaderNodeBsdfTranslucent")
    tl.inputs["Color"].default_value = (c2[0] * 1.6, c2[1] * 1.8, c2[2] * 0.9, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    mix.inputs["Fac"].default_value = 0.25
    nt.links.new(p.outputs[0], mix.inputs[1])
    nt.links.new(tl.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])
    _mats[name] = m
    return m


LEAVES = {
    "olive": ((0.05, 0.065, 0.04), (0.16, 0.18, 0.11)),
    "oak": ((0.025, 0.045, 0.018), (0.09, 0.12, 0.045)),
    "cypress": ((0.015, 0.035, 0.015), (0.05, 0.08, 0.035)),
    "shrub": ((0.03, 0.06, 0.02), (0.1, 0.14, 0.05)),
}


def tree(loc, height=6.0, crown=2.4, mat=None, trunk_mat=None, kind="olive", seed=0):
    rnd = random.Random(seed + int(loc[0] * 13 + loc[1] * 7))
    trunk_mat = trunk_mat or mat_plain("bark", (0.1, 0.08, 0.065), 0.9)
    x, y, z = loc
    lm = mat or mat_leaf("leaf_" + kind, *LEAVES.get(kind, LEAVES["olive"]))
    if kind == "cypress":
        cylinder("trunk", (x, y, z), 0.12, height * 0.3, trunk_mat, 8)
        leaf_cloud("cyp", (x, y, z + height * 0.55), crown * 0.5, lm, squash=(1, 1, height / crown),
                   n=int(9000 * height / 8), leaf=0.11, seed=rnd.randint(0, 9999), core_r=0.82)
        return
    th = height * 0.45
    # trunk with a couple of leaning limbs
    cylinder("trunk", (x, y, z), crown * 0.07, th, trunk_mat, 10, r2=crown * 0.045)
    for k in range(3):
        a = rnd.uniform(0, math.tau)
        limb = cylinder("limb", (x, y, z + th * 0.8), crown * 0.035, crown * 0.8, trunk_mat, 8, r2=crown * 0.015)
        limb.rotation_euler = (math.cos(a) * 0.7, math.sin(a) * 0.7, 0)
    nclust = 5 if kind == "olive" else 7
    for i in range(nclust):
        a = i / nclust * math.tau + rnd.uniform(-0.4, 0.4)
        rr = crown * rnd.uniform(0.25, 0.55)
        rad = crown * rnd.uniform(0.42, 0.55)
        leaf_cloud("crown", (x + math.cos(a) * rr, y + math.sin(a) * rr, z + th + crown * rnd.uniform(0.2, 0.6)),
                   rad, lm, squash=(1, 1, 0.75), n=int(1400 * rad), leaf=0.14 if kind == "olive" else 0.18,
                   seed=rnd.randint(0, 9999))
    leaf_cloud("crowntop", (x, y, z + th + crown * 0.8), crown * 0.5, lm, squash=(1, 1, 0.7),
               n=int(1400 * crown * 0.5), leaf=0.16, seed=rnd.randint(0, 9999))


def shrub(loc, r=0.6, mat=None):
    lm = mat if (mat is not None and mat.name.startswith("leaf")) else mat_leaf("leaf_shrub", *LEAVES["shrub"])
    if mat is not None and not mat.name.startswith("leaf"):
        lm = mat
    leaf_cloud("shrub", (loc[0], loc[1], loc[2] + r * 0.5), r, lm, squash=(1, 1, 0.75),
               n=int(5000 * r * r + 400), leaf=0.06, seed=int(loc[0] * 31 + loc[1] * 17))


def grass_tuft(loc, r=0.35, mat=None, blades=60, seed=None):
    """Ornamental grass clump built from thin triangular blades in one mesh."""
    import bmesh

    mat = mat or mat_plain("blade", (0.17, 0.17, 0.07), 0.6)
    rnd = random.Random(seed if seed is not None else int(loc[0] * 97 + loc[1] * 31))
    me = bpy.data.meshes.new("tuft")
    bm = bmesh.new()
    h0 = r * 2.2
    for i in range(blades):
        a = rnd.uniform(0, math.tau)
        tilt = rnd.uniform(0.15, 0.6)
        h = h0 * rnd.uniform(0.6, 1.1)
        w = 0.018
        bx, by = math.cos(a) * r * 0.15, math.sin(a) * r * 0.15
        tx, ty = bx + math.cos(a) * math.sin(tilt) * h, by + math.sin(a) * math.sin(tilt) * h
        px, py = -math.sin(a) * w, math.cos(a) * w
        v1 = bm.verts.new((bx - px, by - py, 0))
        v2 = bm.verts.new((bx + px, by + py, 0))
        v3 = bm.verts.new((tx, ty, math.cos(tilt) * h))
        bm.faces.new((v1, v2, v3))
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new("tuft", me))
    o.location = loc
    me.materials.append(mat)
    return o


def hills(center=(0, 400, 0), size=(2400, 900), height=70, seed=3, mat=None):
    """Displaced distant hills."""
    import bmesh

    me = bpy.data.meshes.new("hills")
    bm = bmesh.new()
    bmesh.ops.create_grid(bm, x_segments=160, y_segments=60, size=0.5)
    for v in bm.verts:
        v.co.x *= size[0]
        v.co.y *= size[1]
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new("hills", me))
    o.location = center
    for poly in me.polygons:
        poly.use_smooth = True
    me.materials.append(mat or mat_hills())
    tex = bpy.data.textures.new("hilltx", "CLOUDS")
    tex.noise_scale = 260
    tex.noise_depth = 3
    tex.noise_basis = "BLENDER_ORIGINAL"
    d = o.modifiers.new("disp", "DISPLACE")
    d.texture = tex
    d.strength = height
    d.texture_coords = "LOCAL"
    d.mid_level = 0.35
    return o


def slats(x0, y, z0, width, height, depth=0.08, gap=0.09, thick=0.045, mat=None, axis="X"):
    """Vertical oak slat screen along X (or Y)."""
    mat = mat or mat_wood()
    n = int(width / gap)
    for i in range(n):
        if axis == "X":
            box("slat", (x0 + i * gap, y, z0), (thick, depth, height), mat, bevel=0.004)
        else:
            box("slat", (y, x0 + i * gap, z0), (depth, thick, height), mat, bevel=0.004)


def window_wall(x0, y, z0, width, height, mullion=1.6, frame_mat=None, glass=None, axis="X", frame=0.05):
    """Floor-to-ceiling glazing with slim dark frames on plane y (axis X) or x (axis Y)."""
    frame_mat = frame_mat or mat_plain("frame", (0.025, 0.027, 0.026), 0.4, 0.5)
    glass = glass or mat_glass()
    n = max(1, round(width / mullion))
    step = width / n
    if axis == "X":
        plane("glass", (x0 + width / 2, y, z0 + height / 2), (width, height), glass, rot=(math.pi / 2, 0, 0))
        for i in range(n + 1):
            box("mull", (x0 + i * step - frame / 2, y - frame / 2, z0), (frame, frame * 1.4, height), frame_mat, 0)
        box("head", (x0, y - frame / 2, z0 + height - frame), (width, frame * 1.4, frame), frame_mat, 0)
        box("sill", (x0, y - frame / 2, z0), (width, frame * 1.4, frame), frame_mat, 0)
    else:
        plane("glass", (y, x0 + width / 2, z0 + height / 2), (width, height), glass, rot=(math.pi / 2, 0, math.pi / 2))
        for i in range(n + 1):
            box("mull", (y - frame / 2, x0 + i * step - frame / 2, z0), (frame * 1.4, frame, height), frame_mat, 0)
        box("head", (y - frame / 2, x0, z0 + height - frame), (frame * 1.4, width, frame), frame_mat, 0)
        box("sill", (y - frame / 2, x0, z0), (frame * 1.4, width, frame), frame_mat, 0)


def gable_prism(name, center, length, width, wall_h, roof_h, mat_wall, mat_roof, overhang=0.35, axis="X", roof_t=0.12):
    """Gabled volume: walls box + pitched roof slabs. Ridge runs along `axis`."""
    import bmesh

    cx, cy, cz = center
    if axis == "X":
        L, W = length, width
    else:
        L, W = width, length
    # walls (box + gable triangles as a single prism mesh)
    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    hw = width / 2
    hl = length / 2
    prof = [(-hw, 0), (hw, 0), (hw, wall_h), (0, wall_h + roof_h), (-hw, wall_h)]
    vs0 = [bm.verts.new((-hl, a, b)) for a, b in prof]
    vs1 = [bm.verts.new((hl, a, b)) for a, b in prof]
    bm.faces.new(vs0[::-1])
    bm.faces.new(vs1)
    for i in range(5):
        j = (i + 1) % 5
        bm.faces.new((vs0[i], vs0[j], vs1[j], vs1[i]))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = _link(bpy.data.objects.new(name, me))
    o.location = (cx, cy, cz)
    if axis == "Y":
        o.rotation_euler = (0, 0, math.pi / 2)
    me.materials.append(mat_wall)
    # roof slabs, built in the walls' local frame then parented (ridge along local X)
    hyp = math.hypot(hw, roof_h)
    slope = math.atan2(roof_h, hw)
    rl = hyp + overhang
    tc = rl / 2
    for side in (-1, 1):
        r = cbox(name + "_roof", (0, 0, 0), (length + overhang * 2, rl + 0.05, roof_t), mat_roof, bevel=0.01)
        ly = side * math.cos(slope) * tc + side * math.sin(slope) * roof_t / 2
        lz = wall_h + roof_h - math.sin(slope) * tc + math.cos(slope) * roof_t / 2
        r.rotation_euler = (-side * slope, 0, 0)
        r.location = (0, ly, lz)
        r.parent = o
    return o


def ground(size=600, mat=None, z=0.0):
    return plane("ground", (0, 0, z), (size, size), mat or mat_grass())


def scatter(fn, area, n, seed=1, avoid=None, **kw):
    rnd = random.Random(seed)
    (x0, y0, x1, y1) = area
    placed = 0
    tries = 0
    while placed < n and tries < n * 30:
        tries += 1
        x, y = rnd.uniform(x0, x1), rnd.uniform(y0, y1)
        if avoid and any(a[0] <= x <= a[2] and a[1] <= y <= a[3] for a in avoid):
            continue
        fn((x, y, 0), **kw)
        placed += 1


# --------------------------------------------------------------------------- shot registry

SHOTS = {}


def shot(name, w, h, samples=64):
    def deco(fn):
        SHOTS[name] = (fn, w, h, samples)
        return fn
    return deco


def treeline(y=180, x0=-500, x1=500, depth=60, n=260, seed=5, mat=None):
    """Cheap distant band of tree masses for depth (hazed by distance)."""
    rnd = random.Random(seed)
    mat = mat or mat_distant()
    for i in range(n):
        x = rnd.uniform(x0, x1)
        yy = y + rnd.uniform(0, depth)
        r = rnd.uniform(3, 7)
        blob("far", (x, yy, r * 0.5), r, mat, squash=(1.1, 1, 1.05), noise=0.7, subdiv=3, fine=0)


def mat_distant(name="distant", c=(0.018, 0.026, 0.014), haze=(0.42, 0.45, 0.5), near=80, far=1400):
    if name in _mats:
        return _mats[name]
    m, nt, p = _new_mat(name)
    p.inputs["Roughness"].default_value = 0.95
    rgb = nt.nodes.new("ShaderNodeRGB")
    rgb.outputs[0].default_value = (*c, 1)
    _haze(nt, rgb.outputs[0], p, haze, near, far)
    _mats[name] = m
    return m


def daylight(elevation=20, rotation=200, strength=None, aerosol=1.4):
    """Physically based sky with sun disc. Strength auto-scales so low and high suns expose similarly."""
    if strength is None:
        strength = 0.3 * (math.sin(math.radians(6)) / math.sin(math.radians(max(elevation, 3)))) ** 0.75
    return world_sky(elevation=elevation, rotation=rotation, strength=strength, aerosol=aerosol, sun_disc=True)


def terrain(fn, x0=-300, x1=300, y0=-200, y1=400, nx=150, ny=150, mat=None, name="terrain"):
    """Height-field ground from z = fn(x, y)."""
    import bmesh

    me = bpy.data.meshes.new(name)
    bm = bmesh.new()
    rows = []
    for j in range(ny + 1):
        y = y0 + (y1 - y0) * (j / ny) ** 1.0
        row = []
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx
            row.append(bm.verts.new((x, y, fn(x, y))))
        rows.append(row)
    for j in range(ny):
        for i in range(nx):
            bm.faces.new((rows[j][i], rows[j][i + 1], rows[j + 1][i + 1], rows[j + 1][i]))
    bm.to_mesh(me)
    bm.free()
    for p in me.polygons:
        p.use_smooth = True
    o = _link(bpy.data.objects.new(name, me))
    if mat:
        me.materials.append(mat)
    return o
