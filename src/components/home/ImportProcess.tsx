'use client'

import { Search, Calculator, FileText, Ship, Shield, Car, ArrowRight, CreditCard, Gavel, Package, CheckCircle2 } from 'lucide-react'
import { processSteps } from '@/data/mockData'

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-8 h-8" />,
  Calculator: <Calculator className="w-8 h-8" />,
  CreditCard: <CreditCard className="w-8 h-8" />,
  Gavel: <Gavel className="w-8 h-8" />,
  FileText: <FileText className="w-8 h-8" />,
  Package: <Package className="w-8 h-8" />,
  Ship: <Ship className="w-8 h-8" />,
  Shield: <Shield className="w-8 h-8" />,
  Car: <Car className="w-8 h-8" />,
}

export default function ImportProcess() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[150px]" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-slate-900/5 rounded-full blur-[150px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-slate-900/3 rounded-full blur-[200px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-medium mb-6 shadow-lg shadow-slate-900/20">
            <CheckCircle2 className="w-4 h-4" />
            Trusted Import Process
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight">
            Your <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">9-Step</span> Journey
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            From requirement identification to delivery, we handle every step of your vehicle import journey with complete transparency and professional expertise.
          </p>
        </div>

        {/* Vertical Process Timeline */}
        <div className="relative">
          {/* Vertical Connection Line - Center with gradient */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-300 via-slate-900 to-slate-300 md:-translate-x-1/2 rounded-full" />

          <div className="space-y-8">
            {processSteps.map((step, index) => {
              const isOdd = step.step % 2 === 1 // Odd numbers on left, even on right
              const isFinal = step.step === 9 // Final step gets silver styling
              return (
                <div 
                  key={step.step} 
                  className={`relative flex items-center gap-8 md:gap-0 ${
                    isOdd ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number Circle - Center on desktop */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="relative">
                      {/* Outer glow ring */}
                      <div className={`absolute inset-0 w-20 h-20 rounded-2xl blur-md ${isFinal ? 'bg-slate-400/30' : 'bg-slate-900/20'}`} />
                      {/* Main circle */}
                      <div className={`relative w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl shadow-2xl hover:scale-110 transition-all duration-300 ${
                        isFinal 
                          ? 'bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 text-slate-900 shadow-slate-400/40 border border-slate-300' 
                          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-slate-900/40 border border-slate-700'
                      }`}>
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Card - Odd on left, Even on right */}
                  <div className={`ml-24 md:ml-0 md:w-[calc(50%-4rem)] ${
                    isOdd ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                  }`}>
                    <div className={`group relative p-10 rounded-3xl border transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 h-[220px] flex items-center overflow-hidden ${
                      isFinal 
                        ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-slate-400 hover:shadow-slate-300/60' 
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-slate-200/60'
                    }`}>
                      {/* Card background gradient on hover */}
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isFinal ? 'bg-gradient-to-br from-slate-200 to-slate-100' : 'bg-gradient-to-br from-slate-50 to-white'
                      }`} />
                      
                      {/* Decorative corner accent */}
                      <div className={`absolute top-0 ${isOdd ? 'right-0' : 'left-0'} w-24 h-24 bg-gradient-to-br ${isFinal ? 'from-slate-400/20' : 'from-slate-900/5'} to-transparent rounded-bl-[100px] ${isOdd ? 'rounded-tr-3xl' : 'rounded-tl-3xl'}`} />
                      
                      <div className={`relative flex items-center gap-6 w-full ${
                        isOdd ? 'md:flex-row-reverse' : 'md:flex-row'
                      }`}>
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300 ${
                          isFinal 
                            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 border border-slate-400/50' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border border-slate-300/50'
                        }`}>
                          {iconMap[step.icon]}
                        </div>
                        <div className={`flex-grow ${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                          <h3 className="font-bold text-slate-900 mb-3 text-xl">{step.title}</h3>
                          <p className="text-base text-slate-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Empty space for opposite side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-4rem)]" />
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-24">
          <div className="inline-block p-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-2xl shadow-slate-900/30">
            <p className="text-slate-300 mb-6 text-lg">Ready to start your import journey?</p>
            <a href="/stocks" className="inline-flex items-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Browse Available Vehicles
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
