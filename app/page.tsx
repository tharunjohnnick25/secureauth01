import React from 'react';
import LandingNavbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import RiskVisualization from '@/components/landing/RiskVisualization';
import BiometricsShowcase from '@/components/landing/BiometricsShowcase';
import WorkflowDiagram from '@/components/landing/WorkflowDiagram';
import UseCases from '@/components/landing/UseCases';
import Pricing from '@/components/landing/Pricing';
import { FAQ, LandingFooter } from '@/components/landing/Footer';
import { Testimonials, Contact } from '@/components/landing/ExtraSections';

export default function Home() {
  return (
    <main className="min-h-screen bg-cyber-dark selection:bg-cyber-blue selection:text-black">
      <LandingNavbar />
      
      <div className="relative">
        <Hero />
        <Features />
        <UseCases />
        <WorkflowDiagram />
        <BiometricsShowcase />
        <RiskVisualization />
        <Testimonials />
        <Pricing />
        <FAQ />
        <Contact />
      </div>

      <LandingFooter />
    </main>
  );
}
