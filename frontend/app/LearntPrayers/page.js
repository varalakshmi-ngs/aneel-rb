'use client';

import React from 'react';
import { motion } from 'framer-motion';
// Use explicit paths assuming typical Next.js structure
import TopBar from '@/components/TopBar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LearntPrayers() {
  const prayers = [
    {
      month: 'March',
      title: 'Prayer of Renewal and Reflection',
      body: 'Heavenly Father, as we journey through the month of March, we ask for a spirit of deep reflection and renewal. Guide our hearts during this season of spiritual preparation, that we may quiet our minds and draw closer to You. Help us to shed the burdens of our past and embrace the grace You so freely offer. May our spirits be cleansed, our faith strengthened, and our lives transformed by Your enduring love. In Jesus’ name, Amen.',
    },
    {
      month: 'April',
      title: 'Prayer of Joyous Resurrection',
      body: 'Lord God Almighty, we welcome the month of April with hearts full of rejoicing! We celebrate Your glorious promises, which bring light to our darkest days and hope to our weary souls. As the earth blooms with new life this spring, let our spirits also bloom with the unending joy of Your salvation. May the triumph of Your love inspire us to live boldly in Your truth and share Your blessings with the world. In the name of Jesus, Amen.',
    }
  ];

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen flex flex-col overflow-x-hidden">
      <TopBar />
      <Header />
      
      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-24 bg-gradient-to-b from-[#022147] to-[#04336B] flex justify-center items-center text-center px-4">
        <div className="absolute inset-0 overflow-hidden">
           {/* Abstract decorative elements */}
           <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F74F22]/20 rounded-full blur-3xl"></div>
           <div className="absolute top-1/2 -left-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="uppercase tracking-widest text-[#F74F22] font-semibold text-sm mb-4 block"
          >
            Spiritual Guidance
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          >
            Learnt Prayers
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 font-light max-w-2xl mx-auto"
          >
            A collection of guided monthly prayers designed to uplift your spirit, anchor your heart in faith, and bring peace to your daily walk.
          </motion.p>
        </div>
      </section>

      {/* Prayers List */}
      <section className="py-24 px-6 max-w-7xl mx-auto flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {prayers.map((prayer, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="bg-white rounded-3xl shadow-[0_10px_40px_rgba(2,_33,_71,_0.06)] overflow-hidden border border-gray-100 flex flex-col group hover:shadow-[0_20px_50px_rgba(247,_79,_34,_0.1)] transition-all duration-500"
            >
              {/* Card Banner */}
              <div className="h-48 bg-[#022147] flex items-center justify-center relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-tr from-[#022147] to-blue-800 opacity-90 z-0"></div>
                 
                 {/* Decorative large text */}
                 <h2 className="text-8xl font-black text-white/5 absolute -bottom-6 -right-6 select-none z-0 transform group-hover:scale-110 transition-transform duration-700">
                    {prayer.month.substring(0,3).toUpperCase()}
                 </h2>
                 
                 <div className="relative z-10 flex flex-col items-center">
                    <span className="bg-[#F74F22] text-white font-bold px-8 py-2.5 rounded-full shadow-lg text-lg tracking-wide uppercase">
                        {prayer.month}
                    </span>
                 </div>
              </div>
              
              {/* Card Body */}
              <div className="p-8 md:p-12 flex-1 flex flex-col relative">
                {/* Decorative quote mark */}
                <div className="absolute top-6 left-6 text-7xl text-gray-100 font-serif leading-none select-none z-0">&quot;</div>
                
                <h3 className="text-2xl font-bold text-[#022147] mb-6 relative z-10">{prayer.title}</h3>
                <p className="text-gray-600 leading-relaxed text-lg flex-1 relative z-10 font-serif italic text-justify">
                  {prayer.body}
                </p>
                <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center relative z-10">
                   <div className="w-12 h-1 bg-[#F74F22] rounded-full"></div>
                   <span className="text-sm text-gray-400 font-bold tracking-widest uppercase">Amen</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
