"use client"

import { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const [isHovered, setIsHovered] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)

  const springConfig = { damping: 25, stiffness: 400 }
  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)

  useEffect(() => {
    setIsMounted(true)
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX)
      cursorY.set(e.clientY)
    }

    const handleHoverStart = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") ||
        target.getAttribute("role") === "button"
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener("mousemove", moveCursor)
    window.addEventListener("mouseover", handleHoverStart)

    return () => {
      window.removeEventListener("mousemove", moveCursor)
      window.removeEventListener("mouseover", handleHoverStart)
    }
  }, [cursorX, cursorY])

  if (!isMounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[99999] mix-blend-difference hidden md:block">
      {/* Outer Ring */}
      <motion.div
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 60 : 30,
          height: isHovered ? 60 : 30,
          opacity: 0.5,
          border: isHovered ? "1px solid var(--primary)" : "1px solid white",
        }}
        className="rounded-full absolute"
      />
      {/* Inner Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: isHovered ? 4 : 6,
          height: isHovered ? 4 : 6,
          backgroundColor: isHovered ? "var(--primary)" : "white",
        }}
        className="rounded-full absolute"
      />
    </div>
  )
}
