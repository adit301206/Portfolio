/*
 * NOVA Hero — interactive Three.js particle constellation.
 * Style: Orbital Command (ideas.md) — cyan nodes, amber highlights, pointer-reactive.
 * Implementation note: canvas renders OPAQUE (alpha:false) over the void background to
 * avoid transparent-WebGL compositing tile artifacts seen on some GPUs.
 */
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useTheme } from "@/contexts/ThemeContext";

const COUNT = 460;
const RADIUS = 4.4;

export default function ParticleField() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const sceneRef = useRef<THREE.Scene | null>(null);
  const materialRef = useRef<THREE.PointsMaterial | null>(null);
  const coreMatRef = useRef<THREE.MeshBasicMaterial | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDark = theme === "dark";

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isDark ? 0x060b09 : 0xf8faf9);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Particle cloud on a sphere shell with noise
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const emerald = new THREE.Color(0x2fa084); // #2FA084
    const mint = new THREE.Color(0x6fcf97);    // #6FCF97
    const deepEmerald = new THREE.Color(0x1f6f5f); // #1F6F5F

    for (let i = 0; i < COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = RADIUS * (0.72 + Math.random() * 0.55);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.75;
      positions[i * 3 + 2] = r * Math.cos(phi);
      const c = Math.random() < 0.12 ? mint : Math.random() < 0.18 ? deepEmerald : emerald;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.07,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: isDark ? 1.0 : 0.2,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    materialRef.current = material;
    const cloud = new THREE.Points(geometry, material);
    scene.add(cloud);

    // faint wireframe icosahedron at core
    const coreGeo = new THREE.IcosahedronGeometry(2.1, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: isDark ? 0x2fa084 : 0x1f6f5f,
      wireframe: true,
      transparent: true,
      opacity: isDark ? 0.16 : 0.18,
    });
    coreMatRef.current = coreMat;
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.ty = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const timer = new THREE.Timer();
    const animate = () => {
      raf = requestAnimationFrame(animate);
      timer.update();
      const t = timer.getElapsed();
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      const rotSpeed = prefersReduced ? 0 : 0.045;
      cloud.rotation.y = t * rotSpeed + mouse.x * 0.35;
      cloud.rotation.x = mouse.y * 0.2 + Math.sin(t * 0.3) * 0.06;
      core.rotation.y = -t * 0.12 + mouse.x * 0.2;
      core.rotation.z = t * 0.08;
      core.scale.setScalar(1 + Math.sin(t * 0.8) * 0.04);
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      if (renderer.domElement.parentNode) mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const isDark = theme === "dark";
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(isDark ? 0x060b09 : 0xf8faf9);
    }
    if (materialRef.current) {
      materialRef.current.opacity = isDark ? 1.0 : 0.2;
      materialRef.current.blending = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      materialRef.current.needsUpdate = true;
    }
    if (coreMatRef.current) {
      coreMatRef.current.opacity = isDark ? 0.16 : 0.18;
      coreMatRef.current.color.set(isDark ? 0x2fa084 : 0x1f6f5f);
    }
  }, [theme]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
