import { lazy } from 'react';
import Hero from './Hero';
import Navbar from './Navbar';
import Contact from './Contact';
import Footer from './Footer';

const EarthCanvas = lazy(() => import('./canvas/Earth'));
const BallCanvas = lazy(() => import('./canvas/Ball'));
const ComputersCanvas = lazy(() => import('./canvas/Computers'));
const StarsCanvas = lazy(() => import('./canvas/Stars'));

export {
  Hero,
  Navbar,
  Contact,
  Footer,
  EarthCanvas, 
  BallCanvas, 
  ComputersCanvas, 
  StarsCanvas
}