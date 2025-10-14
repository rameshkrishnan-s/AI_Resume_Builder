import { Briefcase, Plus, Sparkles, Trash2 } from 'lucide-react'
import React from 'react'

const ExperienceForm = ({data,onChange}) => {

    const addExperience = () =>{
        const newExperience = {
            company : "",
            position : "",
            start_date : "",
            end_date : "",
            description : " ",
            is_current : false
        };
        onChange([...data,newExperience])
    }

    const removeExperience = (index)=>{
        const updated = data.filter((_,i)=> i !== index);
        onChange(updated)
    }

    const updateExperience = (index,field,value)=>{
        const updated = [...data];
        updated[index] = {...updated[index],[field] : value} 
        onChange(updated)
    }

    // A common style for all input fields to match the image
    const inputStyle = "px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white w-full focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-purple-500";


  return (
    <div className='space-y-6 bg-white p-6 rounded-xl shadow-sm'>
       <div className='flex items-center justify-between'>
        <div>
      <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        Professional Experience
      </h3>
      <p className="text-sm text-gray-500">Add your job experience</p>
      </div>
      <button onClick={addExperience} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
        <Plus className="size-4" />
        Add Experience
      </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg'>
            <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300'/>
            <p>No work experience added yet</p>
            <p className='text-sm'>Click "Add Experience" to get started</p>
        </div>
      ): (
        <div className='space-y-5'>
            {data.map((experience,index)=>(
                <div key={index} className='p-5 border border-gray-200 rounded-lg space-y-4'>
                    <div className='flex justify-between items-start'>
                        <h4 className='font-semibold text-gray-700'>Experience #{index+1}</h4>
                        <button onClick={()=>removeExperience(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                            <Trash2 className='size-5'/>
                        </button>
                    </div>

                    <div className='grid md:grid-cols-2 gap-4'>
                        
                        <input value={experience.company || ""} onChange={(e)=>updateExperience(index,"company" ,e.target.value)} type="text" placeholder='Company Name' className={inputStyle}/>

                        <input value={experience.position || ""} onChange={(e)=>updateExperience(index,"position" ,e.target.value)} type="text" placeholder='Job Title' className={inputStyle}/>

                        <input value={experience.start_date || ""} onChange={(e)=>updateExperience(index,"start_date" ,e.target.value)} type="month" className={inputStyle}/>

                        <input value={experience.end_date || ""} onChange={(e)=>updateExperience(index,"end_date" ,e.target.value)} type="month" disabled={experience.is_current} className={`${inputStyle} disabled:bg-gray-100`} />
                    </div>
                    <label className='flex items-center gap-2 cursor-pointer'>
                        <input type="checkbox" checked={experience.is_current || false} onChange={(e)=>{updateExperience(index,"is_current",e.target.checked ? true : false)}} className='h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500'/>
                        <span className='text-sm text-gray-700'>Currently working here</span>
                    </label>

                    <div className='space-y-2'>
                        <div className='flex items-center justify-between'>
                            <label className='text-sm font-medium text-gray-700'>Job Description</label>
                            <button className='flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                <Sparkles className='w-3 h-3'/>
                                Enhance with AI
                            </button>
                        </div>
                        <textarea value={experience.description || ""} onChange={(e)=> updateExperience(index,"description",e.target.value)} className={`${inputStyle} resize-none h-28`} placeholder='Describe your key responsibilities and achievements...'/>
                    </div>
                </div>
            ))}
            </div>
      )}
    </div>
  )
}

export default ExperienceForm