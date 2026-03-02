// import { BallCanvas } from "./canvas"
// import { SectionWrapper } from "../hoc"
// import { technologies } from "../constants"

// const Tech = () => {
//   return (
//     <div className="flex flex-row flex-wrap justify-center gap-10">
//       {technologies.map((tech)=>{
//         return(
//           <div className="w-28 h-28" key={tech.name}>
//               <BallCanvas icon={tech.icon} />
//           </div>
//         )
//       })}
//     </div>
//   )
// }

// export default SectionWrapper(Tech, "");




import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"

import { styles } from "../styles"
import { SectionWrapper } from "../hoc"
import { technologies } from "../constants"
import { textVariant } from "../utils/motion"
import BallCanvas from "./canvas/Ball"

/**
 * LazyBall — only mounts the WebGL Canvas when the ball scrolls into view.
 *
 * This is the fix for "Too many active WebGL contexts":
 * Browsers cap WebGL contexts at ~8-16. With 13 tech items each having
 * their own <Canvas>, we blow past that limit instantly.
 *
 * Solution: use IntersectionObserver to mount the Canvas only when visible,
 * and unmount it when it leaves the viewport. Max ~4-6 active at any time.
 */
const LazyBall = ({ icon, name }) => {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasBeenVisible, setHasBeenVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          setHasBeenVisible(true)
        } else {
          // Unmount canvas when out of view to free WebGL context
          setIsVisible(false)
        }
      },
      {
        // Start loading slightly before it enters viewport
        rootMargin: "100px",
        threshold: 0.1,
      }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="w-28 h-28"
      title={name}
    >
      {isVisible ? (
        <BallCanvas icon={icon} />
      ) : hasBeenVisible ? (
        // Keep placeholder same size after unmount to prevent layout shift
        <div className="w-full h-full rounded-full bg-tertiary animate-pulse opacity-30" />
      ) : (
        // Initial placeholder before first visibility
        <div className="w-full h-full rounded-full bg-tertiary opacity-20" />
      )}
    </div>
  )
}

const Tech = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I work with</p>
        <h2 className={styles.sectionHeadText}>Tech Stack.</h2>
      </motion.div>

      <div className="flex flex-row flex-wrap justify-center gap-10 mt-10">
        {technologies.map((technology) => (
          <LazyBall
            key={technology.name}
            icon={technology.icon}
            name={technology.name}
          />
        ))}
      </div>
    </>
  )
}

export default SectionWrapper(Tech, "")