"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Cpu, 
  Database, 
  Globe, 
  Activity, 
  Zap, 
  Lock, 
  Eye 
} from 'lucide-react';

const features = [
  {
    title: 'Adaptive AI Authentication',
    description: 'Our AI dynamically adjusts authentication challenges based on real-time risk scores.',
    icon: Zap,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    title: 'Behavioral Biometrics',
    description: 'Identify users by their unique typing rhythm and mouse movement patterns.',
    icon: Cpu,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    title: 'Zero-Trust Infrastructure',
    description: 'Enforce strict identity verification for every user, device, and application.',
    icon: ShieldCheck,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    title: 'Real-Time Threat Detection',
    description: 'Detect impossible travel, brute-force attempts, and credential stuffing instantly.',
    icon: Activity,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
  },
  {
    title: 'Global Risk Analytics',
    description: 'Unified dashboard providing deep insights into your security posture.',
    icon: Globe,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
  },
  {
    title: 'Device Fingerprinting',
    description: 'Verify the integrity and identity of every device accessing your resources.',
    icon: Lock,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-slate-950/50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Security Features for the <span className="text-blue-400 text-glow">Modern Enterprise</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-400"
          >
            Deploy enterprise-grade security in minutes. Our unified platform 
            handles the complexity so you can focus on your core business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-panel p-8 hover:border-blue-500/30 transition-all cursor-pointer group"
            >
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
