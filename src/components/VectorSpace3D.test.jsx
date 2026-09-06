import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';

// VectorSpace3D drives real WebGL through three.js, which jsdom can't
// provide (no GPU/WebGL context). This smoke test isn't about three.js's
// rendering — it's about VectorSpace3D's own effect setup/teardown (event
// listeners, the off-screen pause, disposal calls) running without error,
// so the module is replaced with minimal stand-ins for the handful of
// three.js APIs the component actually calls.
vi.mock('three', () => {
  class FakeObject3D {
    constructor() {
      this.position = { x: 0, y: 0, z: 0, set: vi.fn() };
      this.rotation = { x: 0, y: 0, z: 0 };
      this.userData = {};
      this.children = [];
    }
    add(child) {
      this.children.push(child);
    }
  }

  class Scene extends FakeObject3D {}
  class Group extends FakeObject3D {}
  class Mesh extends FakeObject3D {}
  class Line extends FakeObject3D {}
  class GridHelper extends FakeObject3D {
    constructor() {
      super();
      this.geometry = { dispose: vi.fn() };
      this.material = { dispose: vi.fn() };
    }
  }

  class PerspectiveCamera extends FakeObject3D {
    constructor() {
      super();
      this.aspect = 1;
    }
    updateProjectionMatrix() {}
  }

  class SphereGeometry {
    dispose() {}
  }
  class MeshBasicMaterial {
    dispose() {}
  }
  class BufferGeometry {
    setFromPoints() {
      return this;
    }
    dispose() {}
  }
  class LineBasicMaterial {
    dispose() {}
  }
  class Vector2 {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
  }
  class Vector3 {
    constructor(x, y, z) {
      this.x = x;
      this.y = y;
      this.z = z;
    }
  }
  class Raycaster {
    setFromCamera() {}
    intersectObjects() {
      return [];
    }
  }
  class WebGLRenderer {
    constructor() {
      this.domElement = document.createElement('canvas');
    }
    setSize() {}
    setPixelRatio() {}
    render() {}
    dispose() {}
  }

  return {
    Scene,
    Group,
    Mesh,
    Line,
    GridHelper,
    PerspectiveCamera,
    SphereGeometry,
    MeshBasicMaterial,
    BufferGeometry,
    LineBasicMaterial,
    Vector2,
    Vector3,
    Raycaster,
    WebGLRenderer
  };
});

const { default: VectorSpace3D } = await import('./VectorSpace3D');

describe('VectorSpace3D', () => {
  it('mounts and unmounts without throwing', () => {
    const { unmount, container } = render(<VectorSpace3D />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
  });
});
