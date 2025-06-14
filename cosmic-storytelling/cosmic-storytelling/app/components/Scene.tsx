"use client"

import { Suspense, useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Scroll, ScrollControls, useScroll, Stars, Float, useGLTF } from "@react-three/drei"
import * as THREE from "three"

function Earth() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF('/earth/earth.glb')

  useFrame((state) => {
    if (!scroll || !groupRef.current) return
    const offset = scroll.offset

    // Visible from start until moon phase
    groupRef.current.visible = offset < 0.6

    if (groupRef.current.visible) {
      // Rotate the Earth
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
      
      // Scale based on scroll - smoother scaling
      const scale = THREE.MathUtils.lerp(1, 0.3, offset / 0.6)
      groupRef.current.scale.setScalar(scale)

      // Move Earth away during transition
      if (offset > 0.5) {
        const moveProgress = (offset - 0.5) / 0.1
        groupRef.current.position.x = THREE.MathUtils.lerp(0, -10, moveProgress)
        groupRef.current.position.y = THREE.MathUtils.lerp(0, -5, moveProgress)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={2} position={[0, 0, 0]} />
    </group>
  )
}

function Moon() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF('/moon.glb')

  useFrame((state) => {
    if (!scroll || !groupRef.current) return
    const offset = scroll.offset

    // Visible during moon phase
    groupRef.current.visible = offset >= 0.5 && offset < 0.75

    if (groupRef.current.visible) {
      // Rotate the Moon
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Scale based on scroll - smoother scaling with larger initial size
      const scale = THREE.MathUtils.lerp(3.5, 4.0, (offset - 0.5) / 0.25)
      groupRef.current.scale.setScalar(scale)

      // Move Moon in from the side during transition
      if (offset < 0.6) {
        const moveProgress = (offset - 0.5) / 0.1
        groupRef.current.position.x = THREE.MathUtils.lerp(15, 0, moveProgress)
        groupRef.current.position.y = THREE.MathUtils.lerp(8, 0, moveProgress)
        groupRef.current.position.z = THREE.MathUtils.lerp(-5, 0, moveProgress)
      }
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={4} position={[0, 0, 0]} />
    </group>
  )
}

function Jupiter() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF('/jupiter_1_142984.glb')

  // Debugging: Log if the GLTF model is loaded and its scene structure
  useEffect(() => {
    if (gltf) {
      console.log('Jupiter GLTF loaded:', gltf)
      if (gltf.scene) {
        console.log('Jupiter GLTF scene children:', gltf.scene.children.length)
      }
    }
  }, [gltf])

  useFrame((state) => {
    if (!scroll || !groupRef.current) return
    const offset = scroll.offset

    // Visible during Jupiter phase
    groupRef.current.visible = offset >= 0.45 && offset < 0.75

    if (groupRef.current.visible) {
      // Rotate Jupiter
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={500} position={[0, 0, 0]} />
    </group>
  )
}

function Galaxy() {
  const scroll = useScroll()
  const groupRef = useRef<THREE.Group>(null)
  const gltf = useGLTF('/galaxy.glb')

  useFrame((state) => {
    if (!scroll || !groupRef.current) return
    const offset = scroll.offset

    // Visible during galaxy phase and beyond
    groupRef.current.visible = offset >= 0.75

    if (groupRef.current.visible) {
      // Rotate the galaxy
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05
      
      // Scale based on scroll - make galaxy much larger as we zoom out
      const scale = THREE.MathUtils.lerp(15, 25, (offset - 0.75) / 0.25)
      groupRef.current.scale.setScalar(scale)
    }
  })

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} scale={20} position={[0, 0, 0]} />
    </group>
  )
}

function CosmicJourney() {
  const scroll = useScroll()
  const { camera } = useThree()
  const groupRef = useRef<THREE.Group>(null)

  useFrame(() => {
    if (!scroll) return

    const offset = scroll.offset

    // Camera movement based on scroll - smoother transitions
    if (offset < 0.6) {
      // Earth view - extended duration with smooth transition
      const progress = offset / 0.6
      const position = new THREE.Vector3(
        0,
        5 + progress * 3, // Smooth vertical movement
        15 + progress * 10 // Smooth zoom out
      )
      camera.position.lerp(position, 0.05) // Slower lerp for smoother movement
      camera.lookAt(0, 0, 0)
    } else if (offset < 0.75) {
      // Moon view - shorter duration and smoother transition
      const progress = (offset - 0.6) / 0.15
      const position = new THREE.Vector3(
        0,
        8 + progress * 4, // Smooth vertical movement
        25 + progress * 20 // Smooth zoom out
      )
      camera.position.lerp(position, 0.05) // Slower lerp for smoother movement
      camera.lookAt(0, 0, 0)
    } else if (offset < 0.85) {
      // Jupiter view
      camera.position.lerp(new THREE.Vector3(0, 0, 50), 0.1)
      camera.lookAt(0, 0, 0)
    } else {
      // Galaxy view
      camera.position.lerp(new THREE.Vector3(0, 150, 350), 0.1)
      camera.lookAt(0, 0, 0)
    }

    // Rotate the entire scene slowly
    if (groupRef.current) {
      groupRef.current.rotation.y = offset * Math.PI * 2
    }
  })

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
      <Earth />
      <Moon />
      <Jupiter />
      <Galaxy />
    </group>
  )
}

function TextOverlays() {
  const scroll = useScroll()

  const ColoredText = ({ text, blueWords }: { text: string; blueWords: string[] }) => {
    const words = text.split(' ')
    return (
      <span>
        {words.map((word, index) => (
          <span
            key={index}
            className={blueWords.includes(word.toLowerCase()) ? "text-blue-400" : "text-white"}
          >
            {word}{' '}
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="w-full">
      {/* Opening question */}
      <div className="h-screen flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-4xl md:text-6xl font-light mb-8 opacity-90">
          <ColoredText 
            text="What are you scared of right now?" 
            blueWords={['scared', 'now']} 
          />
        </h1>
        <p className="text-2xl md:text-3xl font-light opacity-80">
          <ColoredText 
            text="Does it really matter?" 
            blueWords={['really']} 
          />
        </p>
        <div className="mt-12 text-sm text-gray-500 animate-bounce">Scroll to explore</div>
      </div>

      {/* Step back */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="Let's take a step back" 
              blueWords={['step', 'back']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="From the bustling streets of Chennai..." 
              blueWords={['bustling', 'Chennai']} 
            />
          </p>
        </div>
      </div>

      {/* Earth view - extended duration */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="Look how small it is" 
              blueWords={['small']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="Our entire world floating in space" 
              blueWords={['floating', 'space']} 
            />
          </p>
        </div>
      </div>

      {/* Additional Earth view section */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="Our home planet" 
              blueWords={['home']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="A beautiful blue marble in the vastness of space" 
              blueWords={['blue', 'vastness']} 
            />
          </p>
        </div>
      </div>

      {/* Moon view - extended duration */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="Our closest companion" 
              blueWords={['closest']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="The Moon Earth's faithful satellite" 
              blueWords={['faithful']} 
            />
          </p>
        </div>
      </div>

      {/* Additional Moon view section */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="A silent witness" 
              blueWords={['silent']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="To all of Earth's history and beyond" 
              blueWords={['history', 'beyond']} 
            />
          </p>
        </div>
      </div>

      {/* Solar system */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="You are here" 
              blueWords={['here']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="One planet among many in our solar system" 
              blueWords={['planet', 'solar']} 
            />
          </p>
        </div>
      </div>

      {/* Galaxy */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="Among billions of stars" 
              blueWords={['billions', 'stars']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="In the vast spiral of the Milky Way" 
              blueWords={['spiral', 'Milky']} 
            />
          </p>
        </div>
      </div>

      {/* Universe */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8">
          <h2 className="text-3xl md:text-5xl font-light mb-4">
            <ColoredText 
              text="In an infinite universe" 
              blueWords={['infinite']} 
            />
          </h2>
          <p className="text-lg">
            <ColoredText 
              text="Full of wonder and possibility" 
              blueWords={['wonder', 'possibility']} 
            />
          </p>
        </div>
      </div>

      {/* Final message */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center px-8 max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-8 leading-tight">
            This world is big.
            <br />
            <span className="text-gray-400">Your fears are not.</span>
            <br />
            <span className="text-blue-400 glow">Live freely.</span>
          </h1>
        </div>
      </div>

      {/* Empty space for final fade */}
      <div className="h-screen"></div>
    </div>
  )
}

function ErrorFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h2 className="text-2xl mb-4">Something went wrong</h2>
        <p className="text-gray-400">Please try refreshing the page</p>
      </div>
    </div>
  )
}

export default function Scene() {
  const [fear, setFear] = useState("")
  const [hasStarted, setHasStarted] = useState(false)
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return <ErrorFallback />
  }

  if (!hasStarted) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        {/* Background Stars */}
        <div className="absolute inset-0">
          <Canvas>
            <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
          </Canvas>
        </div>

        {/* Glassmorphic Container */}
        <div className="relative z-10 backdrop-blur-lg bg-white/10 rounded-2xl p-8 shadow-2xl border border-white/20 w-[90%] max-w-md">
          <h1 className="text-3xl font-light mb-6 text-center text-gray-200">
            What are you scared of?
          </h1>
          <input
            type="text"
            value={fear}
            onChange={(e) => setFear(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 mb-6 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            placeholder="Enter your fear..."
          />
          <button
            onClick={() => setHasStarted(true)}
            className="w-full backdrop-blur-lg bg-white/10 border border-white/20 text-gray-200 px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            Begin Cosmic Journey
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 75 }}
        onError={() => setHasError(true)}
      >
        <color attach="background" args={["#000"]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        <Suspense fallback={
          <mesh>
            <sphereGeometry args={[1, 32, 32]} />
            <meshStandardMaterial color="#4a90e2" />
          </mesh>
        }>
          <ScrollControls pages={12} damping={0.1} enabled={true}>
            <CosmicJourney />
            <Scroll html>
              <TextOverlays />
            </Scroll>
          </ScrollControls>
          <Stars radius={300} depth={60} count={20000} factor={7} saturation={0} fade />
        </Suspense>
      </Canvas>
    </div>
  )
} 