import {React, useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

import {styles} from "../styles"
import {navLinks} from "../constants"
import {logo, menu, close} from "../assets"

const Navbar = () => {

  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(true);

  return (
    <nav className={`${styles.paddingX} w-full min-h-fit flex items-center py-5 fixed top-0 z-20 bg-primary px-5`}>
      <div className='w-full min-h-fit flex justify-between items-center max-w-7xl mx-auto'>
        <Link
        to={"/"}
        className='flex justify-around items-center gap-2'
        onClick={()=>{
          setActive("");
          window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className='w-9 h-1w-9 object-contain mr-2' />
          <p className='text-white text-[18px] font-bold cursor-pointer flex items-center flex-wrap mr-10'>Akash Sharma&nbsp;|&nbsp;<span className='sm:block hidden'>CodesOfAkash</span></p>
          </Link>
          <ul className='hidden sm:flex gap-10'>
            {navLinks.map((link)=>(
              <li key={link.id} onClick={()=>{setActive(link.title)}} className={`${active === link.title?"text-white":"text-secondary"} hover:text-white text-[18px] font-medium cursor-pointer`}>
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
          <div className='sm:hidden flex flex-1 justify-end items-center'>
            <img src={toggle?menu:close} alt="menu" className='w-[28px] h-[28px] object-contain cursor-pointer' onClick={()=>setToggle(!toggle)} />
            <div className={`${toggle?"hidden":"flex"} p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}>
            <ul className='list-none flex flex-col gap-4 justify-end items-start'>
            {navLinks.map((link)=>(
              <li key={link.id} onClick={()=>{setActive(link.title); setToggle(!toggle)}} className={`${active === link.title?"text-white":"text-secondary"} font-poppins font-medium cursor-pointer text-[16px] hover:text-white text-secondary`}>
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>
            </div>
          </div>
      </div>
    </nav>
  )
}

export default Navbar