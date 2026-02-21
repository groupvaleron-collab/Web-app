'use client'

import { useState, useMemo } from 'react'
import { useSession } from 'next-auth/react'
import { 
  Calculator, 
  DollarSign, 
  Ship, 
  Shield, 
  FileText, 
  Car, 
  Percent, 
  Plus,
  Download,
  Save,
  RefreshCw,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react'

interface CalculatorInput {
  auctionPrice: number
  freightCost: number
  insurance: number
  clearingCharges: number
  registrationCost: number
  taxPercentage: number
  otherCharges: number
}

interface SavedCalculation {
  id: string
  name: string
  date: string
  input: CalculatorInput
  output: CalculatorOutput
}

interface CalculatorOutput {
  cifValue: number
  taxAmount: number
  totalLandingCost: number
  estimatedFinalCost: number
}

export default function CalculatorPage() {
  const { data: session } = useSession()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [savedCalculations, setSavedCalculations] = useState<SavedCalculation[]>([])

  const [inputs, setInputs] = useState<CalculatorInput>({
    auctionPrice: 0,
    freightCost: 150000,
    insurance: 25000,
    clearingCharges: 75000,
    registrationCost: 50000,
    taxPercentage: 200,
    otherCharges: 0,
  })

  const handleInputChange = (key: keyof CalculatorInput, value: string) => {
    const numValue = parseFloat(value) || 0
    setInputs(prev => ({ ...prev, [key]: numValue }))
  }

  const calculations = useMemo<CalculatorOutput>(() => {
    // CIF Value = Auction Price + Freight + Insurance
    const cifValue = inputs.auctionPrice + inputs.freightCost + inputs.insurance

    // Tax Amount = CIF Value × Tax Percentage / 100
    const taxAmount = (cifValue * inputs.taxPercentage) / 100

    // Total Landing Cost = CIF Value + Tax + Clearing + Registration + Other
    const totalLandingCost = cifValue + taxAmount + inputs.clearingCharges + inputs.registrationCost + inputs.otherCharges

    // Estimated Final Cost (with 5% buffer)
    const estimatedFinalCost = totalLandingCost * 1.05

    return {
      cifValue,
      taxAmount,
      totalLandingCost,
      estimatedFinalCost,
    }
  }, [inputs])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const resetCalculator = () => {
    setInputs({
      auctionPrice: 0,
      freightCost: 150000,
      insurance: 25000,
      clearingCharges: 75000,
      registrationCost: 50000,
      taxPercentage: 200,
      otherCharges: 0,
    })
  }

  const saveCalculation = () => {
    const newCalc: SavedCalculation = {
      id: Date.now().toString(),
      name: `Calculation ${savedCalculations.length + 1}`,
      date: new Date().toISOString(),
      input: inputs,
      output: calculations,
    }
    setSavedCalculations(prev => [...prev, newCalc])
  }

  const exportAsPDF = () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF export feature would be implemented here using jsPDF')
  }

  const inputFields = [
    {
      key: 'auctionPrice',
      label: 'Auction Price',
      icon: DollarSign,
      description: 'Vehicle price at Japanese auction (in LKR)',
      placeholder: 'e.g., 2,500,000',
    },
    {
      key: 'freightCost',
      label: 'Freight Cost',
      icon: Ship,
      description: 'Shipping cost from Japan to Sri Lanka',
      placeholder: 'e.g., 150,000',
    },
    {
      key: 'insurance',
      label: 'Insurance',
      icon: Shield,
      description: 'Marine insurance during shipping',
      placeholder: 'e.g., 25,000',
    },
    {
      key: 'clearingCharges',
      label: 'Clearing Charges',
      icon: FileText,
      description: 'Port and customs clearing fees',
      placeholder: 'e.g., 75,000',
    },
    {
      key: 'registrationCost',
      label: 'Registration Cost',
      icon: Car,
      description: 'DMT registration and number plate',
      placeholder: 'e.g., 50,000',
    },
    {
      key: 'taxPercentage',
      label: 'Tax Percentage',
      icon: Percent,
      description: 'Import duty + PAL + other taxes',
      placeholder: 'e.g., 200',
      suffix: '%',
    },
    {
      key: 'otherCharges',
      label: 'Other Charges',
      icon: Plus,
      description: 'Any additional costs',
      placeholder: 'e.g., 0',
    },
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Vehicle Import Calculator
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Calculate the total cost of importing a vehicle from Japan to Sri Lanka.
            Get a detailed breakdown of all expenses involved.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Input Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary-600" />
                Enter Vehicle Details
              </h2>

              <div className="space-y-5">
                {inputFields.slice(0, showAdvanced ? undefined : 3).map((field) => (
                  <div key={field.key}>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <field.icon className="w-4 h-4 text-primary-500" />
                      {field.label}
                      <button className="group relative">
                        <Info className="w-4 h-4 text-gray-400 hover:text-primary-500" />
                        <span className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-10">
                          {field.description}
                        </span>
                      </button>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        {field.suffix ? '' : 'LKR'}
                      </span>
                      <input
                        type="number"
                        value={inputs[field.key as keyof CalculatorInput] || ''}
                        onChange={(e) => handleInputChange(field.key as keyof CalculatorInput, e.target.value)}
                        className="input-field pl-14 pr-12"
                        placeholder={field.placeholder}
                      />
                      {field.suffix && (
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                          {field.suffix}
                        </span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Toggle Advanced Options */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  {showAdvanced ? (
                    <>
                      <ChevronUp className="w-5 h-5" />
                      Hide Advanced Options
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-5 h-5" />
                      Show Advanced Options
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-100">
                <button
                  onClick={resetCalculator}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reset
                </button>
                {session && (
                  <button
                    onClick={saveCalculation}
                    className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                )}
                <button
                  onClick={exportAsPDF}
                  className="flex items-center gap-2 px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export PDF
                </button>
              </div>
            </div>

            {/* Saved Calculations */}
            {session && savedCalculations.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Calculations</h3>
                <div className="space-y-3">
                  {savedCalculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-primary-50 transition-colors cursor-pointer"
                      onClick={() => setInputs(calc.input)}
                    >
                      <div>
                        <p className="font-medium text-gray-900">{calc.name}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(calc.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="font-semibold text-primary-600">
                        {formatCurrency(calc.output.estimatedFinalCost)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Cost Breakdown
              </h2>

              {/* Cost Items */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Auction Price</span>
                  <span className="font-medium text-gray-900">{formatCurrency(inputs.auctionPrice)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Freight Cost</span>
                  <span className="font-medium text-gray-900">{formatCurrency(inputs.freightCost)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Insurance</span>
                  <span className="font-medium text-gray-900">{formatCurrency(inputs.insurance)}</span>
                </div>
                
                {/* CIF Value */}
                <div className="flex items-center justify-between py-3 bg-gray-50 -mx-2 px-4 rounded-lg">
                  <span className="font-medium text-gray-700">CIF Value</span>
                  <span className="font-bold text-gray-900">{formatCurrency(calculations.cifValue)}</span>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Tax ({inputs.taxPercentage}%)</span>
                  <span className="font-medium text-gray-900">{formatCurrency(calculations.taxAmount)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Clearing Charges</span>
                  <span className="font-medium text-gray-900">{formatCurrency(inputs.clearingCharges)}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-gray-600">Registration</span>
                  <span className="font-medium text-gray-900">{formatCurrency(inputs.registrationCost)}</span>
                </div>
                {inputs.otherCharges > 0 && (
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600">Other Charges</span>
                    <span className="font-medium text-gray-900">{formatCurrency(inputs.otherCharges)}</span>
                  </div>
                )}
              </div>

              {/* Total Landing Cost */}
              <div className="bg-primary-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary-700">Total Landing Cost</span>
                  <span className="text-xl font-bold text-primary-700">
                    {formatCurrency(calculations.totalLandingCost)}
                  </span>
                </div>
              </div>

              {/* Estimated Final Cost */}
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-5 text-white">
                <p className="text-primary-100 text-sm mb-1">Estimated Final Cost</p>
                <p className="text-3xl font-bold">
                  {formatCurrency(calculations.estimatedFinalCost)}
                </p>
                <p className="text-primary-200 text-xs mt-2">
                  * Includes 5% buffer for unexpected costs
                </p>
              </div>

              {/* Disclaimer */}
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">
                This is an estimate only. Actual costs may vary based on vehicle specifications,
                exchange rates, and current duty structures. Contact us for an accurate quote.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">About CIF Value</h3>
            <p className="text-sm text-gray-600">
              CIF (Cost, Insurance, Freight) is the landed cost of goods at the port of destination,
              used as the base for calculating import duties.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center mb-4">
              <Percent className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Tax Rates</h3>
            <p className="text-sm text-gray-600">
              Import duty varies by vehicle type and engine capacity. Hybrid vehicles often
              enjoy lower duty rates compared to conventional vehicles.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Our Support</h3>
            <p className="text-sm text-gray-600">
              Need help? Our team can provide accurate cost calculations based on
              your specific vehicle requirements. Contact us anytime!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
