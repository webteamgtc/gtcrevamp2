/**
 * Opening intro — Three.js scene (desktop only, loaded on demand when the intro plays).
 * Gold and blue particles fly in from a wide cloud and settle into a slowly turning globe of dots,
 * with a thin orbit ring. The fly-in runs on the GPU (vertex shader), so the main thread stays free.
 * Returns { stop } to free the GPU when the intro ends.
 */
import * as THREE from 'three';

const VERTEX = /* glsl */ `
  attribute vec3 aStart;
  attribute vec3 aColor;
  uniform float uProgress;
  uniform float uSize;
  varying vec3 vColor;
  void main() {
    float k = 1.0 - pow(1.0 - clamp(uProgress, 0.0, 1.0), 3.0);
    vec4 mv = modelViewMatrix * vec4(mix(aStart, position, k), 1.0);
    gl_PointSize = uSize * (300.0 / -mv.z);
    gl_Position = projectionMatrix * mv;
    vColor = aColor;
  }
`;
const FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.1, d));
  }
`;

export function startIntroScene(canvas) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  const size = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  size();
  window.addEventListener('resize', size);

  // globe of dots (fibonacci sphere) + scattered start positions
  const N = 2000;
  const R = 1.9;
  const target = new Float32Array(N * 3);
  const start = new Float32Array(N * 3);
  const colors = new Float32Array(N * 3);
  const gold = new THREE.Color('#d4a874');
  const blue = new THREE.Color('#6f82e6');
  const white = new THREE.Color('#ffffff');
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    target.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3);
    const d = 6 + Math.random() * 8;
    const a = Math.random() * Math.PI * 2;
    const b = Math.acos(2 * Math.random() - 1);
    start.set([d * Math.sin(b) * Math.cos(a), d * Math.cos(b), d * Math.sin(b) * Math.sin(a) - 4], i * 3);
    const c = Math.random() < 0.55 ? gold : Math.random() < 0.85 ? blue : white;
    colors.set([c.r, c.g, c.b], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(target, 3));
  geo.setAttribute('aStart', new THREE.BufferAttribute(start, 3));
  geo.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  const uniforms = { uProgress: { value: 0 }, uSize: { value: 0.045 } };
  const mat = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const globe = new THREE.Points(geo, mat);
  globe.rotation.x = 0.25;
  scene.add(globe);

  // orbit ring
  const ringGeo = new THREE.RingGeometry(R * 1.32, R * 1.335, 160);
  const ringMat = new THREE.MeshBasicMaterial({ color: '#b68756', transparent: true, opacity: 0, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.42;
  scene.add(ring);

  const t0 = performance.now();
  let raf = 0;
  const tick = (now) => {
    const t = (now - t0) / 1000;
    uniforms.uProgress.value = t / 1.15;
    globe.rotation.y = t * 0.35;
    ring.rotation.z = t * 0.25;
    ringMat.opacity = 0.55 * Math.min(1, Math.max(0, (t - 0.6) / 0.6));
    renderer.render(scene, camera);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return {
    stop() {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', size);
      geo.dispose();
      mat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    }
  };
}
