// import React from 'react';
// import Link from 'next/link';
// import { useRouter } from 'next/router';

// interface LayoutProps {
//   children: React.ReactNode;
// }

// const Layout: React.FC<LayoutProps> = ({ children }) => {
//   const router = useRouter();
  
//   const navItems = [
//     { name: 'Home', path: '/' },
//     { name: 'Upload', path: '/upload' },
//     { name: 'Analytics', path: '/analytics' },
//     // { name: 'Predict', path: '/predict' },
//     { name: 'Recommendations', path: '/recommendations' },
//   ];
  
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <nav className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between h-16">
//             <div className="flex">
//               <div className="flex-shrink-0 flex items-center">
//                 <h1 className="text-2xl font-bold text-primary">🔮 Predict Genie</h1>
//               </div>
//               <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
//                 {navItems.map((item) => (
//                   <Link
//                     key={item.path}
//                     href={item.path}
//                     className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
//                       router.pathname === item.path
//                         ? 'border-primary text-gray-900'
//                         : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//                     }`}
//                   >
//                     {item.name}
//                   </Link>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>
      
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {children}
//       </main>
      
//       <footer className="bg-white border-t mt-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//           <p className="text-center text-gray-500 text-sm">
//             © 2026 Predict Genie - AI Marketing Intelligence Platform
//           </p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Layout;
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes } from 'react-icons/fa'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Analytics', path: '/analytics' },
   
    { name: 'Recommendations', path: '/recommendations' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ================= NAVBAR ================= */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
              🔮 Predict Genie
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-10">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <span
                    className={`relative cursor-pointer text-sm font-medium transition ${
                      router.pathname === item.path
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                  >
                    {item.name}

                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] bg-indigo-600 transition-all duration-300 ${
                        router.pathname === item.path ? 'w-full' : 'w-0'
                      }`}
                    />
                  </span>
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>

          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white shadow"
            >
              <div className="flex flex-col items-center py-4 space-y-4">
                {navItems.map((item) => (
                  <Link key={item.path} href={item.path}>
                    <span
                      onClick={() => setMenuOpen(false)}
                      className={`cursor-pointer text-sm font-medium ${
                        router.pathname === item.path
                          ? 'text-indigo-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </nav>

      {/* ================= MAIN ================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 ">
        {children}
      </main>

      {/* ================= CTA SECTION ================= */}
      <div className="text-center py-16 px-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Ready to unlock powerful insights?
        </h2>
        <p className="text-gray-600 mt-2">
          Start using AI-driven predictions today.
        </p>

        <Link href="/upload">
          <button className="mt-6 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition">
            Get Started
          </button>
        </Link>
      </div>

      {/* ================= FOOTER ================= */}
      <footer className="bg-white border-t">

        

        {/* Bottom */}
        <div className="text-center text-sm text-gray-500 border-t py-4">
          © {new Date().getFullYear()} Predict Genie. All rights reserved.
        </div>

      </footer>

    </div>
  )
}

export default Layout