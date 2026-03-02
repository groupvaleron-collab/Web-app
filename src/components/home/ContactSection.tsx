'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, CheckCircle, ArrowRight } from 'lucide-react'

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    
    setTimeout(() => setIsSubmitted(false), 5000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact" className="relative py-12 sm:py-16 md:py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-slate-50 to-white" />
      <div className="absolute inset-0 grid-bg opacity-50" />
      
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden sm:block absolute top-1/4 right-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />
      <div className="hidden sm:block absolute bottom-1/4 left-0 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-slate-900/5 rounded-full blur-[80px] md:blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 text-slate-800 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-slate-900" />
            Get In Touch
            <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-slate-900" />
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 sm:mb-4">
            Contact <span className="text-gradient">Us</span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-2">
            Have questions about importing a vehicle? Our team is ready to assist you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6 order-2 lg:order-1">
            {/* Contact Cards */}
            <div className="group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-800 flex-shrink-0 border border-slate-300 group-hover:scale-105 md:group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Phone</h3>
                  <a href="tel:0770376789" className="text-slate-800 hover:text-slate-900 font-medium text-sm sm:text-base">
                    077 037 6789
                  </a>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">Mon - Sat, 9am - 6pm</p>
                </div>
              </div>
            </div>

            <div className="group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-800 flex-shrink-0 border border-slate-300 group-hover:scale-105 md:group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Email</h3>
                  <a href="mailto:info@valeronautomart.lk" className="text-slate-800 hover:text-slate-900 font-medium text-xs sm:text-sm md:text-base truncate block">
                    info@valeronautomart.lk
                  </a>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5 sm:mt-1">We reply within 24 hours</p>
                </div>
              </div>
            </div>

            <div className="group p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl bg-white border border-slate-200 hover:border-slate-900/30 transition-all duration-300 hover:shadow-lg">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-slate-200 rounded-lg sm:rounded-xl flex items-center justify-center text-slate-800 flex-shrink-0 border border-slate-300 group-hover:scale-105 md:group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-800 mb-0.5 sm:mb-1 text-sm sm:text-base">Location</h3>
                  <p className="text-slate-600 text-sm sm:text-base">123 Main Street</p>
                  <p className="text-slate-600 text-sm sm:text-base">Colombo 03, Sri Lanka</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/94770376789"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 sm:gap-3 w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 sm:py-3.5 md:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg shadow-slate-800/20 hover:shadow-slate-800/30 text-sm sm:text-base"
            >
              <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="p-4 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white border border-slate-200 shadow-lg shadow-slate-200/30">
              {isSubmitted ? (
                <div className="text-center py-8 sm:py-10 md:py-12">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-slate-300">
                    <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-slate-800" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2 sm:mb-3">Message Sent!</h3>
                  <p className="text-slate-600 text-sm sm:text-base">Thank you for contacting us. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="input-field text-sm sm:text-base"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="input-field text-sm sm:text-base"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input-field text-sm sm:text-base"
                        placeholder="077 XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="input-field text-sm sm:text-base"
                      >
                        <option value="">Select a subject</option>
                        <option value="inquiry">General Inquiry</option>
                        <option value="import">Vehicle Import</option>
                        <option value="auction">Auction Request</option>
                        <option value="shipping">Shipping Status</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1.5 sm:mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="input-field resize-none text-sm sm:text-base"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary flex items-center justify-center gap-2 py-3 sm:py-3.5 md:py-4 text-sm sm:text-base"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
