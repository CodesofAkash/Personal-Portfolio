import { Tilt } from "react-tilt"
import { motion } from 'framer-motion'

import {styles} from '../styles'
import { github } from '../assets'
import { SectionWrapper } from "../hoc";
import {projects} from '../constants'
import { fadeIn, textVariant } from "../utils/motion"

const ProjectCard = ({ index, name, description, tags, image, source_code_link, link }) => {
  return (
    <a href={link} target="_blank">
    <motion.div variants={fadeIn("up", "spring", index*0.5, 0.75)}>
      <Tilt
      options={{max: 45, scale: 1, speed: 450}}
      className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
      >
        <div className="relative w-full h-[230px]">
          <img src={image} alt={name} className="w-full h-full object-cover rounded-2xl" />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div onClick={()=>{window.open(source_code_link, "_blank")}} className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer">
              <img src={github} alt="github" className="w-1/2 h-1/2 object-contain" />
            </div>
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-whie font-bold text-[24px]">{name}</h3>
          <p className="mt-2 text-secondary text-[14px]">{description}</p>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((tag)=> {
            return(
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            )
          })}
        </div>
      </Tilt>
    </motion.div>
    </a>
  )
}

const Works = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
        variants={fadeIn("","",0.1, 1)} className="mt-3 text-secondarytext-[17px] max-w-3xl leading-[30px]">
          The following projects highlight my hands-on experience and technical capabilities. They demonstrate my ability to build full-stack applications, manage development workflows, and deliver user-focused solutions using modern web technologies. Each project includes a brief description, tech stack, and links to code repositories and live demos where available.
        </motion.p>
      </div>

      <div className="mt-20 flex justify-center items-center xl:justify-normal flex-wrap xl:flex-nowrap xl:overflow-x-scroll gap-10">
        {projects.map((project, index) => {
          return (
              <ProjectCard key={`project-${index}`} {...project} index={index} />
          )
        })}
      </div>
    </>
  )
}

export default SectionWrapper(Works, "")