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
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-0 w-96 h-96 bg-slate-900/5 rounded-full blur-[120px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-sm uppercase tracking-wider mb-4">
            <span className="w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            FAQ
            <span className="w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="section-title">
            Frequently Asked <span className="text-gradient">Questions</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to know about our vehicle import services
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`rounded-2xl border transition-all duration-500 ${
                openIndex === index
                  ? 'border-slate-900/30 bg-slate-100'
                  : 'border-slate-200 bg-white hover:border-slate-900/20 hover:shadow-lg'
              }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    openIndex === index 
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                      : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}>
                    <HelpCircle className="w-5 h-5" />
                  </div>
                  <span className={`font-semibold transition-colors ${
                    openIndex === index ? 'text-slate-900' : 'text-slate-800'
                  }`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  className={`w-5 h-5 transition-all duration-300 flex-shrink-0 ${
                    openIndex === index ? 'rotate-180 text-slate-800' : 'text-slate-400'
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-500 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Help */}
        <div className="mt-14 p-8 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-100 border border-slate-300 text-center">
          <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-300">
            <MessageCircle className="w-7 h-7 text-slate-800" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">Still have questions?</h3>
          <p className="text-slate-600 mb-6">
            Our team is ready to assist you with any inquiries about vehicle imports.
          </p>
          <a
            href="#contact"
            className="btn-primary inline-flex items-center gap-2"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  )
}
