import { motion } from 'framer-motion'
import { styles } from '../styles'
import { ComputersCanvas } from './canvas'

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto overflow-hidden'>

      {/* ── Canvas fills entire hero behind everything ── */}
      <div className='absolute inset-0' style={{ zIndex: 1 }}>
        <ComputersCanvas />
      </div>

      {/* ── Text layer — sits above canvas, top-left area ── */}
      <div
        className={`${styles.paddingX} absolute inset-0 top-[20px] max-w-7xl mx-auto flex items-start gap-5`}
        style={{ zIndex: 10, pointerEvents: 'none' }}
      >
        {/* Vertical accent line */}
        <div className='flex flex-col justify-center items-center mt-1'>
          <div className='w-5 h-5 rounded-full' style={{ background: '#7c3aed' }} />
          <div className='w-1 sm:h-80 h-40 violet-gradient' />
        </div>

        {/* Copy block — constrained width so it doesn't bleed into model */}
        <div style={{ maxWidth: '520px', pointerEvents: 'auto' }}>
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='text-xs uppercase tracking-widest mb-4 font-semibold'
            style={{ color: '#0d9488', letterSpacing: '0.18em' }}
          >
            Full-Stack Developer · Available for hire
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className={`${styles.heroHeadText} text-white`}
          >
            Hi, I'm{' '}
            <span style={{ color: '#7c3aed' }}>Akash.</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className='mt-4'
          >
            {/* Subheadline — same heroSubText class as before, full size */}
            <p
              className={`${styles.heroSubText}`}
              style={{ color: '#e2e8f0', marginBottom: '10px' }}
            >
              Full-stack developer. Self-taught. Fast learner.
            </p>
            {/* Supporting line — bumped from 14px to 16px */}
            <p
              style={{
                fontSize: '16px',
                lineHeight: '1.7',
                color: '#d6d6d6',
                maxWidth: '480px',
              }}
            >
              Two years of self-teaching, multiple projects in production,
              and AI as a daily tool — not to replace my thinking,
              but to sharpen it and ship faster.
            </p>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='flex flex-wrap gap-4 mt-8'
          >
            <a
              href='/projects'
              className='px-8 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105 hover:shadow-lg'
              style={{
                fontSize: '15px',
                background: 'linear-gradient(135deg,#7c3aed,#0d9488)',
              }}
            >
              See my work →
            </a>
            <a
              href='/contact'
              className='px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 border'
              style={{
                fontSize: '15px',
                borderColor: 'rgba(124,58,237,0.5)',
                color: '#f8fafc',
                background: 'rgba(124,58,237,0.1)',
              }}
            >
              Get in touch
            </a>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div
        className='absolute xs:bottom-24 bottom-32 w-full flex justify-center items-center'
        style={{ zIndex: 10 }}
      >
        <a href='#about'>
          <div
            className='w-[35px] h-[64px] rounded-3xl border-4 flex justify-center items-start p-2'
            style={{ borderColor: '#475569' }}
          >
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
              className='w-3 h-3 rounded-full mb-1'
              style={{ background: '#7c3aed' }}
            />
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero