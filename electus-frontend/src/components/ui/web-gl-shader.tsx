"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

import { useTheme } from "@/components/ThemeProvider"

export function WebGLShader() {
  const { theme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: any
    animationId: number | null
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: null,
    animationId: null,
  })

  // 1. Initialize WebGL Scene once on mount
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `

    // Electus-themed teal/cyan color palette
    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;
      uniform float isDark;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
        
        float d = length(p) * distortion;
        
        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.02 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.04 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);
        
        if (isDark > 0.5) {
          gl_FragColor = vec4(r * 0.3, g * 0.85, b * 0.9, 1.0);
        } else {
          // Light mode: solid light slate background with vibrant high-contrast teal wave and a bright white core
          vec3 bg = vec3(0.97, 0.98, 0.99);
          vec3 waveColor = vec3(0.0, 0.6, 0.7);
          float glow = clamp((r + g + b) / 3.0, 0.0, 1.0);
          
          vec3 finalColor = mix(bg, waveColor, glow);
          if (glow > 0.65) {
            finalColor = mix(finalColor, vec3(1.0, 1.0, 1.0), (glow - 0.65) / 0.35);
          }
          gl_FragColor = vec4(finalColor, 1.0);
        }
      }
    `

    const initScene = () => {
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({ canvas, alpha: true })
      refs.renderer.setPixelRatio(window.devicePixelRatio)
      
      // Set initial clear color based on theme
      refs.renderer.setClearColor(new THREE.Color(isDark ? 0x060a14 : 0xf8fafc))

      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        xScale: { value: 1.0 },
        yScale: { value: 0.5 },
        distortion: { value: 0.05 },
        isDark: { value: isDark ? 1.0 : 0.0 },
      }

      const position = [
        -1.0, -1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0, -1.0, 0.0,
        -1.0,  1.0, 0.0,
         1.0,  1.0, 0.0,
      ]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      if (refs.uniforms) refs.uniforms.time.value += 0.003
      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }
      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [])

  // 2. React to theme changes instantly without rebuilding the WebGL context
  useEffect(() => {
    const { current: refs } = sceneRef
    if (refs.uniforms) {
      refs.uniforms.isDark.value = isDark ? 1.0 : 0.0
    }
    if (refs.renderer) {
      refs.renderer.setClearColor(new THREE.Color(isDark ? 0x060a14 : 0xf8fafc))
    }
  }, [isDark])

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full block"
    />
  )
}
