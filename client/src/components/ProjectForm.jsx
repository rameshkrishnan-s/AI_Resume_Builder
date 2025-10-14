import { Plus, Trash2 } from 'lucide-react';
import React from 'react'

const ProjectForm = ({data=[],onChange}) => {
    const addProject = () =>{
        const newProject = {
            name : "",
            type : "",
            description : "",
        };
        onChange([...data,newProject])
    }

    const removeProject = (index)=>{
        const updated = data.filter((_,i)=> i !== index);
        onChange(updated)
    }

    const updateProject = (index,field,value)=>{
        const updated = [...data];
        updated[index] = {...updated[index],[field] : value} 
        onChange(updated)
    }
  return (
    <div>
            <div className='flex items-center justify-between'>
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                        Projects
                    </h3>
                    <p className="text-sm text-gray-500">Add your Projects</p>
                </div>
                <button onClick={addProject} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                    <Plus className="size-4" />
                    Add Project
                </button>
            </div>

                <div className='space-y-5 mt-6'>
                    {data.map((project, index) => (
                        <div key={index} className='p-5 border border-gray-200 rounded-lg space-y-4'>
                            <div className='flex justify-between items-start'>
                                <h4 className='font-semibold text-gray-700'>Project #{index + 1}</h4>
                                <button onClick={() => removeProject(index)} className='text-red-500 hover:text-red-700 transition-colors'>
                                    <Trash2 className='size-5' />
                                </button>
                            </div>

                            <div className='grid gap-3'>
                                <input 
                                    value={project.name || ""} 
                                    onChange={(e) => updateProject(index, "name", e.target.value)} 
                                    type="text" 
                                    placeholder='Project Name' 
                                    className="px-3 py-2 text-sm rounded-lg"
                                />

                                <input 
                                    value={project.type || ""} 
                                    onChange={(e) => updateProject(index, "type", e.target.value)} 
                                    type="text" 
                                    placeholder='Project Type' 
                                    className="px-3 py-2 text-sm rounded-lg"
                                />

                                <textarea 
                                    rows={4}
                                    value={project.description || ""} 
                                    onChange={(e) => updateProject(index, "description", e.target.value)} 
                                    placeholder='Describe your project' 
                                    className="w-full px-3 py-2 text-sm rounded-lg resize-none"
                                />
                            </div>
                        </div>
                    ))}
                </div>
        </div>
  )
}

export default ProjectForm
