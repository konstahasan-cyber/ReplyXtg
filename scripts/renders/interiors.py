"""Interior shots: living, kitchens, office, primary suite."""
import math
import random

import bpy

import common as C
from common import shot


def portal(center, size, rot_target):
    d = bpy.data.lights.new("Portal", "AREA")
    d.shape = "RECTANGLE"
    d.size, d.size_y = size
    try:
        d.cycles.is_portal = True
    except AttributeError:
        pass
    o = bpy.data.objects.new("Portal", d)
    bpy.context.collection.objects.link(o)
    o.location = center
    C.look_at(o, rot_target)


def room(w, d, h, floor, wall, ceil, glass_wall=True, mull=2.0, sill=0.0, exposure=0.6, back_mat=None):
    """Room spanning x[0,w], y[0,d], z[0,h]; glazed wall at y=0 looking out to -Y."""
    C.box("floor", (-0.3, -0.3, -0.2), (w + 0.6, d + 0.6, 0.2), floor, 0)
    C.box("ceil", (-0.3, -0.3, h), (w + 0.6, d + 0.6, 0.25), ceil, 0)
    C.box("wall_back", (-0.3, d, 0), (w + 0.6, 0.3, h), back_mat or wall, 0)
    C.box("wall_l", (-0.3, -0.3, 0), (0.3, d + 0.3, h), wall, 0)
    C.box("wall_r", (w, -0.3, 0), (0.3, d + 0.3, h), wall, 0)
    if glass_wall:
        C.window_wall(0, 0.0, sill, w, h - sill, mullion=mull)
        if sill > 0:
            C.box("sillwall", (0, -0.3, 0), (w, 0.3, sill), wall, 0)
        portal((w / 2, -0.05, h / 2), (w, h), (w / 2, 5, h / 2))
    bpy.context.scene.view_settings.exposure = exposure


def garden_outside(seed=1, y=-4, hills_on=True, golden=False):
    C.plane("lawn", (0, -150, -0.02), (600, 300), C.mat_grass("lawn", (0.07, 0.1, 0.035), (0.17, 0.19, 0.07), 0.15))
    C.box("terrace", (-20, -4.0, -0.2), (60, 4.0, 0.2), C.mat_travertine("trav", (0.76, 0.7, 0.6)), 0)
    rnd = random.Random(seed)
    for i in range(6):
        C.tree((rnd.uniform(-12, 22), rnd.uniform(-30, -12), 0), height=rnd.uniform(5, 8), crown=rnd.uniform(2.4, 3.6),
               kind="oak" if i % 2 else "olive", seed=i + seed)
    for i in range(14):
        C.shrub((rnd.uniform(-10, 20), rnd.uniform(-7, -4.5), 0), r=rnd.uniform(0.4, 0.8))
    if hills_on:
        C.hills(center=(0, 500, -8), size=(3000, 700), height=90)
        # hills sit behind; also put some in front of the view for interiors that look out to -Y
        C.hills(center=(0, -600, -10), size=(3000, 700), height=110)


def sofa(x, y, z=0, w=2.8, color=(0.78, 0.73, 0.64), rot=0):
    m = C.mat_fabric("sofa", color)
    a = C.box("sofa", (x, y, z), (w, 1.0, 0.42), m, 0.07)
    b = C.box("sofab", (x, y + 0.78, z), (w, 0.24, 0.82), m, 0.07)
    C.box("arm", (x - 0.02, y, z), (0.22, 1.0, 0.62), m, 0.07)
    C.box("arm", (x + w - 0.2, y, z), (0.22, 1.0, 0.62), m, 0.07)
    C.box("cush", (x + 0.25, y + 0.1, z + 0.42), (w / 2 - 0.27, 0.75, 0.14), m, 0.06)
    C.box("cush", (x + w / 2 + 0.02, y + 0.1, z + 0.42), (w / 2 - 0.27, 0.75, 0.14), m, 0.06)


def pendant(x, y, z, r=0.22, cord_to=None):
    C.cylinder("shade", (x, y, z), r, 0.28, C.mat_plain("brass", (0.6, 0.42, 0.22), 0.3, 1.0), 24, r2=r * 0.35)
    C.cylinder("bulb", (x, y, z - 0.02), r * 0.5, 0.04, C.mat_emit("bulb", (1, 0.75, 0.45), 30), 16)
    if cord_to:
        C.cylinder("cord", (x, y, z + 0.28), 0.006, cord_to - z - 0.28, C.mat_plain("cord", (0.02, 0.02, 0.02)), 6)


def plant(x, y, h=1.6):
    C.cylinder("pot", (x, y, 0), 0.28, 0.5, C.mat_plain("pot", (0.55, 0.36, 0.25), 0.85), 24, r2=0.22)
    C.leaf_cloud("plant", (x, y, 0.5 + h * 0.45), h * 0.38, C.mat_leaf("leaf_shrub", *C.LEAVES["shrub"]),
                 squash=(1, 1, 1.25), n=1600, leaf=0.12, seed=int(x * 10 + y))


@shot("intro-living", 1600, 2000, 96)
def intro_living():
    C.reset()
    C.daylight(16, 160)
    garden_outside(seed=3)
    oak = C.mat_wood("floor", (0.5, 0.32, 0.17), axis="X", scale=0.8)
    st = C.mat_stucco("wall", (0.88, 0.86, 0.81))
    ceil = C.mat_wood("ceil", (0.52, 0.34, 0.18), axis="X", scale=0.6)
    stone = C.mat_stone("stone_in", (0.22, 0.19, 0.16), (0.42, 0.37, 0.31), scale=2.2)
    room(9, 8, 6.2, oak, st, ceil, mull=2.25, exposure=0.5)
    # stone fireplace wall on left
    C.box("fire_wall", (0, 1.0, 0), (0.6, 6.5, 6.2), stone, 0.01)
    C.box("firebox", (0.55, 3.4, 0.45), (0.1, 1.6, 0.7), C.mat_plain("soot", (0.01, 0.01, 0.01), 0.9), 0)
    C.box("fire", (0.5, 3.5, 0.5), (0.05, 1.4, 0.25), C.mat_emit("flame", (1, 0.45, 0.15), 8), 0)
    C.box("hearth", (0.6, 2.8, 0), (0.8, 2.8, 0.35), C.mat_travertine("trav", (0.76, 0.7, 0.6)), 0.01)
    sofa(2.8, 3.2, 0, w=3.2)
    C.box("rug", (2.0, 1.0, 0), (4.8, 3.6, 0.015), C.mat_fabric("rug", (0.72, 0.66, 0.57)), 0)
    C.box("ctable", (3.6, 1.6, 0), (1.5, 0.9, 0.36), C.mat_wood("oak_furn", (0.36, 0.2, 0.1)), 0.02)
    C.box("pouf", (6.4, 1.4, 0), (0.8, 0.8, 0.4), C.mat_fabric("chair", (0.45, 0.3, 0.22)), 0.12)
    plant(8.2, 4.5)
    C.camera((7.6, 7.3, 1.45), (2.5, -1, 2.6), lens=18)


@shot("riverstone-3", 2000, 1300, 80)
def riverstone_3():
    """Open-plan kitchen in natural oak with a long island, garden beyond the glass."""
    C.reset()
    C.daylight(22, 200)
    garden_outside(seed=5)
    floor = C.mat_travertine("floor", (0.8, 0.74, 0.65))
    st = C.mat_stucco("wall", (0.89, 0.87, 0.82))
    oak = C.mat_wood("oak", (0.5, 0.32, 0.17), axis="X", scale=0.8)
    oakv = C.mat_wood("oakv", (0.5, 0.32, 0.17), axis="Z", scale=0.8)
    stone = C.mat_travertine("counter", (0.86, 0.83, 0.77))
    room(12, 9, 3.4, floor, st, C.mat_wood("ceil", (0.55, 0.36, 0.19), axis="X", scale=0.6), mull=3.0, exposure=0.5)
    # tall oak cabinetry along back wall
    for i in range(10):
        C.box("tall", (1.0 + i * 0.62, 8.35, 0), (0.6, 0.65, 2.7), oakv, 0.006)
    C.box("niche", (3.5, 8.7, 0.95), (2.4, 0.3, 1.0), C.mat_stone("stone", (0.4, 0.36, 0.31), (0.62, 0.57, 0.5), scale=1.4), 0)
    C.box("niche_counter", (3.5, 8.35, 0.9), (2.4, 0.65, 0.05), stone, 0.005)
    # island
    C.box("island", (2.5, 4.4, 0), (5.0, 1.2, 0.88), oakv, 0.01)
    C.box("island_top", (2.4, 4.3, 0.88), (5.2, 1.4, 0.06), stone, 0.008)
    for k in range(4):
        C.cylinder("stool_leg", (3.2 + k * 1.1, 3.75, 0), 0.025, 0.62, C.mat_plain("blackmetal", (0.02, 0.02, 0.02), 0.4, 1), 8)
        C.cylinder("stool", (3.2 + k * 1.1, 3.75, 0.62), 0.2, 0.06, oak, 20)
    for k in range(3):
        pendant(3.4 + k * 1.6, 5.0, 2.3, cord_to=3.4)
    # dining table near glass
    C.box("dtable", (7.5, 1.4, 0.72), (3.0, 1.1, 0.05), oak, 0.01)
    for (x, y) in ((7.7, 1.5), (10.2, 1.5)):
        C.box("dleg", (x, y, 0), (0.1, 0.9, 0.72), oak, 0.005)
    plant(11.2, 6.5)
    C.box("bowl", (4.6, 4.7, 0.94), (0.5, 0.3, 0.08), C.mat_plain("ceramic", (0.75, 0.68, 0.58), 0.4), 0.03)
    C.camera((11.2, 8.4, 1.6), (3.5, 2.2, 1.0), lens=20)


@shot("sierra-3", 2000, 1300, 80)
def sierra_3():
    """Integrated home office with a view across the foothills."""
    C.reset()
    C.daylight(12, 210, aerosol=1.8)
    C.terrain(lambda x, y: -6 - max(0, -y - 4) * 0.12 + 1.5 * math.sin(x * 0.05), -300, 300, -400, 0, 120, 80,
              C.mat_grass("drygrass", (0.1, 0.085, 0.035), (0.24, 0.19, 0.08), 0.08))
    C.hills(center=(0, -700, -30), size=(3000, 800), height=160)
    rnd = random.Random(4)
    for i in range(14):
        x, y = rnd.uniform(-60, 60), rnd.uniform(-90, -12)
        C.tree((x, y, -6 - max(0, -y - 4) * 0.12 + 1.5 * math.sin(x * 0.05)), height=7, crown=3.5, kind="oak", seed=i)
    floor = C.mat_wood("floor", (0.42, 0.26, 0.13), axis="X", scale=0.8)
    st = C.mat_stucco("wall", (0.86, 0.84, 0.79))
    walnut = C.mat_wood("walnut", (0.24, 0.14, 0.08), axis="X")
    room(6, 5, 3.0, floor, st, C.mat_stucco("ceilw", (0.9, 0.89, 0.86)), mull=3.0, exposure=0.4,
         back_mat=C.mat_wood("panel", (0.4, 0.24, 0.12), axis="Z"))
    C.box("terrace", (-5, -3.0, -0.25), (16, 3.0, 0.25), C.mat_travertine("trav", (0.72, 0.66, 0.57)), 0)
    C.plane("rail", (3, -2.95, 0.55), (16, 1.1), C.mat_glass(), rot=(math.pi / 2, 0, 0))
    # desk facing the view
    C.box("desk", (1.2, 1.0, 0.72), (3.2, 0.85, 0.05), walnut, 0.01)
    C.box("desk_leg", (1.25, 1.05, 0), (0.06, 0.75, 0.72), walnut, 0)
    C.box("desk_leg", (4.3, 1.05, 0), (0.06, 0.75, 0.72), walnut, 0)
    C.box("chair", (2.4, 2.1, 0.42), (0.6, 0.6, 0.08), C.mat_fabric("leather", (0.3, 0.17, 0.09)), 0.03)
    C.box("chairback", (2.4, 2.6, 0.5), (0.6, 0.08, 0.6), C.mat_fabric("leather", (0.3, 0.17, 0.09)), 0.03)
    C.cylinder("chairbase", (2.7, 2.4, 0), 0.03, 0.42, C.mat_plain("blackmetal", (0.02, 0.02, 0.02), 0.4, 1), 8)
    C.box("laptop", (2.3, 1.3, 0.77), (0.36, 0.25, 0.015), C.mat_plain("alu", (0.5, 0.5, 0.5), 0.35, 1), 0.003)
    C.box("books", (3.5, 1.5, 0.77), (0.3, 0.22, 0.1), C.mat_plain("book", (0.55, 0.3, 0.2), 0.8), 0.005)
    C.cylinder("lamp", (1.5, 1.5, 0.77), 0.08, 0.45, C.mat_plain("brass", (0.6, 0.42, 0.22), 0.3, 1.0), 16)
    # shelving on right wall
    for k in range(5):
        C.box("shelf", (5.62, 1.5, 0.4 + k * 0.5), (0.35, 3.0, 0.04), walnut, 0.005)
        for j in range(6):
            if (j + k) % 3:
                C.box("book", (5.66, 1.6 + j * 0.45, 0.44 + k * 0.5), (0.25, 0.08 + (j % 2) * 0.06, 0.32),
                      C.mat_plain(f"bk{(j + k) % 3}", [(0.5, 0.42, 0.32), (0.2, 0.25, 0.22), (0.6, 0.55, 0.48)][(j + k) % 3], 0.8), 0.003)
    plant(0.6, 4.2, 1.3)
    C.camera((4.6, 4.6, 1.5), (2.2, -2.0, 0.9), lens=20)


@shot("sierra-4", 2000, 1300, 80)
def sierra_4():
    """Primary suite with a full glass wall to the hills."""
    C.reset()
    C.daylight(10, 230, aerosol=1.9)
    C.terrain(lambda x, y: -6 - max(0, -y - 4) * 0.12 + 1.5 * math.sin(x * 0.05), -300, 300, -400, 0, 120, 80,
              C.mat_grass("drygrass", (0.1, 0.085, 0.035), (0.24, 0.19, 0.08), 0.08))
    C.hills(center=(0, -700, -30), size=(3000, 800), height=160)
    rnd = random.Random(8)
    for i in range(12):
        x, y = rnd.uniform(-60, 60), rnd.uniform(-90, -12)
        C.tree((x, y, -6 - max(0, -y - 4) * 0.12 + 1.5 * math.sin(x * 0.05)), height=7, crown=3.5, kind="oak", seed=i + 20)
    floor = C.mat_wood("floor", (0.5, 0.33, 0.18), axis="X", scale=0.8)
    st = C.mat_stucco("wall", (0.88, 0.86, 0.81))
    room(8, 6.5, 3.2, floor, st, C.mat_wood("ceil", (0.55, 0.36, 0.19), axis="X", scale=0.6), mull=2.0, exposure=0.45,
         back_mat=C.mat_wood("panel", (0.46, 0.29, 0.15), axis="Z"))
    C.box("terrace", (-5, -3.0, -0.25), (18, 3.0, 0.25), C.mat_travertine("trav", (0.72, 0.66, 0.57)), 0)
    lin = C.mat_fabric("linen", (0.88, 0.86, 0.81))
    # bed against back wall, facing the glass
    C.box("bedbase", (2.4, 4.0, 0), (2.2, 2.3, 0.35), C.mat_wood("oak_furn", (0.36, 0.2, 0.1)), 0.02)
    C.box("mattress", (2.45, 4.05, 0.35), (2.1, 2.2, 0.25), lin, 0.06)
    C.box("duvet", (2.4, 4.0, 0.5), (2.2, 1.5, 0.14), lin, 0.07)
    C.box("throw", (2.38, 4.0, 0.62), (2.24, 0.5, 0.05), C.mat_fabric("throw", (0.55, 0.36, 0.25)), 0.02)
    C.box("headboard", (2.2, 6.2, 0), (2.6, 0.12, 1.2), C.mat_fabric("head", (0.7, 0.64, 0.55)), 0.04)
    for x in (2.65, 3.75):
        C.box("pillow", (x, 5.7, 0.6), (0.85, 0.4, 0.2), lin, 0.08)
    for x in (1.5, 4.85):
        C.box("night", (x, 5.6, 0), (0.6, 0.45, 0.5), C.mat_wood("oak_furn", (0.36, 0.2, 0.1)), 0.02)
        pendant(x + 0.3, 5.8, 1.5, r=0.14, cord_to=3.2)
    C.box("rug", (1.6, 2.6, 0), (3.8, 2.4, 0.015), C.mat_fabric("rug", (0.7, 0.64, 0.55)), 0)
    C.box("lounge", (6.0, 1.0, 0), (1.0, 1.4, 0.4), C.mat_fabric("chair", (0.62, 0.5, 0.4)), 0.1)
    C.camera((7.4, 6.0, 1.55), (2.5, 0.5, 0.7), lens=20)


@shot("oakmeadow-3", 2000, 1300, 80)
def oakmeadow_3():
    """Farmhouse kitchen: large custom island, warm white cabinetry, oak beams."""
    C.reset()
    C.daylight(20, 200)
    garden_outside(seed=9)
    floor = C.mat_wood("floor", (0.5, 0.33, 0.18), axis="X", scale=0.8)
    st = C.mat_boards("wallboards", (0.88, 0.87, 0.83), spacing=6)
    oak = C.mat_wood("oak", (0.45, 0.28, 0.14), axis="X")
    cab = C.mat_plain("cabinet", (0.36, 0.42, 0.37), 0.5)  # muted sage-forest cabinetry
    marble = C.mat_travertine("counter", (0.9, 0.88, 0.85))
    room(11, 8, 3.6, floor, st, C.mat_stucco("ceilw", (0.9, 0.89, 0.86)), mull=1.4, sill=0.9, exposure=0.55)
    for i in range(5):
        C.box("beam", (-0.3, 0.8 + i * 1.6, 3.32), (11.6, 0.25, 0.28), oak, 0.01)
    # perimeter cabinetry along back
    C.box("base", (1.0, 7.35, 0), (8.5, 0.65, 0.9), cab, 0.01)
    C.box("ctop", (1.0, 7.3, 0.9), (8.5, 0.7, 0.05), marble, 0.005)
    for i in range(8):
        C.box("door", (1.05 + i * 1.06, 7.32, 0.1), (1.0, 0.02, 0.75), cab, 0.004)
    C.box("hood", (4.4, 7.4, 2.0), (1.6, 0.6, 1.6), C.mat_stucco("hood", (0.9, 0.89, 0.85)), 0.02)
    C.box("shelf", (1.2, 7.7, 1.7), (2.6, 0.3, 0.05), oak, 0.005)
    C.box("shelf", (6.4, 7.7, 1.7), (2.6, 0.3, 0.05), oak, 0.005)
    for j in range(5):
        C.cylinder("jar", (1.5 + j * 0.45, 7.85, 1.75), 0.09, 0.22 + (j % 2) * 0.08,
                   C.mat_plain("ceramic", (0.78, 0.72, 0.62), 0.4), 16)
    # big island
    C.box("island", (2.6, 3.6, 0), (5.2, 1.6, 0.9), cab, 0.01)
    C.box("itop", (2.45, 3.45, 0.9), (5.5, 1.9, 0.07), marble, 0.01)
    for k in range(4):
        C.box("stool", (3.0 + k * 1.25, 2.85, 0), (0.45, 0.45, 0.68), oak, 0.03)
    for k in range(2):
        pendant(3.8 + k * 2.6, 4.4, 2.3, r=0.3, cord_to=3.3)
    C.box("bread", (4.2, 4.1, 0.97), (0.6, 0.4, 0.04), oak, 0.01)
    plant(10.1, 6.6)
    C.camera((10.3, 1.0, 1.55), (4.5, 5.8, 1.1), lens=20)
