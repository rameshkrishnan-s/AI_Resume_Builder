import React from 'react'
import { Briefcase, Plus, Trash2 } from 'lucide-react'

const EducationForm = ({ data, onChange }) => {
    const addEducation = () => {
        const newEducation = {
            institution: "",
            degree: "",
            field: "",
            graduation_date: "",
            gpa: "",
        };
        onChange([...data, newEducation]);
    }

    const removeEducation = (index) => {
        const updated = data.filter((_, i) => i !== index);
        onChange(updated);
    }

    const updateEducation = (index, field, value) => {
        const updated = [...data];
        updated[index] = { ...updated[index], [field]: value };
        onChange(updated);
    }
    
    // Consistent styling for all form inputs
    const inputStyle = "px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white w-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500";

    return (
        <div className='space-y-6 bg-white p-6 rounded-xl shadow-sm'>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        Education
                    </h3>
                    <p className="text-sm text-gray-500">Add your Education Details</p>
                </div>
                <button onClick={addEducation} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                    <Plus className="size-4" />
                    Add Education
                </button>
            </div>

            {data.length === 0 ? (
                <div className='text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg'>
                    <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300' />
                    <p>No Education added yet</p>
                    <p className='text-sm'>Click "Add Education" to get started</p>
                </div>
            ) : (
                <div className='space-y-5'>
                    {data.map((education, index) => (
                        <div key={index} className='p-5 border border-gray-200 rounded-lg space-y-4'>
                            <div className='flex justify-between items-start'>
                                <h4 className='font-semibold text-gray-700'>Education #{index + 1}</h4>
                                <button onClick={() => removeEducation(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            <div className='grid md:grid-cols-2 gap-4'>
                                <input 
                                    value={education.institution || ""} 
                                    onChange={(e) => updateEducation(index, "institution", e.target.value)} 
                                    type="text" 
                                    placeholder='Institution Name' 
                                    className={inputStyle} 
                                />

                                <input 
                                    value={education.degree || ""} 
                                    onChange={(e) => updateEducation(index, "degree", e.target.value)} 
                                    type="text" 
                                    placeholder='Degree' 
                                    className={inputStyle} 
                                />
                                
                                <input 
                                    value={education.field || ""} 
                                    onChange={(e) => updateEducation(index, "field", e.target.value)} 
                                    type="text" 
                                    placeholder='Field of Study' 
                                    className={inputStyle} 
                                />

                                <input 
                                    value={education.graduation_date || ""} 
                                    onChange={(e) => updateEducation(index, "graduation_date", e.target.value)} 
                                    type="month" // Changed to type="month" for better UX
                                    placeholder='Graduation Date' 
                                    className={inputStyle} 
                                />
                                
                                <input 
                                    value={education.gpa || ""} 
                                    onChange={(e) => updateEducation(index, "gpa", e.target.value)} 
                                    type="text" 
                                    placeholder='GPA (Optional)' 
                                    className={inputStyle} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default EducationForm;