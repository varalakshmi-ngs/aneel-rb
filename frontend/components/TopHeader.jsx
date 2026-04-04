// "use client";

// import Link from "next/link";

// export default function TopHeader() {
//   return (
//     <header className="fixed top-0 left-0 w-full bg-[#0A2222] shadow-md z-50 transition-all duration-300">
//       <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        
//         {/* Left Side - Logo */}
//         <Link href="/" className="flex items-center space-x-2">
//           <div className="bg-white p-1 rounded">
//             <img
//               src="/images/Logo-removebg-preview1 (1).png"
//               alt="Logo"
//               className="h-12 w-auto"
//             />
//           </div>
//         </Link>

//         {/* Center - Company Name (Visible only on Desktop) */}
//         <div className="hidden md:flex items-center justify-center text-center">
//           <h1 className="text-white text-lg lg:text-3xl font-semibold tracking-wide">
//             RK4CES Soft Solutions Ltd{" "}
//             <span className="text-[#C8F169] ml-3 lg:text-xl">Since 1995</span>
//           </h1>
//         </div>

//         {/* Right Side - Free Consultation Button (Visible on all screens) */}
//         <div className="flex items-center space-x-4">
//           <Link
//             href="/contactus"
//             className="px-4 md:px-5 py-2 bg-gradient-to-r from-[#C8F169] to-[#039397] text-white rounded-full hover:from-[#039397] hover:to-[#C8F169] transition duration-300 text-sm md:text-base"
//           >
//             Free Consultation
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// }
