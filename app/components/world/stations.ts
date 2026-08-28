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
  /** Station scale. The scenes were drawn to fill a figure; here they are
      the room the text sits in, so they are set back and set smaller. */
  scale: number;
};

export const STATIONS: Station[] = [
  {
    /* The hero is the exception: diffuse particles read as atmosphere at any
       size, and the copy is centred over them by design. */
    id: 'field',
    anchor: null,
    at: [0, 0, 0],
    eye: [0, 0, 7.2],
    look: [0, 0, 0],
    fov: 45,
    scale: 1,
  },
  {
    id: 'net',
    anchor: 'expertise',
    at: [14, -1.2, -10],
    eye: [11.6, -1.2, -3.2],
    look: [12.2, -1.2, -10],
    fov: 45,
    scale: 0.72,
  },
  {
    id: 'descent',
    anchor: 'method',
    at: [24, -4, -26],
    eye: [21.4, -2.4, -14.6],
    look: [22.2, -4, -26],
    fov: 40,
    scale: 0.7,
  },
  {
    id: 'rag',
    anchor: 'work',
    at: [16, -8, -44],
    eye: [13.4, -6.6, -32],
    look: [14.2, -8, -44],
    fov: 40,
    scale: 0.72,
  },
  {
    id: 'attention',
    anchor: 'research',
    at: [2, -11, -56],
    eye: [-0.6, -10.8, -44],
    look: [0.2, -11, -56],
    fov: 42,
    scale: 0.72,
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
    scale: 1,
  },
];

/** How many stations either side of the camera stay mounted. */
export const MOUNT_WINDOW = 1;
export const MOUNT_WINDOW_MOBILE = 1;
