import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * Fond Three.js du hero : réseau de particules connectées (effet "plexus"),
 * clin d'œil aux réseaux de neurones / agents IA.
 *
 * Sobriété et performance :
 * - opacités faibles, drift lent, parallaxe souris légère ;
 * - pause automatique quand le hero sort de l'écran ;
 * - rendu statique si l'utilisateur préfère réduire les animations ;
 * - densité réduite sur mobile, DPR plafonné à 2.
 */
export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const NODE_COUNT = isMobile ? 55 : 110
    const BOUNDS = { x: 22, y: 12, z: 8 }
    const CONNECT_DIST = isMobile ? 4.2 : 4.8
    const MAX_LINKS = NODE_COUNT * 6

    const accent = new THREE.Color(
      getComputedStyle(document.documentElement).getPropertyValue('--color-accent').trim() ||
        '#7C5CFC',
    )

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100,
    )
    camera.position.z = 16

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // --- Particules -------------------------------------------------------
    const positions = new Float32Array(NODE_COUNT * 3)
    const velocities = new Float32Array(NODE_COUNT * 3)
    for (let i = 0; i < NODE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2 * BOUNDS.x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * BOUNDS.y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2 * BOUNDS.z
      velocities[i * 3] = (Math.random() - 0.5) * 0.012
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.012
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.006
    }

    const pointsGeometry = new THREE.BufferGeometry()
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const pointsMaterial = new THREE.PointsMaterial({
      color: accent,
      size: isMobile ? 0.09 : 0.11,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
      depthWrite: false,
    })
    scene.add(new THREE.Points(pointsGeometry, pointsMaterial))

    // --- Connexions (lignes) ---------------------------------------------
    const linePositions = new Float32Array(MAX_LINKS * 2 * 3)
    const lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage),
    )
    const lineMaterial = new THREE.LineBasicMaterial({
      color: accent,
      transparent: true,
      opacity: 0.14,
      depthWrite: false,
    })
    const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
    scene.add(lines)

    const updateLines = () => {
      let vertex = 0
      let links = 0
      for (let i = 0; i < NODE_COUNT && links < MAX_LINKS; i++) {
        for (let j = i + 1; j < NODE_COUNT && links < MAX_LINKS; j++) {
          const dx = positions[i * 3] - positions[j * 3]
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1]
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2]
          if (dx * dx + dy * dy + dz * dz < CONNECT_DIST * CONNECT_DIST) {
            linePositions[vertex++] = positions[i * 3]
            linePositions[vertex++] = positions[i * 3 + 1]
            linePositions[vertex++] = positions[i * 3 + 2]
            linePositions[vertex++] = positions[j * 3]
            linePositions[vertex++] = positions[j * 3 + 1]
            linePositions[vertex++] = positions[j * 3 + 2]
            links++
          }
        }
      }
      lineGeometry.setDrawRange(0, links * 2)
      lineGeometry.attributes.position.needsUpdate = true
    }

    // --- Parallaxe souris ---------------------------------------------------
    const mouse = { x: 0, y: 0 }
    const onPointerMove = (e: PointerEvent) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove)

    // --- Boucle d'animation -------------------------------------------------
    let rafId = 0
    let isVisible = true

    const tick = () => {
      for (let i = 0; i < NODE_COUNT; i++) {
        for (let axis = 0; axis < 3; axis++) {
          const idx = i * 3 + axis
          positions[idx] += velocities[idx]
          const bound = axis === 0 ? BOUNDS.x : axis === 1 ? BOUNDS.y : BOUNDS.z
          if (Math.abs(positions[idx]) > bound) velocities[idx] *= -1
        }
      }
      pointsGeometry.attributes.position.needsUpdate = true
      updateLines()

      // Parallaxe très douce
      camera.position.x += (mouse.x * 1.2 - camera.position.x) * 0.03
      camera.position.y += (-mouse.y * 0.8 - camera.position.y) * 0.03
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
      if (isVisible && !reduceMotion) rafId = requestAnimationFrame(tick)
    }

    // Premier rendu (une seule frame si reduced-motion)
    updateLines()
    renderer.render(scene, camera)
    if (!reduceMotion) rafId = requestAnimationFrame(tick)

    // Pause quand le hero n'est plus à l'écran
    const observer = new IntersectionObserver((entries) => {
      // Seul le dernier enregistrement du lot reflète l'état courant
      const entry = entries[entries.length - 1]
      const wasVisible = isVisible
      isVisible = entry.isIntersecting
      if (isVisible && !wasVisible && !reduceMotion) rafId = requestAnimationFrame(tick)
      if (!isVisible) cancelAnimationFrame(rafId)
    })
    observer.observe(container)

    // ResizeObserver plutôt que window.resize : couvre aussi le cas où le
    // conteneur est monté avant d'avoir sa taille définitive.
    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container
      if (clientWidth === 0 || clientHeight === 0) return
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
      renderer.render(scene, camera)
    })
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(rafId)
      observer.disconnect()
      resizeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      pointsGeometry.dispose()
      pointsMaterial.dispose()
      lineGeometry.dispose()
      lineMaterial.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0"
      aria-hidden="true"
    />
  )
}
