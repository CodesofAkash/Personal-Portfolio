import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home     from './pages/Home'
import About    from './pages/About'
import Projects from './pages/Projects'
import Contact  from './pages/Contact'
import Privacy  from './pages/Privacy'
import Terms    from './pages/Terms'

const App = () => {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="relative z-0 bg-primary min-h-screen flex flex-col">
        <Navbar />
        {/* pt-[68px] pushes ALL page content below the fixed navbar — fixes the overlap */}
        <main className="flex-1 pt-[68px]">
          <Routes>
            <Route path="/"         element={<Home />}     />
            <Route path="/about"    element={<About />}    />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact"  element={<Contact />}  />
            <Route path="/privacy"  element={<Privacy />}  />
            <Route path="/terms"    element={<Terms />}    />
          </Routes>
        </main>
        <Footer />
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </BrowserRouter>
  )
}

export default App