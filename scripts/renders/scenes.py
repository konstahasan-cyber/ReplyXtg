"""Shot registry. Usage:

    python scenes.py hero sierra-1 ...        # final renders
    python scenes.py --preview hero           # quick low-res check (writes preview_<name>.jpg)
    python scenes.py --all
"""
import math
import os
import random
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import common as C  # noqa: E402
import houses as H  # noqa: E402

PREVIEW = False
SHOTS = C.SHOTS
shot = C.shot


def out(name, w, h, samples):
    if PREVIEW:
        C.render("preview_" + name, w // 2, h // 2, samples=24)
    else:
        # RENDER_SCALE / RENDER_SAMPLES allow fast drafts (render small, upscale to final size)
        C.render(name, w, h, samples=int(os.environ.get("RENDER_SAMPLES", samples)),
                 scale=float(os.environ.get("RENDER_SCALE", 1.0)))


# ----------------------------------------------------------------------- exteriors

def golden_exterior(left_trees=True):
    C.reset()
    C.daylight(6, 140, aerosol=2.0)
    H.landscape_base()
    H.contemporary(left_trees=left_trees)


@shot("hero", 2400, 1350, 64)
def hero():
    golden_exterior(left_trees=False)
    C.camera((3, -25, 1.3), (12, 0, 2.8), lens=28, shift_x=-0.24, shift_y=0.05)


@shot("final-cta", 2400, 1350, 64)
def final_cta():
    C.reset()
    C.world_gradient(top=(0.004, 0.008, 0.02), bottom=(0.06, 0.05, 0.07), strength=1.0)
    C.sun(elevation=8, rotation=80, strength=0.08, color=(0.5, 0.6, 1.0))
    H.landscape_base(grass=C.mat_grass("lawn_n", (0.02, 0.03, 0.015), (0.05, 0.06, 0.03), 0.15))
    H.contemporary(night=True)
    C.camera((24, -30, 1.5), (9, 0, 3.4), lens=30, shift_x=0.18, shift_y=0.06)


@shot("riverstone-1", 2000, 1300, 64)
def riverstone_1():
    C.reset()
    C.daylight(24, 200)
    H.landscape_base()
    H.contemporary(glow=0.8)
    C.camera((-14, -22, 2.2), (9, 0, 2.8), lens=26)


@shot("riverstone-2", 2000, 1300, 64)
def riverstone_2():
    """Private courtyard: enclosed by glass walls on two sides, olive tree, pavers, water rill."""
    C.reset()
    C.daylight(34, 150)
    st = C.mat_stucco("stucco", (0.86, 0.83, 0.77))
    trav = C.mat_travertine("trav", (0.78, 0.72, 0.62))
    oak = C.mat_wood("oak", (0.44, 0.26, 0.13))
    oaks = C.mat_wood("oak_soffit", (0.5, 0.31, 0.16), axis="X", scale=0.6)
    glass = C.mat_glass("glass")
    inner = C.mat_interior_glow("inner", (1.0, 0.7, 0.45), 0.7, (0.72, 0.64, 0.54))
    C.plane("ground", (0, 0, -0.01), (200, 200), C.mat_grass())
    C.box("pavers", (-8, -8, 0), (16, 16, 0.05), trav, 0)
    # pavers grid joints
    jm = C.mat_plain("joint", (0.25, 0.23, 0.2), 0.9)
    for i in range(-8, 9, 2):
        C.box("j", (i - 0.01, -8, 0.05), (0.02, 16, 0.002), jm, 0)
        C.box("j", (-8, i - 0.01, 0.05), (16, 0.02, 0.002), jm, 0)
    # back wing (glass) along +Y
    C.box("back_in", (-8, 9.5, 0.05), (16, 0.2, 3.2), inner, 0)
    C.box("back_floor", (-8, 6, 0.05), (16, 4, 0.02), C.mat_wood("floor_in", (0.5, 0.32, 0.17), axis="X"), 0)
    C.window_wall(-8, 6.0, 0.05, 16, 3.1, mullion=2.0, glass=glass)
    C.box("roof_b", (-9, 5.0, 3.15), (18, 6, 0.35), st, 0.02)
    C.box("soffit_b", (-9, 4.98, 3.13), (18, 1.2, 0.02), oaks, 0)
    # right wing glass, left wing stucco + slats
    C.box("right_in", (9.5, -8, 0.05), (0.2, 14, 3.2), inner, 0)
    C.window_wall(-8, 6.0, 0.05, 14, 3.1, mullion=2.0, glass=glass, axis="Y")
    C.box("right_roof", (5.0, -9, 3.15), (6, 15, 0.35), st, 0.02)
    C.window_wall(-8, 6.0, 0.05, 1, 1, glass=glass, axis="Y") if False else None
    C.box("left_wall", (-10, -9, 0.0), (2, 15, 3.4), st, 0.02)
    C.slats(-8, -7.9, 0.05, 13.5, 3.2, mat=oak, axis="Y")
    C.box("rill", (-1.2, -8, 0.0), (0.6, 12, 0.06), C.mat_water("rill"), 0)
    C.box("rill_edge", (-1.3, -8, 0.0), (0.8, 12, 0.055), C.mat_stone("stone", (0.3, 0.28, 0.25), (0.45, 0.42, 0.37)), 0)
    # planter + olive tree
    C.box("planter", (1.0, 0.5, 0.0), (3.4, 3.4, 0.55), C.mat_stone("stone"), 0.02)
    C.box("soil", (1.15, 0.65, 0.5), (3.1, 3.1, 0.06), C.mat_gravel("bark_mulch", (0.18, 0.13, 0.09)), 0)
    C.tree((2.7, 2.2, 0.5), height=5.0, crown=2.3, seed=8)
    for p in ((-5, 3), (-4.3, 3.6), (4.5, -5.5)):
        C.shrub((p[0], p[1], 0.05), r=0.55)
    # lounge chairs
    fab = C.mat_fabric("cushion", (0.82, 0.78, 0.7))
    for i, x in enumerate((-6.0, -3.6)):
        C.box("lounger", (x, -4.5, 0.05), (0.8, 2.0, 0.3), oak, 0.02)
        C.box("cush", (x + 0.05, -4.45, 0.35), (0.7, 1.9, 0.1), fab, 0.03)
    C.camera((-6.5, -7.5, 1.6), (2.5, 3.5, 1.7), lens=22)


@shot("riverstone-4", 2000, 1300, 64)
def riverstone_4():
    """Indoor-outdoor: from the living room through fully open sliders to terrace + pool."""
    C.reset()
    C.daylight(20, 190)
    H.landscape_base(hills_on=True)
    st = C.mat_stucco("stucco", (0.88, 0.85, 0.8))
    oaks = C.mat_wood("oak_soffit", (0.5, 0.31, 0.16), axis="X", scale=0.6)
    floor = C.mat_travertine("floor", (0.8, 0.74, 0.65))
    glass = C.mat_glass("glass")
    # room: x[-6,6], y[0,8], open at y=0 toward -Y (garden)
    C.box("floor", (-12, -14, 0), (24, 22, 0.1), floor, 0)
    C.box("ceil", (-6.5, -3.2, 3.1), (13, 11.6, 0.3), oaks, 0.01)
    C.box("roofslab", (-6.6, -3.3, 3.4), (13.2, 11.8, 0.3), st, 0.02)
    C.box("backwall", (-6.5, 8, 0), (13, 0.3, 3.4), st, 0)
    C.box("leftwall", (-6.5, 0, 0), (0.3, 8, 3.4), C.mat_stone("stone", (0.4, 0.36, 0.31), (0.62, 0.57, 0.5)), 0.01)
    # sliders stacked at the right end (open)
    for i in range(3):
        C.window_wall(4.8 + i * 0.12, 0.2 + i * 0.12, 0.1, 0.0, 0.0) if False else None
        C.plane("slider", (5.6, 0.25 + i * 0.12, 1.55), (1.6, 2.95), glass, rot=(math.pi / 2, 0, 0))
        C.box("sframe", (4.8, 0.2 + i * 0.12, 0.1), (0.04, 0.05, 2.95), C.mat_plain("frame", (0.025, 0.027, 0.026), 0.4, 0.5), 0)
    C.box("rightwall", (6.2, 0, 0), (0.3, 8, 3.4), st, 0)
    # furniture
    sofa = C.mat_fabric("sofa", (0.78, 0.73, 0.64))
    C.box("sofa", (-3.5, 2.6, 0.1), (3.4, 1.0, 0.42), sofa, 0.07)
    C.box("sofab", (-3.5, 3.4, 0.1), (3.4, 0.25, 0.85), sofa, 0.07)
    C.box("rug", (-4.5, 0.4, 0.1), (5, 3.6, 0.015), C.mat_fabric("rug", (0.7, 0.64, 0.55)), 0)
    C.box("ctable", (-2.6, 1.0, 0.1), (1.4, 0.9, 0.38), C.mat_wood("oak_furn", (0.36, 0.2, 0.1)), 0.02)
    C.box("bench", (1.0, 6.9, 0.1), (4, 0.6, 0.45), C.mat_wood("oak", (0.44, 0.26, 0.13)), 0.02)
    # terrace outside
    C.box("terr_edge", (-12, -14, 0), (24, 0.1, 0.1), floor, 0)
    C.box("pool_c", (-5, -10.2, 0), (14, 4.6, 0.12), floor, 0.01)
    C.box("pool", (-4.7, -9.9, 0.0), (13.4, 4.0, 0.125), C.mat_water("pool"), 0)
    fab = C.mat_fabric("cushion", (0.82, 0.78, 0.7))
    for x in (-3.0, -1.3):
        C.box("lounger", (x, -4.8, 0.1), (0.8, 2.0, 0.3), C.mat_wood("oak"), 0.02)
        C.box("cush", (x + 0.05, -4.75, 0.4), (0.7, 1.9, 0.1), fab, 0.03)
    C.tree((-9, -7, 0.1), height=5, crown=2.5, seed=3)
    C.tree((10, -12, 0.1), height=6, crown=3.0, kind="oak", seed=4)
    rnd = random.Random(2)
    for i in range(10):
        C.shrub((rnd.uniform(-11, 11), rnd.uniform(-13.5, -12.5), 0.1), r=rnd.uniform(0.4, 0.7))
    C.area_light((0, 1, 2.9), (0, 1, 0), size=6, size_y=4, energy=120, color=(1, 0.85, 0.7))
    C.camera((-1.0, 7.2, 1.35), (0.5, -6, 1.1), lens=20)


def hillside_day():
    C.reset()
    C.daylight(14, 235)
    H.hillside()


@shot("sierra-1", 2000, 1300, 64)
def sierra_1():
    hillside_day()
    C.camera((-12, -27, -2.2), (10, 0, 1.2), lens=28)


@shot("sierra-2", 2000, 1300, 64)
def sierra_2():
    """Outdoor entertainment terrace looking out across the valley."""
    C.reset()
    C.daylight(9, 250)
    H.hillside()
    oak = C.mat_wood("oak", (0.44, 0.26, 0.13))
    fab = C.mat_fabric("cushion", (0.8, 0.76, 0.68))
    # outdoor sofa + dining on terrace
    C.box("osofa", (2, -5.6, 0.2), (3.2, 0.9, 0.4), fab, 0.08)
    C.box("osofab", (2, -5.6, 0.2), (0.4, 2.6, 0.75), fab, 0.08) if False else None
    C.box("table", (8, -5.0, 0.2), (2.6, 1.0, 0.75), oak, 0.02)
    for k in range(3):
        C.box("chair", (8.1 + k * 0.85, -5.6, 0.2), (0.5, 0.5, 0.45), oak, 0.02)
        C.box("chair", (8.1 + k * 0.85, -3.9, 0.2), (0.5, 0.5, 0.45), oak, 0.02)
    C.box("firepit", (4.0, -4.8, 0.2), (1.6, 0.8, 0.35), C.mat_stone("stone_dark"), 0.02)
    C.box("fire", (4.2, -4.7, 0.55), (1.2, 0.6, 0.02), C.mat_emit("fire", (1, 0.45, 0.15), 6), 0)
    C.camera((19, 3.6, 1.8), (2, -9, 0.6), lens=22)


def farm_day():
    C.reset()
    C.daylight(18, 215)
    H.landscape_base()
    H.farmhouse()


@shot("oakmeadow-1", 2000, 1300, 64)
def oakmeadow_1():
    farm_day()
    C.camera((-6, -19, 1.5), (9, 2, 3.4), lens=26)


@shot("oakmeadow-2", 2000, 1300, 64)
def oakmeadow_2():
    """Covered outdoor living under the porch roof."""
    farm_day()
    fab = C.mat_fabric("cushion", (0.82, 0.78, 0.7))
    oak = C.mat_wood("oak_furn", (0.36, 0.2, 0.1))
    C.box("osofa", (7.2, -1.2, 0.3), (2.6, 0.9, 0.42), fab, 0.08)
    C.box("osofab", (7.2, -0.45, 0.3), (2.6, 0.2, 0.8), fab, 0.08)
    C.box("otable", (7.8, -2.4, 0.3), (1.2, 0.7, 0.36), oak, 0.02)
    C.box("chair", (11.0, -2.0, 0.3), (0.8, 0.8, 0.42), fab, 0.06)
    C.box("planterp", (13.4, -2.2, 0.3), (0.6, 0.6, 0.7), C.mat_plain("pot", (0.45, 0.28, 0.2), 0.8), 0.03)
    C.shrub((13.7, -1.9, 1.0), r=0.5)
    C.camera((17.5, -6.8, 1.5), (7.5, -0.5, 1.3), lens=24)


@shot("oakmeadow-4", 2000, 1300, 64)
def oakmeadow_4():
    """Large landscaped backyard: lawn, oak trees, garden beds, house beyond."""
    farm_day()
    rnd = random.Random(77)
    for i in range(10):
        C.shrub((rnd.uniform(-6, 26), rnd.uniform(-20, -16), 0.0), r=rnd.uniform(0.5, 0.9),
                mat=C.mat_leaf("leaf_lavender", (0.14, 0.11, 0.2), (0.3, 0.25, 0.4)) if i % 3 == 0 else None)
    C.tree((-2, -26, 0), height=8.5, crown=4.5, kind="oak", seed=71)
    C.tree((22, -30, 0), height=7.5, crown=3.8, kind="oak", seed=72)
    C.box("bed", (-6, -21, 0), (32, 5.5, 0.06), C.mat_gravel("bark_mulch", (0.18, 0.13, 0.09)), 0)
    C.camera((10, -46, 1.6), (9, 0, 3.0), lens=30)


@shot("style-california-modern", 1000, 750, 56)
def style_cm():
    golden_exterior()
    C.camera((-10, -26, 1.6), (10, 0, 3.0), lens=30)


@shot("style-modern-farmhouse", 1000, 750, 56)
def style_mf():
    farm_day()
    C.camera((-4, -26, 1.7), (8, 2, 3.4), lens=32)


@shot("style-contemporary-luxury", 1000, 750, 56)
def style_cl():
    C.reset()
    C.daylight(4, 250)
    H.hillside(night=False)
    C.camera((26, -26, -3), (8, 0, 2), lens=30)


@shot("style-mediterranean", 1000, 750, 56)
def style_med():
    C.reset()
    C.daylight(22, 220)
    H.landscape_base()
    H.mediterranean()
    C.camera((-6, -26, 1.7), (10, 2, 3.6), lens=30)


@shot("service-custom", 1200, 1500, 64)
def service_custom():
    golden_exterior()
    C.camera((12, -11, 1.4), (18, 2, 4.0), lens=24)


@shot("service-luxury", 1200, 1500, 64)
def service_luxury():
    C.reset()
    C.world_gradient(top=(0.004, 0.008, 0.02), bottom=(0.06, 0.05, 0.07))
    H.landscape_base(grass=C.mat_grass("lawn_n", (0.02, 0.03, 0.015), (0.05, 0.06, 0.03), 0.15))
    H.contemporary(night=True)
    C.camera((5, -16, 1.0), (10, 0, 3.6), lens=24)


def main(argv):
    global PREVIEW
    names = [a for a in argv if not a.startswith("--")]
    if "--preview" in argv:
        PREVIEW = True
    if "--all" in argv:
        names = list(SHOTS)
    try:
        import interiors  # noqa: F401  registers interior shots
        import studies  # noqa: F401
    except ImportError as e:
        print("note:", e)
    for n in names:
        fn, w, h, smp = SHOTS[n]
        print("=== ", n)
        fn()
        out(n, w, h, smp)


if __name__ == "__main__":
    main(sys.argv[1:])
