"""Procedural house builders shared by several shots."""
import math
import random

from common import (
    box, cbox, plane, cylinder, tree, shrub, grass_tuft, hills, slats, window_wall, gable_prism,
    mat_stucco, mat_wood, mat_stone, mat_travertine, mat_glass, mat_interior_glow, mat_grass,
    mat_gravel, mat_water, mat_plain, mat_emit, mat_foliage, mat_fabric, mat_tile_roof,
    mat_metal_roof, mat_boards, point_light, area_light, mat_leaf, treeline,
)


def furniture_hint(x0, y0, z, warm=True):
    """A few soft interior silhouettes so glass reads as lived-in space."""
    sofa = mat_fabric("sofa", (0.72, 0.66, 0.57))
    box("sofa", (x0, y0, z), (2.6, 0.95, 0.42), sofa, 0.06)
    box("sofaback", (x0, y0 + 0.75, z), (2.6, 0.22, 0.8), sofa, 0.06)
    box("table", (x0 + 0.6, y0 - 1.3, z), (1.3, 0.8, 0.36), mat_wood("oak_furn", (0.36, 0.2, 0.1)), 0.02)
    if warm:
        pend = mat_emit("pendant", (1.0, 0.7, 0.4), 18)
        for i in range(3):
            cylinder("pend", (x0 + 4 + i * 0.7, y0 - 0.5, z + 2.0), 0.16, 0.18, pend, 16)


def landscape_base(seed=4, hills_on=True, grass=None):
    plane("ground", (0, 40, 0), (900, 900), grass or mat_grass("lawn", (0.07, 0.1, 0.035), (0.17, 0.19, 0.07), 0.15))
    if hills_on:
        hills(center=(0, 650, -8), size=(3000, 700), height=90)


def contemporary(night=False, glow=None, pool=True, trees=True, wing=True, left_trees=True, meadow=True):
    """California contemporary: long glazed ground floor, cantilevered flat roofs,
    upper stucco volume with oak slat screen, stacked stone wing, reflecting pool."""
    st = mat_stucco("stucco", (0.85, 0.82, 0.76))
    oak = mat_wood("oak", (0.44, 0.26, 0.13))
    oak_soffit = mat_wood("oak_soffit", (0.5, 0.31, 0.16), axis="X", scale=0.6)
    stone = mat_stone("stone", (0.3, 0.27, 0.23), (0.52, 0.47, 0.4), scale=1.4)
    trav = mat_travertine("trav", (0.76, 0.7, 0.6))
    glass = mat_glass("glass")
    g = glow if glow is not None else (6.0 if night else 5.0)
    inner = mat_interior_glow("inner", (1.0, 0.68, 0.4), g, (0.72, 0.64, 0.54))
    dark = mat_plain("charcoal", (0.03, 0.035, 0.033), 0.5)
    floor_in = mat_wood("floor_in", (0.5, 0.32, 0.17), axis="X")

    # terrace + plinth
    box("plinth", (-3, -5.5, 0), (27, 16.5, 0.35), trav, 0.01)
    # ground floor interior shell
    box("floor_in", (0, 0.3, 0.35), (18, 9.4, 0.02), floor_in, 0)
    box("backwall", (0, 8.6, 0.35), (18, 0.3, 3.3), inner, 0)
    box("sidewall_l", (0, 0.3, 0.35), (0.35, 8.6, 3.3), st)
    box("ceiling", (0, 0.3, 3.55), (18, 8.6, 0.05), oak_soffit, 0)
    # solid front piece at left end (stucco), glass beyond
    box("front_l", (0, 0, 0.35), (3.2, 0.4, 3.3), st)
    window_wall(3.2, 0.2, 0.35, 13.0, 3.25, mullion=2.6, glass=glass)
    # interior partition fragments for depth
    box("core", (8.5, 5.0, 0.35), (3.5, 0.3, 3.2), inner, 0)
    box("fire", (12.8, 6.6, 0.35), (2.2, 0.6, 3.2), stone, 0.01)
    furniture_hint(4.5, 3.6, 0.37, warm=True)

    # stone wing at right
    if wing:
        box("wing", (16.2, -0.6, 0.35), (5.6, 10.0, 3.25), stone, 0.02)
    # big cantilevered roof slab over ground floor
    box("roof1", (-1.8, -2.6, 3.6), (19.6, 12.6, 0.38), st, 0.02)
    box("roof1_soffit", (-1.75, -2.55, 3.585), (19.5, 3.0, 0.02), oak_soffit, 0)
    box("fascia_shadow", (-1.8, -2.62, 3.6), (19.6, 0.02, 0.05), dark, 0)

    # upper volume
    box("upper_back", (8.2, 2.0, 3.98), (13.0, 8.0, 2.9), st, 0.02)
    box("upper_inner", (9.2, 2.6, 3.98), (6.6, 0.1, 2.85), inner, 0)
    window_wall(9.0, 1.95, 4.05, 7.0, 2.7, mullion=1.75, glass=glass)
    # hollow out impression: dark reveal around ribbon
    box("rev_t", (8.9, 1.9, 6.75), (7.2, 0.12, 0.08), dark, 0)
    slats(16.2, 1.86, 3.98, 4.9, 2.9, mat=oak)
    box("roof2", (7.4, 0.6, 6.88), (15.2, 10.2, 0.32), st, 0.02)

    # balcony glass rail over roof1
    plane("rail", (12.5, 0.4, 4.5), (8.0, 1.0), glass, rot=(math.pi / 2, 0, 0))

    # pool
    if pool:
        box("pool_coping", (1.0, -10.5, 0.0), (15.0, 4.6, 0.3), trav, 0.01)
        box("pool_water", (1.3, -10.2, 0.0), (14.4, 4.0, 0.33), mat_water("pool", (0.03, 0.16, 0.17)), 0)
        if night:
            box("pool_glow", (1.4, -10.1, 0.02), (14.2, 3.8, 0.02), mat_emit("poolglow", (0.2, 0.6, 0.65), 1.2), 0)

    # landscaping
    if trees:
        if left_trees:
            tree((-6.5, -6.0, 0), height=5.5, crown=2.6, seed=1)
            tree((-11.0, 6.0, 0), height=7.5, crown=3.4, kind="oak", seed=4)
        tree((24.5, -8.5, 0), height=6.2, crown=3.0, seed=2)
        tree((27.5, 2.5, 0), height=7.0, crown=3.2, kind="oak", seed=3)
        tree((40, 22, 0), height=10, crown=5, kind="oak", seed=6)
        tree((-30, 30, 0), height=10, crown=5, kind="oak", seed=7)
        for x in (2, 6, 30, 33):
            tree((x, 16 + (x % 3), 0), height=9, crown=1.5, kind="cypress", seed=x)
        rnd = random.Random(5)
        for i in range(14):
            shrub((rnd.uniform(-3, 23), rnd.uniform(-5.8, -5.2), 0.0), r=rnd.uniform(0.35, 0.6))
        for i in range(40):
            grass_tuft((rnd.uniform(-8, 26), rnd.uniform(-13.5, -11.0), 0.0), r=rnd.uniform(0.22, 0.38))
        if meadow:
            # loose foreground planting: ornamental grasses + low shrubs
            for i in range(160):
                x, y = rnd.uniform(-20, 34), rnd.uniform(-30, -15)
                grass_tuft((x, y, 0.0), r=rnd.uniform(0.25, 0.42),
                           mat=mat_plain("blade_dry", (0.3, 0.24, 0.11), 0.6) if i % 3 == 0 else None)
            for i in range(25):
                shrub((rnd.uniform(-20, 34), rnd.uniform(-28, -15), 0.0), r=rnd.uniform(0.4, 0.8))
        # gravel strip
        box("gravel", (-3, -13.2, 0), (27, 2.6, 0.03), mat_gravel("gravel"), 0)

    if night:
        # landscape uplights + warm interior fill
        for x in (-6.5, 24.5):
            point_light((x + 0.6, -6.6 if x < 0 else -9.1, 0.2), 30, (1, 0.72, 0.45))
        area_light((9, 4.5, 3.4), (9, 4.5, 0), size=10, size_y=6, energy=900, color=(1, 0.72, 0.45))
        area_light((14, 6, 6.6), (14, 6, 4), size=5, size_y=3, energy=300, color=(1, 0.72, 0.45))


def farmhouse(night=False):
    """Modern farmhouse: white board-and-batten gables, dark standing-seam roof, covered porch."""
    walls = mat_boards("boards", (0.86, 0.85, 0.81))
    roof = mat_metal_roof("metalroof")
    oak = mat_wood("oak_post", (0.42, 0.25, 0.12))
    glass = mat_glass("glass")
    inner = mat_interior_glow("inner", (1.0, 0.68, 0.4), 5.0 if night else 1.2, (0.72, 0.64, 0.54))
    dark = mat_plain("charcoal", (0.03, 0.035, 0.033), 0.5)
    conc = mat_travertine("porchfloor", (0.66, 0.62, 0.56))
    stone = mat_stone("stone", (0.4, 0.36, 0.3), (0.62, 0.58, 0.5))

    box("plinth", (-1, -4.5, 0), (25, 14.5, 0.3), conc, 0.01)
    # main gable (ridge along X)
    gable_prism("main", (8, 4.5, 0.3), 13, 8, 4.2, 3.6, walls, roof, overhang=0.4, axis="X")
    # cross gable, taller, at left (ridge along Y)
    gable_prism("cross", (2.2, 3.5, 0.3), 9, 6.0, 5.6, 3.4, walls, roof, overhang=0.4, axis="Y")
    # garage/side wing lower gable
    gable_prism("wing", (18.8, 5.0, 0.3), 7, 7, 3.2, 2.6, walls, roof, overhang=0.35, axis="X")
    # chimney
    box("chim", (11.5, 6.0, 4.5), (1.1, 1.1, 5.0), stone, 0.02)
    # interior glow surfaces behind windows
    box("in_main", (6.0, 0.49, 0.3), (8.4, 0.01, 3.0), inner, 0)
    # tall windows on cross gable
    box("crossin", (0.6, -1.02, 0.6), (3.2, 0.01, 4.4), inner, 0)
    window_wall(0.6, -1.05, 0.6, 3.2, 4.4, mullion=1.06, glass=glass)
    # gable apex window
    # porch along main front
    for i, x in enumerate((5.6, 9.0, 12.4, 15.0)):
        box("post", (x, -2.6, 0.3), (0.22, 0.22, 3.0), oak, 0.01)
    box("porchbeam", (5.4, -2.7, 3.3), (10.0, 0.4, 0.35), oak, 0.01)
    box("porchroof", (5.2, -3.0, 3.62), (10.4, 3.6, 0.14), roof, 0.01, rot=(math.radians(8), 0, 0))
    window_wall(6.0, 0.47, 0.3, 8.4, 3.0, mullion=1.4, glass=glass)
    box("door", (16.8, 1.48, 0.3), (3.6, 0.1, 2.7), dark, 0)
    # wing windows
    if night:
        area_light((9, 3, 3.2), (9, 3, 0), size=8, size_y=3, energy=700, color=(1, 0.72, 0.45))
        for x in (6.5, 10.0, 13.5):
            cylinder("lantern", (x, -2.3, 3.0), 0.12, 0.2, mat_emit("lantern", (1, 0.7, 0.4), 25), 12)

    tree((-8, -3, 0), height=8, crown=4.0, kind="oak", seed=11)
    tree((27, -2, 0), height=7, crown=3.4, kind="oak", seed=12)
    tree((30, 12, 0), height=9, crown=4.2, kind="oak", seed=13)
    rnd = random.Random(9)
    for i in range(16):
        shrub((rnd.uniform(0, 22), rnd.uniform(-5.2, -4.6), 0.0), r=rnd.uniform(0.35, 0.65))
    for i in range(25):
        grass_tuft((rnd.uniform(-6, 26), rnd.uniform(-9, -6), 0.0), r=rnd.uniform(0.25, 0.45))
    # path
    box("path", (16.8, -16, 0), (2.2, 11.5, 0.04), mat_gravel("gravel"), 0)


def hillside(night=False):
    """Modern hillside home: stepped stone + timber volumes cut into a slope, panoramic glass."""
    stone = mat_stone("stone_dark", (0.11, 0.1, 0.085), (0.26, 0.23, 0.19), scale=1.6)
    timber = mat_wood("timber", (0.33, 0.19, 0.09), axis="X", scale=0.8)
    st = mat_stucco("stucco", (0.84, 0.81, 0.75))
    glass = mat_glass("glass")
    inner = mat_interior_glow("inner", (1.0, 0.68, 0.4), 5.0 if night else 1.3, (0.7, 0.62, 0.52))
    dark = mat_plain("charcoal", (0.03, 0.035, 0.033), 0.5)
    trav = mat_travertine("trav", (0.72, 0.66, 0.57))
    dry = mat_grass("drygrass", (0.1, 0.085, 0.035), (0.24, 0.19, 0.08), 0.08)

    # slope rising toward +Y; house podium cut in at y in [-2, 10]
    import common as _C
    def hz(x, y):
        t = min(1.0, max(0.0, (y + 3) / 26.0))
        t = t * t * (3 - 2 * t)
        z = -6.2 + 12.0 * t
        if y < -10:
            z -= (-10 - y) * 0.16
        z += 0.6 * math.sin(x * 0.07) * math.cos(y * 0.05) + 0.3 * math.sin(x * 0.19 + y * 0.11)
        return z
    _C.terrain(hz, -260, 260, -160, 260, 170, 140, dry)
    hills(center=(0, 520, -20), size=(3000, 600), height=140)
    # retaining stone base
    box("base", (-4, -2, -6), (30, 12, 6.2), stone, 0.02)
    # lower level glazing set into base
    box("lower_in", (2, 0.2, -3.0), (18, 0.2, 2.8), inner, 0)
    window_wall(2, -2.02, -3.0, 18, 2.8, mullion=3.0, glass=glass)
    # main level terrace
    box("terrace", (-4, -6, 0.0), (30, 4.2, 0.2), trav, 0.01)
    plane("rail", (11, -5.95, 0.75), (30, 1.1), glass, rot=(math.pi / 2, 0, 0))
    # main living volume: panoramic glass, timber soffit roof cantilever
    box("main_floor", (0, -2, 0.2), (20, 9, 0.02), trav, 0)
    box("main_back", (0, 6.6, 0.2), (20, 0.3, 3.6), inner, 0)
    window_wall(0, -1.8, 0.2, 20, 3.6, mullion=2.5, glass=glass)
    box("main_side", (-0.3, -1.8, 0.2), (0.3, 8.6, 3.6), stone, 0.01)
    box("roof_main", (-2.5, -5.0, 3.8), (25, 12.5, 0.45), timber, 0.02)
    box("roof_top", (-2.55, -5.05, 4.2), (25.1, 12.6, 0.08), dark, 0.0)
    furniture_hint(4, 1.5, 0.22)
    # upper timber-clad volume stepped back
    box("up", (8, 3.0, 4.28), (14, 7, 3.2), timber, 0.02)
    window_wall(9, 2.95, 4.4, 8, 2.8, mullion=2.0, glass=glass)
    box("up_in", (9.2, 3.4, 4.3), (7.6, 0.1, 3.0), inner, 0)
    box("up_roof", (7.2, 2.2, 7.48), (15.6, 8.6, 0.3), st, 0.02)
    # stone chimney mass
    box("chim", (-2.0, 1.0, 0.2), (2.2, 2.2, 8.2), stone, 0.02)
    if night:
        area_light((10, 2.5, 3.6), (10, 2.5, 0), size=16, size_y=5, energy=1200, color=(1, 0.72, 0.45))
    # vegetation
    for (x, y, hh, cr, sd) in ((-7.5, -4.5, 7.5, 3.8, 21), (32, -2, 8, 4, 22), (38, 18, 8, 4, 23), (-22, 20, 9, 4.2, 24),
                               (-40, 40, 9, 4.5, 25), (55, 45, 9, 4.5, 26), (14, 30, 8, 3.8, 27)):
        tree((x, y, hz(x, y) - 0.2), height=hh, crown=cr, kind="oak", seed=sd)
    rnd = random.Random(31)
    blade = mat_plain("blade_dry", (0.3, 0.24, 0.11), 0.6)
    for i in range(140):
        x, y = rnd.uniform(-30, 45), rnd.uniform(-26, -3)
        if -4.5 < x < 26.5 and y > -3.5:
            continue
        grass_tuft((x, y, hz(x, y) - 0.05), r=rnd.uniform(0.3, 0.55), mat=blade if i % 2 else None)
    for i in range(22):
        x, y = rnd.uniform(-25, 40), rnd.uniform(-22, -3)
        if -4.5 < x < 26.5 and y > -3.5:
            continue
        shrub((x, y, hz(x, y) - 0.1), r=rnd.uniform(0.5, 0.9))


def arch_spandrel(x0, width, spring, top, y0, depth, mat):
    """Solid between a semicircular arch and the lintel above it (extruded along +Y)."""
    import bmesh
    import bpy
    from mathutils import Vector

    r = width / 2
    cx = x0 + r
    pts = [(x0, spring)]
    for k in range(1, 24):
        a = math.pi - math.pi * k / 24
        pts.append((cx + math.cos(a) * r, spring + math.sin(a) * r * 0.9))
    pts += [(x0 + width, spring), (x0 + width, top), (x0, top)]
    me = bpy.data.meshes.new("arch")
    bm = bmesh.new()
    vs = [bm.verts.new((x, y0, z)) for x, z in pts]
    f = bm.faces.new(vs)
    ext = bmesh.ops.extrude_face_region(bm, geom=[f])
    moved = [e for e in ext["geom"] if isinstance(e, bmesh.types.BMVert)]
    bmesh.ops.translate(bm, verts=moved, vec=Vector((0, depth, 0)))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new("arch", me)
    bpy.context.collection.objects.link(o)
    me.materials.append(mat)
    return o


def mediterranean(night=False):
    """Mediterranean revival: warm stucco, terracotta tile hip-ish gables, arched loggia."""
    st = mat_stucco("medstucco", (0.88, 0.8, 0.68))
    tile = mat_tile_roof("tileroof", (0.34, 0.11, 0.05))
    glass = mat_glass("glass")
    inner = mat_interior_glow("inner", (1.0, 0.68, 0.4), 1.3, (0.7, 0.6, 0.5))
    trav = mat_travertine("trav", (0.74, 0.66, 0.55))
    dark = mat_plain("ironwork", (0.03, 0.03, 0.03), 0.5, 0.5)

    box("plinth", (-2, -5, 0), (26, 15, 0.3), trav, 0.01)
    gable_prism("main", (9, 4.5, 0.3), 14, 9, 5.8, 2.2, st, tile, overhang=0.6, axis="X", roof_t=0.22)
    gable_prism("tower", (2.0, 3.0, 0.3), 6.0, 6.0, 7.4, 1.8, st, tile, overhang=0.6, axis="Y", roof_t=0.22)
    gable_prism("wing", (19.5, 5.5, 0.3), 7, 8, 3.6, 1.6, st, tile, overhang=0.5, axis="X", roof_t=0.2)
    # arched loggia in front of main
    lx0 = 4.8
    box("loggia_top", (lx0, -1.2, 3.3), (10.6, 1.4, 0.9), st, 0.02)
    box("loggia_back", (lx0, -0.02, 0.3), (10.6, 0.1, 3.0), inner, 0)
    n = 4
    w = 10.6 / n
    for i in range(n + 1):
        box("pier", (lx0 + i * w - 0.25, -1.2, 0.3), (0.5, 1.4, 3.0), st, 0.02)
    for i in range(n):
        arch_spandrel(lx0 + i * w + 0.25, w - 0.5, 2.3, 3.31, -1.2, 1.4, st)
    # windows with dark iron grilles
    for x in (16.4, 18.6, 20.8):
        box("win", (x, 1.48, 1.2), (1.2, 0.06, 2.0), inner, 0)
    box("towerwin", (1.4, -0.02, 4.6), (1.2, 0.06, 1.8), inner, 0)
    for x in (16.4, 18.6, 20.8):
        for k in range(4):
            box("bar", (x + 0.15 + k * 0.3, 1.43, 1.2), (0.03, 0.03, 2.0), dark, 0)
    tree((-6, -4, 0), height=6, crown=2.8, seed=41)
    tree((25.5, -6.5, 0), height=5.5, crown=2.6, seed=42)
    for x in (-3, 27, 30):
        tree((x, 12, 0), height=11, crown=1.6, kind="cypress", seed=x)
    rnd = random.Random(44)
    for i in range(18):
        shrub((rnd.uniform(-1, 23), rnd.uniform(-5.6, -4.8), 0.0), r=rnd.uniform(0.35, 0.6), mat=mat_leaf("leaf_lavender", (0.14, 0.11, 0.2), (0.3, 0.25, 0.4)) if i % 2 else None)
