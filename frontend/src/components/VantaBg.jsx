import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import CLOUDS from 'vanta/dist/vanta.clouds.min'

export default function VantaBg() {
  const vantaRef = useRef(null)

  useEffect(() => {
    let vantaEffect = null
    if (vantaRef.current) {
      try {
        vantaEffect = CLOUDS({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          backgroundColor: 0x23153c,
          skyColor: 0x68b8d7,
          cloudColor: 0xadc1de,
          cloudShadowColor: 0x183550,
          sunColor: 0xff9919,
          sunGlareColor: 0xff6633,
          sunlightColor: 0xff9933,
          speed: 1.0,
        })
      } catch (err) {
        console.error("Vanta initialization failed:", err)
      }
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [])

  return (
    <div 
      ref={vantaRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        width: '100vw', 
        height: '100vh', 
        zIndex: -1,
        pointerEvents: 'none' // Ensure it doesn't block clicks
      }} 
    />
  )
}
