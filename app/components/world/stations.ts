/**
 * The stations the camera visits, in scroll order.
 *
 * Each one is a fixed place in a single world, not a separate scene: the
 * `at` vector is where its contents sit, and `eye` / `look` / `fov` are how
 * the camera frames them when it arrives. The rig interpolates between
 * consecutive entries, so these are keyframes on one continuous path.
 *
 * They are laid out on a gentle arc through XZ rather than straight down -Z.
 * A straight line reads as zooming — the scene simply getting bigger — while
 * lateral movement reads as travelling past something that stays put.
 *
 * `anchor` is the id of the DOM section that owns each station. The rig
 * measures those elements rather than assuming fixed scroll offsets, so the
 * path stays correct as sections change height (and they have changed height
 * a great deal recently).
 */

export type Station = {
  id: string;
  /** Section id this station is parked at, or null for the opening frame. */
  anchor: string | null;
  /** Where this station's contents sit in world space. */
  at: [number, number, number];
  /** Camera position on arrival. */
  eye: [number, number, number];
  /** Camera target on arrival. */
  look: [number, number, number];
  fov: number;
};

export const STATIONS: Station[] = [
  {
    id: 'field',
    anchor: null,
    at: [0, 0, 0],
    eye: [0, 0, 7.2],
    look: [0, 0, 0],
    fov: 45,
  },
  {
    id: 'net',
    anchor: 'expertise',
    at: [14, -1.2, -10],
    eye: [14, -1.2, -4.6],
    look: [14, -1.2, -10],
    fov: 45,
  },
  {
    id: 'descent',
    anchor: 'method',
    at: [24, -4, -26],
    eye: [24, -2.6, -17],
    look: [24, -4, -26],
    fov: 40,
  },
  {
    id: 'rag',
    anchor: 'work',
    at: [16, -8, -44],
    eye: [16, -6.8, -35.6],
    look: [16, -8, -44],
    fov: 40,
  },
  {
    id: 'attention',
    anchor: 'research',
    at: [2, -11, -56],
    eye: [2, -11, -48],
    look: [2, -11, -56],
    fov: 42,
  },
  {
    /* The last frame is not a figure but a vantage: the camera climbs and
       turns back so the whole path it just flew is visible at once. */
    id: 'vantage',
    anchor: 'contact',
    at: [0, 0, 0],
    eye: [-12, 6, -18],
    look: [12, -5, -30],
    fov: 55,
  },
];

/** How many stations either side of the camera stay mounted. */
export const MOUNT_WINDOW = 1;
export const MOUNT_WINDOW_MOBILE = 1;
