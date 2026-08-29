import test from 'node:test';
import assert from 'node:assert/strict';
import { MAX_PANES, approach, pack, visible, type PaneInput } from './pack';

const pane = (over: Partial<PaneInput> = {}): PaneInput => ({
  x: 100, y: 100, w: 200, h: 120, radius: 16, tier: 2, enter: 1, response: 0,
  ...over,
});

const buffers = () => ({
  rects: new Float32Array(MAX_PANES * 4),
  params: new Float32Array(MAX_PANES * 4),
});

test('a pane inside the viewport is visible', () => {
  assert.equal(visible(pane(), 1280, 800), true);
});

test('a pane scrolled far above the viewport is not', () => {
  assert.equal(visible(pane({ y: -900 }), 1280, 800), false);
});

test('a pane straddling the top edge is still visible', () => {
  assert.equal(visible(pane({ y: -60 }), 1280, 800), true);
});

test('pack flips y into GL space and scales by dpr', () => {
  const { rects, params } = buffers();
  const n = pack([pane({ x: 10, y: 20, w: 100, h: 50 })], 1000, 800, 2, rects, params);
  assert.equal(n, 1);
  assert.equal(rects[0], 20);                  // x * dpr
  assert.equal(rects[1], (800 - 20 - 50) * 2); // (vh - y - h) * dpr
  assert.equal(rects[2], 200);
  assert.equal(rects[3], 100);
});

test('pack clamps the radius to half the shorter side', () => {
  const { rects, params } = buffers();
  pack([pane({ w: 40, h: 20, radius: 999 })], 1000, 800, 1, rects, params);
  assert.equal(params[0], 10);
});

test('pack carries tier, enter and response through', () => {
  const { rects, params } = buffers();
  pack([pane({ tier: 3, enter: 0.5, response: 0.25 })], 1000, 800, 1, rects, params);
  assert.equal(params[1], 3);
  assert.equal(params[2], 0.5);
  assert.equal(params[3], 0.25);
});

test('pack drops zero-area panes', () => {
  const { rects, params } = buffers();
  assert.equal(pack([pane({ h: 0 })], 1000, 800, 1, rects, params), 0);
});

test('over the cap, pack keeps the largest panes', () => {
  const { rects, params } = buffers();
  const many: PaneInput[] = [];
  for (let i = 0; i < MAX_PANES + 6; i += 1) {
    many.push(pane({ x: 0, y: 0, w: 10 + i, h: 10 }));
  }
  const n = pack(many, 1000, 800, 1, rects, params);
  assert.equal(n, MAX_PANES);
  // Sorted by area descending, so slot 0 is the widest pane submitted.
  assert.equal(rects[2], 10 + MAX_PANES + 5);
});

test('pack never writes past the cap', () => {
  const { rects, params } = buffers();
  const many = Array.from({ length: 100 }, () => pane());
  pack(many, 1000, 800, 1, rects, params);
  assert.equal(rects.length, MAX_PANES * 4);
});

test('approach moves toward the target and converges', () => {
  let v = 0;
  for (let i = 0; i < 60; i += 1) v = approach(v, 1, 1 / 60);
  assert.ok(v > 0.97, 'reaches most of the way in a second, got ' + v);
  assert.ok(v <= 1);
});

test('approach is frame-rate independent to within a percent', () => {
  let fast = 0;
  for (let i = 0; i < 120; i += 1) fast = approach(fast, 1, 1 / 120);
  let slow = 0;
  for (let i = 0; i < 30; i += 1) slow = approach(slow, 1, 1 / 30);
  assert.ok(Math.abs(fast - slow) < 0.01, 'fast ' + fast + ' vs slow ' + slow);
});

test('approach with an equal target does not drift', () => {
  assert.equal(approach(0.4, 0.4, 1 / 60), 0.4);
});
