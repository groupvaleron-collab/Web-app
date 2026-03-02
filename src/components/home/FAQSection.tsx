'use client'

import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react'
import { faqs } from '@/data/mockData'

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-1/3 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="hidden sm:block absolute bottom-1/3 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            FAQ
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600">
            Everything you need to know about our vehicle import services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                openIndex === index
                  ? 'border-slate-900/30 bg-slate-100'
                  : 'border-slate-200 bg-white hover:border-slate-900/20 hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left gap-3"
              >
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <span className={`font-semibold text-sm sm:text-base transition-colors ${
                    openIndex === index ? 'text-slate-900' : 'text-slate-800'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180 text-slate-800' : 'text-slate-400'
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-4 sm:px-5 md:px-6 pb-4 sm:pb-5 md:pb-6 pl-[52px] sm:pl-[68px] md:pl-20">
                  <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-10 sm:mt-12 md:mt-14 p-5 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4 border border-slate-300">
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-slate-800" />
          </div>
          <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-1.5 sm:mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Our team is ready to assist you with any inquiries about vehicle imports.
          </p>
          <a
            href="#contact"
            className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base py-2.5 sm:py-3"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}
