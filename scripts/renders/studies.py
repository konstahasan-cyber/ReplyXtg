"""Material and model studies: detail close-up, massing models, timber frame."""
import math
import random

import bpy

import common as C
from common import shot


def studio(top=(0.22, 0.21, 0.2), bottom=(0.14, 0.13, 0.12), strength=0.5, exposure=-1.2):
    C.world_gradient(top=top, bottom=bottom, strength=strength)
    bpy.context.scene.view_settings.exposure = exposure


def model_white():
    return C.mat_plain("modelwhite", (0.82, 0.8, 0.76), 0.85, spec=0.3)


def model_oak():
    return C.mat_wood("modeloak", (0.55, 0.38, 0.22), scale=3.0)


def massing_house(ox, oy, s=1.0, kind="flat", mat=None, rot=0.0):
    """Small architectural massing model (units: metres at model scale)."""
    mat = mat or model_white()
    if kind == "flat":
        C.box("m", (ox, oy, 0), (0.6 * s, 0.32 * s, 0.11 * s), mat, 0.002)
        C.box("m", (ox + 0.22 * s, oy + 0.05 * s, 0.11 * s), (0.36 * s, 0.24 * s, 0.1 * s), mat, 0.002)
        C.box("m", (ox - 0.04 * s, oy - 0.06 * s, 0.11 * s), (0.7 * s, 0.42 * s, 0.012 * s), mat, 0.001)
    elif kind == "gable":
        C.gable_prism("g", (ox + 0.25 * s, oy + 0.15 * s, 0), 0.5 * s, 0.3 * s, 0.12 * s, 0.12 * s, mat, mat,
                      overhang=0.01 * s, roof_t=0.008 * s)
        C.gable_prism("g2", (ox + 0.62 * s, oy + 0.2 * s, 0), 0.25 * s, 0.24 * s, 0.09 * s, 0.08 * s, mat, mat,
                      overhang=0.01 * s, axis="Y", roof_t=0.008 * s)
    elif kind == "court":
        C.box("m", (ox, oy, 0), (0.6 * s, 0.1 * s, 0.1 * s), mat, 0)
        C.box("m", (ox, oy + 0.1 * s, 0), (0.1 * s, 0.3 * s, 0.1 * s), mat, 0)
        C.box("m", (ox, oy + 0.4 * s, 0), (0.6 * s, 0.1 * s, 0.16 * s), mat, 0)
    elif kind == "tower":
        C.box("m", (ox, oy, 0), (0.28 * s, 0.28 * s, 0.32 * s), mat, 0.002)
        C.box("m", (ox + 0.28 * s, oy, 0), (0.36 * s, 0.26 * s, 0.12 * s), mat, 0.002)
    elif kind == "curve":
        C.cylinder("m", (ox + 0.2 * s, oy + 0.2 * s, 0), 0.2 * s, 0.12 * s, mat, 48)
        C.box("m", (ox + 0.2 * s, oy + 0.001, 0), (0.4 * s, 0.398 * s, 0.08 * s), mat, 0)


def table(mat=None, z=0.0, size=6):
    mat = mat or C.mat_wood("tabletop", (0.5, 0.33, 0.18), axis="X", scale=2.0, planks=False)
    C.box("table", (-size / 2, -size / 2, z - 0.05), (size, size, 0.05), mat, 0.004)


@shot("intro-detail", 1400, 1400, 96)
def intro_detail():
    """Close material study: vertical oak slats over a travertine wall, raking warm light."""
    C.reset()
    C.daylight(22, 250)
    bpy.context.scene.view_settings.exposure = -0.6
    trav = C.mat_travertine("trav_d", (0.8, 0.73, 0.62))
    oak = C.mat_wood("oak_d", (0.48, 0.29, 0.15), scale=2.5)
    # travertine wall in big format slabs (with joints)
    for i in range(8):
        for j in range(8):
            C.box("slab", (-3.2 + i * 0.8, 0.0, -0.12 + j * 0.4), (0.795, 0.08, 0.395), trav, 0.003)
    # slats in front, partially covering the wall
    for k in range(14):
        C.box("slat", (0.05 + k * 0.085, -0.12, -0.1), (0.04, 0.07, 2.0), oak, 0.004)
    # floor slab and gravel
    C.box("floorslab", (-2, -1.5, -0.12), (4, 1.6, 0.06), trav, 0.005)
    C.box("gravel", (-2, -3, -0.13), (4, 1.6, 0.04), C.mat_gravel("gravel", (0.5, 0.46, 0.4)), 0)
    C.grass_tuft((-0.9, -0.55, -0.08), r=0.28)
    C.grass_tuft((-0.55, -0.75, -0.08), r=0.2)
    C.camera((-1.0, -2.4, 0.8), (0.3, 0, 0.75), lens=60, dof=2.7, fstop=5.6)


@shot("about", 2000, 1300, 80)
def about():
    """Architectural study model on a studio table, soft window light."""
    C.reset()
    studio()
    table()
    base = C.mat_plain("cork", (0.45, 0.34, 0.22), 0.9)
    C.box("base", (-0.7, -0.45, 0), (1.4, 0.9, 0.025), base, 0.002)
    # site contours
    w = model_white()
    for k in range(4):
        C.box("contour", (-0.7 + k * 0.03, 0.1 + k * 0.08, 0.025 + k * 0.006), (1.4 - k * 0.06, 0.35 - k * 0.08, 0.006), w, 0.001)
    massing_house(-0.35, -0.25, 1.0, "flat")
    oak = model_oak()
    for k in range(12):
        C.box("mslat", (0.12 + k * 0.012, -0.258, 0.11), (0.005, 0.008, 0.1), oak, 0)
    rnd = random.Random(2)
    tree_m = C.mat_plain("modeltree", (0.3, 0.33, 0.25), 0.8)
    for i in range(7):
        x, y = rnd.uniform(-0.65, 0.65), rnd.uniform(-0.42, -0.3) if i % 2 else rnd.uniform(0.15, 0.4)
        C.cylinder("stem", (x, y, 0.025), 0.002, 0.05, tree_m, 6)
        C.blob("mtree", (x, y, 0.09), 0.035, tree_m, noise=0.2, subdiv=2, fine=0)
    # drawings + scale ruler on the table
    paper = C.mat_plain("paper", (0.86, 0.85, 0.82), 0.9)
    C.box("sheet", (0.85, -0.6, 0), (0.6, 0.42, 0.002), paper, 0, rot=(0, 0, 0.12))
    C.box("sheet2", (0.95, -0.35, 0.002), (0.6, 0.42, 0.002), paper, 0, rot=(0, 0, -0.05))
    ink = C.mat_plain("ink", (0.12, 0.13, 0.13), 0.8)
    for k in range(6):
        C.box("line", (1.0 + k * 0.07, -0.25, 0.0045), (0.003, 0.3, 0.0005), ink, 0)
    C.box("line", (1.0, -0.25, 0.0045), (0.36, 0.003, 0.0005), ink, 0)
    C.box("pencil", (0.85, -0.75, 0.0), (0.18, 0.008, 0.008), C.mat_plain("pencil", (0.16, 0.22, 0.18), 0.5), 0.002, rot=(0, 0, 0.5))
    C.area_light((-2.5, -1.2, 2.2), (0, 0, 0), size=2.5, energy=260, color=(1, 0.9, 0.78))
    C.area_light((2, 2, 2.5), (0, 0, 0), size=3, energy=35, color=(0.85, 0.9, 1.0))
    C.camera((1.15, -1.45, 0.62), (-0.05, 0.0, 0.08), lens=50, dof=1.75, fstop=4.0)


@shot("service-planning", 1200, 1500, 80)
def service_planning():
    """Site model with drawings: plan coordination."""
    C.reset()
    studio()
    table()
    paper = C.mat_plain("paper", (0.86, 0.85, 0.82), 0.9)
    ink = C.mat_plain("ink", (0.14, 0.15, 0.15), 0.8)
    C.box("sheet", (-0.6, -0.5, 0), (1.0, 0.7, 0.002), paper, 0)
    # plan drawing lines
    for (x, y, w_, h_) in ((-0.5, -0.4, 0.8, 0.003), (-0.5, -0.4, 0.003, 0.5), (0.3, -0.4, 0.003, 0.5),
                           (-0.5, 0.1, 0.8, 0.003), (-0.2, -0.4, 0.003, 0.3), (-0.2, -0.1, 0.5, 0.003),
                           (0.05, -0.1, 0.003, 0.2), (-0.5, -0.25, 0.3, 0.003)):
        C.box("ink", (x, y, 0.002), (w_, h_, 0.0005), ink, 0)
    C.box("sheet2", (0.25, -0.15, 0.003), (0.7, 0.5, 0.002), C.mat_plain("trace", (0.8, 0.79, 0.74), 0.9), 0, rot=(0, 0, 0.18))
    massing_house(0.35, 0.05, 0.75, "court")
    massing_house(-0.4, 0.25, 0.6, "flat", mat=model_oak())
    C.box("ruler", (-0.75, -0.62, 0.002), (0.6, 0.03, 0.006), C.mat_plain("ruler", (0.7, 0.66, 0.6), 0.4), 0.001, rot=(0, 0, 0.05))
    C.area_light((-2.0, -1.0, 2.4), (0, 0, 0), size=2.5, energy=260, color=(1, 0.9, 0.78))
    C.area_light((2, 2, 2.5), (0, 0, 0), size=3, energy=35, color=(0.85, 0.9, 1.0))
    C.camera((0.25, -1.25, 1.15), (0.0, 0.0, 0.0), lens=42, dof=1.65, fstop=5.6)


@shot("style-not-sure", 1000, 750, 64)
def style_not_sure():
    """Row of white massing models in different forms."""
    C.reset()
    studio(top=(0.3, 0.29, 0.27), bottom=(0.2, 0.19, 0.17))
    table(C.mat_plain("plinth", (0.42, 0.38, 0.33), 0.9))
    kinds = ["gable", "flat", "tower", "court", "curve"]
    for i, k in enumerate(kinds):
        massing_house(-1.6 + i * 0.7, -0.15 + (i % 2) * 0.25, 0.85, k, rot=0)
    C.area_light((-2.5, -1.5, 2.4), (0, 0, 0), size=3, energy=300, color=(1, 0.9, 0.78))
    C.area_light((2.5, 1.5, 2.5), (0, 0, 0), size=3, energy=50, color=(0.85, 0.9, 1.0))
    C.camera((0.1, -2.7, 0.7), (0.1, 0.05, 0.06), lens=48, dof=2.75, fstop=8)


@shot("service-designbuild", 1200, 1500, 64)
def service_designbuild():
    """Timber frame under construction on a slab, golden light: design and build as one process."""
    C.reset()
    C.daylight(9, 135, aerosol=2.0)
    C.plane("ground", (0, 0, 0), (600, 600), C.mat_grass("drygrass", (0.07, 0.07, 0.03), (0.17, 0.15, 0.07), 0.08))
    C.hills(center=(0, 650, -8), size=(3000, 700), height=90)
    slab = C.mat_plain("concrete", (0.45, 0.43, 0.4), 0.8)
    stud = C.mat_wood("stud", (0.62, 0.45, 0.28), scale=1.5)
    C.box("slab", (-1, -1, 0), (14, 10, 0.3), slab, 0.01)
    # wall stud frames
    def wall_x(x0, y, length, h=3.0):
        n = int(length / 0.6)
        for i in range(n + 1):
            C.box("stud", (x0 + i * length / n, y, 0.3), (0.045, 0.14, h), stud, 0.004)
        C.box("plate", (x0, y, 0.3), (length + 0.045, 0.14, 0.045), stud, 0.004)
        C.box("plate", (x0, y, 0.3 + h), (length + 0.045, 0.14, 0.09), stud, 0.004)

    def wall_y(x, y0, length, h=3.0):
        n = int(length / 0.6)
        for i in range(n + 1):
            C.box("stud", (x, y0 + i * length / n, 0.3), (0.14, 0.045, h), stud, 0.004)
        C.box("plate", (x, y0, 0.3), (0.14, length + 0.045, 0.045), stud, 0.004)
        C.box("plate", (x, y0, 0.3 + h), (0.14, length + 0.045, 0.09), stud, 0.004)

    wall_x(0, 0, 12)
    wall_x(0, 8, 12)
    wall_y(0, 0, 8)
    wall_y(12, 0, 8)
    wall_y(6, 0, 8)
    # roof joists on half the plan
    for i in range(14):
        C.box("joist", (-0.4, i * 0.6, 3.39), (6.8, 0.045, 0.24), stud, 0.004)
    # glulam beam + steel columns at opening
    C.box("glulam", (6, -0.6, 3.39), (6.2, 0.2, 0.45), C.mat_wood("glulam", (0.6, 0.42, 0.24), axis="X", scale=1.0, planks=False), 0.006)
    # material stacks
    for k in range(6):
        C.box("stack", (2, -3.5 + k * 0.0, 0.0 + k * 0.1), (4.5, 1.2, 0.09), stud, 0.004)
    C.box("pallet", (8, -3.8, 0), (1.2, 1.0, 0.8), C.mat_plain("wrap", (0.82, 0.8, 0.76), 0.6), 0.02)
    C.tree((-6, 6, 0), height=7, crown=3.6, kind="oak", seed=3)
    C.tree((18, 10, 0), height=8, crown=4, kind="oak", seed=4)
    C.camera((-3.0, -5.0, 1.6), (6, 4, 2.4), lens=22)
