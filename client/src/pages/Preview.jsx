import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import Loader from "../components/Loader";
import ResumePreview from "../components/ResumePreview";
import { ArrowLeftIcon } from "lucide-react";

const Preview = () =>{
    const {resumeId} = useParams()
    const [resumeData,setResumeData] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const loadResume = async () =>{
        setIsLoading(true)
        const found = dummyResumeData.find(resume => resume._id === resumeId) || null
        setResumeData(found)
        setIsLoading(false)
        document.title = found ? (found.title || "Resume Preview") : "Resume Not Found"
    }

    useEffect(()=>{
        loadResume()
    },[])
    if(isLoading){
        return <Loader />
    }

    if(!resumeData){
        return (
            <div className="flex flex-col items-center justify-center h-screen">
                <p className="text-slate-700">Resume Not found</p>
                <Link to="/" className="mt-6 bg-green-500 hover:bg-green-600 text-white rounded-full px-6 h-9 m-1 ring-offset-1 ring-1 ring-green-400 inline-flex items-center transition-colors">
                    <ArrowLeftIcon className="mr-2 size-4"/>Go to Dashboard
                </Link>
            </div>
        )
    }

    return (
        <div className="bg-slate-100">
            <div className="max-w-3xl mx-auto py-10">
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes="py-4 bg-white"/>
            </div>
        </div>
    )
}

export default Preview;