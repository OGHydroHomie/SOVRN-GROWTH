import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

const q = new URLSearchParams(location.search);
const num = (k, d) => (q.has(k) ? +q.get(k) : d);
const W = num('w', 1000);
const H = num('h', 2200);
const YAW = num('yaw', 28) * Math.PI / 180;
const TILT = num('tilt', 0) * Math.PI / 180;
const ELEV = num('elev', 18) * Math.PI / 180;
const FOV = num('fov', 20);
const DIST = num('dist', 110);
const ABUT = q.get('abut') || 'gold';

const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const fract = (x) => x - Math.floor(x);
const mix = (a, b, t) => a + (b - a) * t;
const angDiff = (a, b) => { let d = (a - b) % TAU; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU; return d; };
const hexR = (th, apothem) => { const seg = TAU / 6; const x = ((th % seg) + seg) % seg - seg / 2; return apothem / Math.cos(x); };

// Parametric grid: fn(u in [0,1) around the axis, v in [0,1]) -> [x, y, z]. Winding gives outward normals
// when v runs up the side (or inward across a top face).
function grid(fn, nu, nv) {
  const pos = new Float32Array((nu + 1) * (nv + 1) * 3);
  const col = new Float32Array((nu + 1) * (nv + 1) * 3);
  let k = 0;
  for (let j = 0; j <= nv; j++) {
    const v = j / nv;
    for (let i = 0; i <= nu; i++) {
      const p = fn((i % nu) / nu, v);
      const ao = p.length > 3 ? p[3] : 1;
      col[k] = ao; pos[k++] = p[0];
      col[k] = ao; pos[k++] = p[1];
      col[k] = ao; pos[k++] = p[2];
    }
  }
  const idx = new Uint32Array(nu * nv * 6);
  let m = 0;
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const a = j * (nu + 1) + i, b = a + 1, c = a + nu + 1, d = c + 1;
    idx[m++] = a; idx[m++] = c; idx[m++] = b;
    idx[m++] = b; idx[m++] = c; idx[m++] = d;
  }
  let g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  g.setIndex(new THREE.BufferAttribute(idx, 1));
  g = mergeVertices(g, 1e-5);
  g.computeVertexNormals();
  return g;
}

// ---------- Implant fixture: tapered body, right-hand threads, apical flutes, smooth collar, hex socket
const FIX = { L: 11.5, P: num('pitch', 0.85), rCore: 1.7, depth: num('depth', 0.36), apexH: 1.0, hexA: 0.78, socketD: 1.9 };
const AO_THREAD = num('aoThread', 0.5);
const FIX_TOP_R = FIX.rCore + FIX.depth - 0.14;

function fixtureBody() {
  const { L, P, rCore, depth, apexH } = FIX;
  return grid((u, v) => {
    const th = u * TAU;
    const y = -L + v * L;
    const t = v;
    let rc = rCore;
    if (t < 0.42) rc = rCore - 0.62 * Math.pow((0.42 - t) / 0.42, 1.5);
    const ph = fract(y / P + u);
    const tri = 1 - Math.abs(2 * ph - 1);
    let prof = smooth(0.06, 0.94, tri);
    prof = mix(prof, 1, smooth(0.905, 0.94, t));
    const tf = smooth(0.015, 0.11, t);
    let r = rc + depth * prof * tf;
    r -= 0.14 * smooth(0.988, 1.0, t);
    let ao = mix(1, mix(AO_THREAD, 1, prof), tf);
    const fl = 1 - smooth(0.06, 0.34, t);
    if (fl > 0) {
      for (let k = 0; k < 3; k++) {
        const g = Math.max(0, 1 - Math.abs(angDiff(th, k * TAU / 3 + 0.4)) / 0.36);
        r -= fl * 0.5 * g * g;
        ao *= 1 - 0.35 * fl * g;
      }
    }
    const ya = y + L;
    if (ya < apexH) { const s = ya / apexH; r *= Math.sqrt(Math.max(0, 1 - (1 - s) * (1 - s))); }
    return [r * Math.cos(th), y, r * Math.sin(th), ao];
  }, 240, 1200);
}

function fixtureTop() {
  return grid((u, v) => {
    const th = u * TAU;
    const r = mix(FIX_TOP_R, hexR(th, FIX.hexA), v);
    return [r * Math.cos(th), 0, r * Math.sin(th)];
  }, 240, 6);
}

function fixtureSocket() {
  const D = FIX.socketD;
  return grid((u, v) => {
    const th = u * TAU;
    const rh = hexR(th, FIX.hexA);
    if (v < 0.75) { const y = -D * (v / 0.75); return [rh * Math.cos(th), y, rh * Math.sin(th)]; }
    const r = rh * (1 - (v - 0.75) / 0.25);
    return [r * Math.cos(th), -D, r * Math.sin(th)];
  }, 240, 24);
}

// ---------- Abutment: hex connection, flared collar, chamfer margin, tapered post with one flat, screw channel
const AB_PROFILE = [
  [0, 0], [0.62, 0], [0.74, 0.12], [0.74, 1.6], [0.8, 1.72],
  [1.05, 1.78], [1.35, 1.95], [1.75, 2.35], [2.1, 2.85], [2.32, 3.3], [2.4, 3.55], [2.36, 3.68],
  [2.0, 3.8], [1.88, 3.95], [1.84, 4.15],
  [1.56, 8.3], [1.5, 8.5], [1.38, 8.62], [1.2, 8.66], [0.66, 8.66], [0.6, 8.6],
];
const AB_TOP = 8.66;

function sampleProfile(points, n) {
  const seg = [];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const l = Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]);
    seg.push(l); total += l;
  }
  return (v) => {
    let d = v * total;
    for (let i = 0; i < seg.length; i++) {
      if (d <= seg[i] || i === seg.length - 1) {
        const t = seg[i] ? clamp(d / seg[i], 0, 1) : 0;
        return [mix(points[i][0], points[i + 1][0], t), mix(points[i][1], points[i + 1][1], t)];
      }
      d -= seg[i];
    }
    return points[points.length - 1];
  };
}

function abutOuter() {
  const prof = sampleProfile(AB_PROFILE, 0);
  const thFlat = num('flat', -0.7);
  return grid((u, v) => {
    const th = u * TAU;
    const [r0, y] = prof(v);
    let r = r0;
    const hexAmt = 1 - smooth(1.6, 1.78, y);
    if (hexAmt > 0) r = mix(r, hexR(th, r0), hexAmt);
    const flatAmt = smooth(4.25, 4.7, y);
    if (flatAmt > 0 && r0 > 0.7) {
      const d = angDiff(th, thFlat);
      if (Math.abs(d) < Math.PI / 2) r = mix(r, Math.min(r, (0.84 * r0) / Math.cos(d)), flatAmt);
    }
    const ao = 1 - 0.3 * Math.exp(-((y - 1.8) ** 2) / 0.02) - 0.18 * Math.exp(-((y - 3.85) ** 2) / 0.01);
    return [r * Math.cos(th), y, r * Math.sin(th), ao];
  }, 240, 700);
}

function abutChannel() {
  return grid((u, v) => {
    const th = u * TAU;
    if (v < 0.8) { const y = 8.6 - (v / 0.8) * 1.6; return [0.6 * Math.cos(th), y, 0.6 * Math.sin(th)]; }
    const r = 0.6 * (1 - (v - 0.8) / 0.2);
    return [r * Math.cos(th), 7.0, r * Math.sin(th)];
  }, 120, 20);
}

// ---------- Molar crown: superellipsoid block, cervical taper, four cusps plus a small distal cusp, fossa and grooves
const CR = { A: 5.25, B: 4.9, C: num('crC', 3.9), e1: num('e1', 0.6), e2: num('e2', 0.68) };
function crownGeo() {
  const { A, B, C, e1, e2 } = CR;
  const sp = (w, m) => Math.sign(Math.sin(w)) * Math.pow(Math.abs(Math.sin(w)), m);
  const cp = (w, m) => Math.sign(Math.cos(w)) * Math.pow(Math.abs(Math.cos(w)), m);
  // Lower first molar: three buccal cusps (MB, DB, D) and two taller lingual cusps (ML, DL). x = mesiodistal, z = buccolingual.
  const cusps = [
    [2.6, 2.2, 1.25, 1.22],
    [-0.3, 2.45, 1.15, 1.18],
    [-3.05, 1.45, 0.85, 1.05],
    [2.3, -2.2, 1.4, 1.28],
    [-1.9, -2.25, 1.35, 1.28],
  ];
  const lift = num('lift', 1.25);
  const CUSP = num('cusp', 1.35);
  const GS = num('gs', 0.22);
  const gauss = (d, s) => Math.exp(-(d * d) / (2 * s * s));
  return grid((u, v) => {
    const th = u * TAU;
    const ph = -Math.PI / 2 + v * Math.PI;
    let x = A * cp(ph, e1) * cp(th, e2);
    let z = B * cp(ph, e1) * sp(th, e2);
    let y = C * sp(ph, e1);
    const yn = y / C;
    const HOC = num('hoc', 0.3);
    const k = yn > HOC
      ? 1 - num('occ', 0.1) * ((yn - HOC) / (1 - HOC))
      : 1 - num('cerv', 0.5) * Math.pow(smooth(HOC, -1.0, yn), num('cervPow', 1.0));
    x *= k; z *= k;
    const w = smooth(0.35, 0.92, yn);
    let ao = 1 - 0.12 * smooth(-0.4, -1.0, yn);
    if (w > 0) {
      let dy = 0;
      for (const [cx, cz, h, s] of cusps) dy += CUSP * h * Math.exp(-((x - cx) ** 2 + (z - cz) ** 2) / (2 * s * s));
      const inX = 1 - smooth(3.3, 4.2, Math.abs(x));
      const zig = 0.18 * Math.sin(x * 1.3);
      const central = 0.5 * gauss(z - zig, GS) * inX;
      const buccal = (0.42 * gauss(x - 1.15, GS) + 0.36 * gauss(x + 1.75, GS)) * smooth(-0.1, 0.8, z) * (1 - smooth(3.6, 4.6, z));
      const lingual = 0.4 * gauss(x - 0.2, GS) * smooth(0.1, -0.8, z) * (1 - smooth(3.6, 4.6, -z));
      const fossae = 0.62 * gauss(Math.hypot(x - 0.2, z), 0.95) + 0.4 * gauss(Math.hypot(x - 2.9, z), 0.7) + 0.35 * gauss(Math.hypot(x + 2.6, z - 0.2), 0.7);
      const grooves = central + buccal + lingual;
      dy -= grooves + fossae;
      y += w * (dy - lift);
      ao -= w * (num('aoGroove', 1.0) * grooves + 0.4 * fossae) * 0.6;
    }
    return [x, y, z, Math.max(0.35, ao)];
  }, 260, 260);
}

// ---------- Scene
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1);
renderer.setSize(W, H);
renderer.setClearColor(0x000000, 0);
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = num('exposure', 1.0);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.getElementById('stage').appendChild(renderer.domElement);

const scene = new THREE.Scene();
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const titanium = new THREE.MeshPhysicalMaterial({ color: 0xc3c9d1, metalness: 1, roughness: num('tiRough', 0.34), vertexColors: true });
const titaniumDark = new THREE.MeshPhysicalMaterial({ color: 0x3a4048, metalness: 0.7, roughness: 0.55, vertexColors: true });
const gold = new THREE.MeshPhysicalMaterial({ color: 0xe0bd72, metalness: 1, roughness: 0.28, vertexColors: true });
const porcelain = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color(q.get('crColor') || '#f3ede1'), metalness: 0, roughness: num('crRough', 0.38), vertexColors: true,
  envMapIntensity: num('crEnv', 0.7),
  clearcoat: num('cc', 0.6), clearcoatRoughness: num('ccRough', 0.22), sheen: 0.3, sheenRoughness: 0.6, sheenColor: new THREE.Color(0xffffff),
});

const fixture = new THREE.Group();
fixture.add(new THREE.Mesh(fixtureBody(), titanium), new THREE.Mesh(fixtureTop(), titanium), new THREE.Mesh(fixtureSocket(), titaniumDark));

const abutment = new THREE.Group();
abutment.add(new THREE.Mesh(abutOuter(), ABUT === 'gold' ? gold : titanium), new THREE.Mesh(abutChannel(), titaniumDark));
const GAP1 = num('gap1', 2.0), GAP2 = num('gap2', 2.4);
abutment.position.y = GAP1;

const crown = new THREE.Group();
crown.add(new THREE.Mesh(crownGeo(), porcelain));
crown.rotation.y = num('crownYaw', 0) * Math.PI / 180;
crown.rotation.x = num('crownTilt', 0) * Math.PI / 180;
crown.scale.setScalar(num('crownScale', 1));
crown.position.y = GAP1 + AB_TOP + GAP2 + CR.C * num('crownScale', 1);

const all = new THREE.Group();
all.add(fixture, abutment, crown);
all.rotation.y = YAW;
all.rotation.z = TILT;
scene.add(all);

const key = new THREE.DirectionalLight(0xffffff, num('key', 2.4));
key.position.set(num('kx', -6), num('kyy', 10), num('kz', 8));
const rim = new THREE.DirectionalLight(0xa9cdff, num('rim', 2.2));
rim.position.set(8, 4, -7);
const fill = new THREE.HemisphereLight(0xffffff, 0xb9d3f3, num('fill', 0.6));
scene.add(key, rim, fill);

const target = new THREE.Vector3(0, num('ty', 5.2), 0);
const camera = new THREE.PerspectiveCamera(FOV, W / H, 1, 1000);
camera.position.set(0, target.y + DIST * Math.sin(ELEV), DIST * Math.cos(ELEV));
camera.lookAt(target);
scene.updateMatrixWorld(true);

function renderLayer(parts) {
  fixture.visible = parts.includes('fixture');
  abutment.visible = parts.includes('abutment');
  crown.visible = parts.includes('crown');
  renderer.render(scene, camera);
  return renderer.domElement.toDataURL('image/png');
}

function anchors(obj) {
  const box = new THREE.Box3().setFromObject(obj);
  const c = box.getCenter(new THREE.Vector3());
  const toPx = (p) => { const v = p.clone().project(camera); return [Math.round(((v.x + 1) / 2) * W), Math.round(((1 - v.y) / 2) * H)]; };
  return { center: toPx(c), top: toPx(new THREE.Vector3(c.x, box.max.y, c.z)), bottom: toPx(new THREE.Vector3(c.x, box.min.y, c.z)) };
}

const layers = {};
if (q.get('mode') === 'export') {
  layers.fixture = renderLayer(['fixture']);
  layers.abutment = renderLayer(['abutment']);
  layers.crown = renderLayer(['crown']);
}
layers.all = renderLayer(['fixture', 'abutment', 'crown']);
window.__anchors = { fixture: anchors(fixture), abutment: anchors(abutment), crown: anchors(crown) };
window.__layers = layers;
window.__done = true;
