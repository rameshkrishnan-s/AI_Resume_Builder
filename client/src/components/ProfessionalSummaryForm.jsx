import { Sparkles } from 'lucide-react'
import React from 'react'

const ProfessionalSummaryForm = ({ data, onChange }) => {
  return (
    <div className="space-y-3">
      <div className='flex items-center justify-between'>
        <div>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        Professional Summary
      </h3>
      <p className="text-sm text-gray-500">Add Summary for your resume</p>
      </div>
      <button className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
        <Sparkles className="size-4" />
        AI Enhance
      </button>
      </div>
      <textarea
        value={data || ""}
        onChange={(e) => onChange(e.target.value)}
        rows={7}
        className="w-full p-3 text-sm text-gray-700 border border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
      />

      <p className="text-xs text-gray-500 text-left mt-2">
        Tip: Keep it concise and focus on your most relevant achievements and skills.
      </p>
    </div>
  )
}

export default ProfessionalSummaryForm
