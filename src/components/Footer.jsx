import { motion } from "framer-motion";
import { github } from "../assets";

const Footer = () => {
const socialLinks = [
    {
        name: "GitHub",
        url: "https://github.com/CodesofAkash",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/github.svg",
    },
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/codesofakash/",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg",
    },
    {
        name: "Twitter / X",
        url: "https://x.com/CodesOfAkash",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/twitter.svg",
    },
    {
        name: "Email",
        url: "mailto:akashcodesharma@gmail.com",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/gmail.svg",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/codesofakash",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg",
    },
];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-gray-700 py-8 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-16">
        <div className="flex flex-col items-center space-y-6">
          <motion.div 
            className="flex space-x-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-3 bg-tertiary rounded-full hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={link.icon}
                  alt={link.name}
                  className="w-6 h-6 object-contain filter invert"
                />
                <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </motion.div>

          <motion.div 
            className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          />

          <motion.div 
            className="text-center space-y-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-secondary text-sm italic">
              &quot;Code is poetry written in logic&quot;
            </p>
            <p className="text-gray-400 text-sm">
              © {currentYear} Akash Sharma. Crafted with ❤️ and React
            </p>
          </motion.div>

          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center space-x-2 text-secondary hover:text-white transition-colors duration-300"
            whileHover={{ y: -2 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <span className="text-sm">Back to top</span>
            <svg 
              className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
