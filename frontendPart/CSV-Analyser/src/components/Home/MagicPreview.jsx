import React, { useState } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
// import { LightningBoltIcon, ChatBubbleIcon, CubeIcon, RocketIcon } from '@radix-ui/react-icons';
import { Zap , MessageCircle, Box, Rocket} from 'lucide-react';
import dataInjection from "../../assets/dataInjection.jpg"
import smartVisu from "../../assets/smartVisu.jpg"
// import Beam from './Beam';




const DataFlowShowcase = () => {
  const [activeStep, setActiveStep] = useState(0);
  const controls = useAnimation();
  
  const steps = [
    {
      title: "Data Ingestion",
      description: "Drag & drop any CSV/Excel file",
      icon: <Box className="w-6 h-6" />,
      color: "from-purple-500 to-indigo-600"
    },
    {
      title: "AI Analysis",
      description: "Our engine performs automatic EDA",
      icon: <Zap className="w-6 h-6" />,
      color: "from-amber-500 to-pink-600"
    },
    {
      title: "Smart Visualization",
      description: "Relevant charts generated automatically",
      icon: <Rocket className="w-6 h-6" />,
      color: "from-emerald-500 to-cyan-600"
    },
    {
      title: "Conversational Insights",
      description: "Ask questions in natural language",
      icon: <MessageCircle className="w-6 h-6" />,
      color: "from-blue-500 to-violet-600"
    }
  ];

  const handleStepChange = async (index) => {
    await controls.start({ opacity: 0, x: -20 });
    setActiveStep(index);
    await controls.start({ opacity: 1, x: 0 });
  };

  return (
    <div className="relative py-24 bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      {/* Floating data nodes */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white shadow-sm border border-gray-200"
          initial={{
            x: Math.random() * 100 - 50,
            y: Math.random() * 100 - 50,
            width: Math.random() * 40 + 10,
            height: Math.random() * 40 + 10,
            opacity: 0.3
          }}
          animate={{
            x: [null, Math.random() * 100 - 50],
            y: [null, Math.random() * 100 - 50],
            transition: {
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold text-gray-900 mb-6"
          >
            The <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">AI-Powered</span> Data Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto"
          >
            Watch how AnalyseIQ transforms raw data into stunning visualizations and actionable insights
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Interactive steps */}
          <div className="space-y-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className={`p-6 rounded-2xl cursor-pointer transition-all ${activeStep === index ? 'bg-white shadow-xl' : 'bg-white/50 shadow-md hover:shadow-lg'}`}
                onClick={() => handleStepChange(index)}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${step.color} text-white`}>
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-gray-600 mt-1">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Animated visualization */}
          <div className="relative h-96">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 50 }}
                animate={controls}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200"
              >
                {activeStep === 0 && (
                  <div className="h-full flex flex-col items-center justify-center p-8">
                    <div className="relative w-64 h-64">
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                          transition: { duration: 2, repeat: Infinity }
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-lg flex items-center justify-center"
                      >
                        <div className="text-center">
                          <img src={dataInjection} alt='dropData' />
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeStep === 1 && (
                  <div className="h-full p-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Analyzing Your Data</h3>
                    </div>
                    <div className="space-y-4">
                      {['Cleaning data', 'Detecting patterns', 'Finding correlations', 'Identifying outliers'].map((text, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.2 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                          <span className="text-gray-700">{text}</span>
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      animate={{ 
                        scaleX: [0.2, 1, 0.2],
                        transition: { duration: 3, repeat: Infinity } 
                      }}
                      className="mt-8 h-2 bg-gradient-to-r from-amber-400 to-pink-500 rounded-full"
                    />
                  </div>
                )}

                {activeStep === 2 && (
                  <div className="h-full p-6">
                    <div className="flex justify-center items-center gap-4 h-full">
                      
                        <motion.div
                          
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 1 * 0.1 + 0.3 }}
                          
                        >

                          <div className="text-center flex justify-center">
                            <img src={smartVisu} alt="" className='w-[70%] h-[70%]' />
                          </div>
                        </motion.div>
                      
                    </div>
                  </div>
                )}

                {activeStep === 3 && (
                  <div className="h-full p-6 flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <MessageCircle className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-semibold">Chat with Your Data</h3>
                    </div>
                    <div className="flex-1 bg-gray-50 rounded-lg p-4 flex flex-col">
                      <div className="mb-4">
                        <div className="inline-block px-4 py-2 bg-white rounded-t-lg rounded-r-lg shadow-sm">
                          <p className="text-gray-800">Show sales by region</p>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="inline-block px-4 py-2 bg-indigo-100 rounded-t-lg rounded-l-lg shadow-sm self-end"
                      >
                        <p className="text-gray-800">Here's your regional sales breakdown:</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-4 bg-white rounded-lg p-3 shadow-sm"
                      >
                        <div className="h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded flex items-center justify-center">
                          <span className="text-gray-500">Generated visualization</span>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataFlowShowcase;