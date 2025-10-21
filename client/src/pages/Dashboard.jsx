import {FilePenIcon, LoaderCircleIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloud, UploadCloudIcon, XIcon} from 'lucide-react'
import { useEffect, useState } from 'react';
import {dummyResumeData} from '../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {toast} from 'react-hot-toast'
import api from '../configs/api'
import pdfToText from 'react-pdftotext' 

const Dashboard = () =>{

    const {user,token} = useSelector(state => state.auth)

    const colors = ["#9333ea",'#d97706','#dc2626','#0284c7','#16a34a']
    const [allResumes,setAllResumes] = useState([])
    const [showCreateResume,setShowCreateResume] = useState(false)
    const [showUploadResume,setShowUploadResume] = useState(false)
    const [title,setTitle] = useState('')
    const [resume,setResume] = useState(null)
    const [editResumeId,setEditResumeId] = useState('')
    const navigate = useNavigate()
    const [isLoading,setIsLoading] = useState(false)

    const editTitle = async (event) =>{
        try {
          event.preventDefault()
          const formData = new FormData();
          formData.append('resumeId', editResumeId);
          formData.append('resumeData', JSON.stringify({title}));
          
          const {data} = await api.put('/api/resumes/update', formData, {
            headers: { 
              Authorization: token,
              'Content-Type': 'multipart/form-data'
            }
          });
          
          setAllResumes(allResumes.map(resume=> resume._id === editResumeId ? {...resume,title} : resume))
          setTitle('')
          setEditResumeId('')
          toast.success(data.message)

        } catch (error) {
          toast.error(error?.response?.data?.message || error.message)
        }

    }
    const loadAllResumes = async () =>{
        try {
          const {data} = await api.get('/api/users/resumes',{headers : {Authorization : token}})
          setAllResumes(data.resumes)
        } catch (error) {
          console.error('Error loading resumes:', error);
          // Fallback to dummy data if API fails
          setAllResumes(dummyResumeData);
        }
    }

    const createResume = async(event)=>{
        try {
          event.preventDefault()
          const {data} = await api.post('/api/resumes/create',{title},{headers :{
            Authorization : token
          }})
          setAllResumes([...allResumes,data.resume])
          setTitle('')
          setShowCreateResume(false)
          navigate(`/app/builder/${data.resume._id}`)
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message)
        }
    }
     
    const uploadResume = async (event) =>{
        event.preventDefault()
        setIsLoading(true)
        try {
          if(!resume){
            toast.error('Please select a PDF resume to upload')
            setIsLoading(false)
            return
          }
          const resumeText = await pdfToText(resume)
          if(!resumeText || !resumeText.trim()){
            toast.error('Could not read text from the PDF. Please try another file.')
            setIsLoading(false)
            return
          }
          const {data} = await api.post('/api/ai/upload-resume',{title,resumeText},{headers :{
            Authorization : token
          }})
          setTitle('')
          setResume(null)
          setShowUploadResume(false)
          navigate(`/app/builder/${data.resumeId}`)
        } catch (error) {
          toast.error(error?.response?.data?.message || error.message)
        }
        setIsLoading(false)

    }

    const deleteResume = async (resumeId) =>{

      try {
        const confirm = window.confirm("Are you sure to delete the resume?")
        if(confirm){
          const {data} =  await api.delete(`/api/resumes/delete/${resumeId}`,{headers :{
            Authorization : token
          }})
            setAllResumes(prev=>prev.filter(resume=>resume._id !== resumeId))
            toast.success(data.message)
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message)
      }
        

    }
    useEffect(()=>{
        loadAllResumes()
    },[])
    return(
        <div>
           <div className="max-w-7xl mx-auto px-4 py-8">
            <p className="text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-800 bg-clip-text text-transparent sm:hidden">Welcome Jhon Doe</p>
            <div className="flex gap-4">
                <button onClick={()=>{setShowCreateResume(true)}} className='w-full bg-white sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 hover:shadow-lg transition-all duration-300'>
                    <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full'/>
                    <p className='text-sm group-hover:text-indigo-600 transistion-all'>Create Resume</p>
                </button>
                <button onClick={()=>setShowUploadResume(true)} className='w-full bg-white sm:w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 text-slate-600 border border-dashed border-slate-300 group hover:border-purple-500 hover:shadow-lg transition-all duration-300'>
                    <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full'/>
                    <p className='text-sm group-hover:text-purple-600 transistion-all'>Upload Resume</p>
                </button>
            </div>
            <hr className='border-slate-300 my-6 sm:w-[305px]'/>
            <div className='grid grid-col-2 sm:flex flex-wrap gap-4'>
                {allResumes.map((resume,index)=>{
                    const baseColor = colors[index % colors.length];
                    return(
                        <button key={index} onClick={()=>navigate(`/app/builder/${resume._id}`)} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg gap-2 border group hover:shadow-lg transition-all duration-300' style={{background : `linear gradient(135deg,${baseColor}10,${baseColor}40)`,borderColor:baseColor + '40'}}>
                                <FilePenIcon className='size-7 group-hover:scale-105 transition-all' style={{color : baseColor}}/>
                                <p className='text-sm group-hover:scale-105 transition-all px-2 text-center' style={{color : baseColor}}>{resume.title}</p>

                                <p className='absolute  bottom-1 text-[11px] text-slate-400 group-hover:text-slate-500 transition-all duration-300 px-2 text-center' style={{color:baseColor + '90'}}>Updated on {new Date(resume.updatedAt).toLocaleDateString()}</p>

                                <div onClick={e=>e.stopPropagation()}className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                                    <TrashIcon onClick={()=>deleteResume(resume._id)} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
                                    <PencilIcon onClick={()=>{setEditResumeId(resume._id);setTitle(resume.title)}} className='size-7 p-1.5 hover:bg-white/50 rounded text-slate-700 transition-colors'/>
                                </div>
                        </button>
                    )
                })}
            </div>
            {showCreateResume &&(
                <form
  onSubmit={createResume}
  onClick={() => setShowCreateResume(false)}
  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative bg-white border shadow-xl rounded-2xl w-[90%] max-w-sm p-6"
  >
    <h2 className="text-xl font-semibold mb-4 text-slate-700">Create a Resume</h2>

    <input
      type="text"
      placeholder="Enter Resume title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-4 focus:border-green-600 focus:ring-green-600 outline-none"
      required
    />

    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
      Create Resume
    </button>

    <XIcon
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      onClick={() => {
        setShowCreateResume(false);
        setTitle("");
      }}
    />
  </div>
                </form>

            ) 

            }

            {showUploadResume &&(
                     <form
  onSubmit={uploadResume}
  onClick={() => setShowUploadResume(false)}
  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative bg-white border shadow-xl rounded-2xl w-[90%] max-w-sm p-6"
  >
    <h2 className="text-xl font-semibold mb-4 text-slate-700">Upload Resume</h2>

    <input
      type="text"
      onChange ={(e)=>setTitle(e.target.value)}
      value={title}
      placeholder="Enter Resume title"
      className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-4 focus:border-green-600 focus:ring-green-600 outline-none"
      required
    />
    <div>
        <label htmlFor="resume-input" className='block text-sm text-slate-700'>
            Select Resume File
            <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 transition-colors'>
                {resume?(
                    <p className='text-green-700'>{resume.name}</p>
                ):(
                    <>
                        <UploadCloud className='size-14 stroke-1'/>             
                        <p>Upload resume</p>       
                    </>
                )}
            </div>
        </label>
        <input type="file" name="" id="resume-input" accept='.pdf' hidden onChange={(e)=>setResume(e.target.files[0])}/>
    </div>
    <button disabled={isLoading} className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
          {isLoading && <LoaderCircleIcon className='animate-spin size-4 text-white'/>}
          {isLoading ? 'Uploading...' : ' Upload Resume'}
     
    </button>

    <XIcon
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      onClick={() => {
        setShowUploadResume(false);
        setTitle("");
      }}
    />
  </div>
                </form>
            )
            }

             {editResumeId &&(
                <form
  onSubmit={editTitle}
  onClick={() => setEditResumeId('')}
  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-10 flex items-center justify-center"
>
  <div
    onClick={(e) => e.stopPropagation()}
    className="relative bg-white border shadow-xl rounded-2xl w-[90%] max-w-sm p-6"
  >
    <h2 className="text-xl font-semibold mb-4 text-slate-700">Edit Resume Title</h2>

    <input
      type="text"
      placeholder="Enter Resume title"
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border border-slate-300 rounded-lg px-4 py-2 mb-4 focus:border-green-600 focus:ring-green-600 outline-none"
      required
    />

    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
      Update
    </button>

    <XIcon
      className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
      onClick={() => {
        setEditResumeId('');
        setTitle("");
      }}
    />
  </div>
                </form>

            ) 

            }
           </div>
        </div>
    )
}

export default Dashboard;