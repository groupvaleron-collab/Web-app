'use client'

import { Search, Calculator, FileText, Ship, Shield, Car, ArrowRight, CreditCard, Gavel, Package, CheckCircle2 } from 'lucide-react'
import { processSteps } from '@/data/mockData'

const iconMap: Record<string, React.ReactNode> = {
  Search: <Search className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Calculator: <Calculator className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  CreditCard: <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Gavel: <Gavel className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  FileText: <FileText className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Package: <Package className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Ship: <Ship className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Shield: <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
  Car: <Car className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />,
}

export default function ImportProcess() {
  return (
    <section className="relative py-16 sm:py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-30" />
      
      {/* Decorative elements - hidden on mobile for performance */}
      <div className="hidden sm:block absolute top-20 left-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px]" />
      <div className="hidden sm:block absolute bottom-20 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-slate-900/5 rounded-full blur-[100px] md:blur-[150px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-slate-900 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 shadow-lg shadow-slate-900/20">
            <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Trusted Import Process
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-4 sm:mb-6 tracking-tight">
            Your <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">9-Step</span> Journey
          </h2>
          <p className="text-sm sm:text-base md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-2">
            From requirement identification to delivery, we handle every step with complete transparency.
          </p>
        </div>

        {/* Vertical Process Timeline */}
        <div className="relative">
          {/* Vertical Connection Line */}
          <div className="absolute left-5 sm:left-8 md:left-1/2 top-0 bottom-0 w-0.5 sm:w-1 bg-gradient-to-b from-slate-300 via-slate-900 to-slate-300 md:-translate-x-1/2 rounded-full" />

          <div className="space-y-4 sm:space-y-6 md:space-y-8">
            {processSteps.map((step, index) => {
              const isOdd = step.step % 2 === 1
              const isFinal = step.step === 9
              return (
                <div 
                  key={step.step} 
                  className={`relative flex items-center gap-4 sm:gap-6 md:gap-0 ${
                    isOdd ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Step Number Circle */}
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 z-10">
                    <div className="relative">
                      <div className={`absolute inset-0 w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 rounded-xl sm:rounded-2xl blur-sm sm:blur-md ${isFinal ? 'bg-slate-400/30' : 'bg-slate-900/20'}`} />
                      <div className={`relative w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-sm sm:text-lg md:text-xl shadow-xl sm:shadow-2xl transition-all duration-300 ${
                        isFinal 
                          ? 'bg-gradient-to-br from-slate-300 via-slate-200 to-slate-400 text-slate-900 shadow-slate-400/40 border border-slate-300' 
                          : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-slate-900/40 border border-slate-700'
                      }`}>
                        {step.step}
                      </div>
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`ml-14 sm:ml-20 md:ml-0 md:w-[calc(50%-4rem)] ${
                    isOdd ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'
                  }`}>
                    <div className={`group relative p-4 sm:p-6 md:p-10 rounded-xl sm:rounded-2xl md:rounded-3xl border transition-all duration-500 hover:shadow-xl md:hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 min-h-[120px] sm:min-h-[160px] md:h-[220px] flex items-center overflow-hidden ${
                      isFinal 
                        ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-300 hover:border-slate-400' 
                        : 'bg-white border-slate-200/80 hover:border-slate-300'
                    }`}>
                      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                        isFinal ? 'bg-gradient-to-br from-slate-200 to-slate-100' : 'bg-gradient-to-br from-slate-50 to-white'
                      }`} />
                      
                      {/* Decorative corner - hidden on mobile */}
                      <div className={`hidden sm:block absolute top-0 ${isOdd ? 'right-0' : 'left-0'} w-16 h-16 md:w-24 md:h-24 bg-gradient-to-br ${isFinal ? 'from-slate-400/20' : 'from-slate-900/5'} to-transparent rounded-bl-[60px] md:rounded-bl-[100px] ${isOdd ? 'rounded-tr-2xl md:rounded-tr-3xl' : 'rounded-tl-2xl md:rounded-tl-3xl'}`} />
                      
                      <div className={`relative flex items-center gap-3 sm:gap-4 md:gap-6 w-full ${
                        isOdd ? 'md:flex-row-reverse' : 'md:flex-row'
                      }`}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 md:group-hover:scale-110 transition-all duration-300 ${
                          isFinal 
                            ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900 border border-slate-400/50' 
                            : 'bg-gradient-to-br from-slate-100 to-slate-200 text-slate-800 border border-slate-300/50'
                        }`}>
                          {iconMap[step.icon]}
                        </div>
                        <div className={`flex-grow min-w-0 ${isOdd ? 'md:text-right' : 'md:text-left'}`}>
                          <h3 className="font-bold text-slate-900 mb-1 sm:mb-2 md:mb-3 text-sm sm:text-base md:text-xl">{step.title}</h3>
                          <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed line-clamp-3 sm:line-clamp-none">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="hidden md:block md:w-[calc(50%-4rem)]" />
                </div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12 sm:mt-16 md:mt-24 px-2">
          <div className="inline-block p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 shadow-xl sm:shadow-2xl shadow-slate-900/30">
            <p className="text-slate-300 mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">Ready to start your import journey?</p>
            <a href="/stocks" className="inline-flex items-center gap-2 sm:gap-3 bg-white text-slate-900 px-5 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1">
              Browse Vehicles
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
