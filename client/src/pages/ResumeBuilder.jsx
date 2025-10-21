import { useEffect, useState } from "react";
import { useParams,Link } from "react-router-dom";
import { dummyResumeData } from "../assets/assets";
import { ArrowLeftIcon, Briefcase, ChevronLeft, ChevronRight, DownloadIcon, EyeIcon, EyeOff, EyeOffIcon, FileText, FolderIcon, GraduationCap, Share2, Share2Icon, Sparkles, User } from "lucide-react";
import PersonalInfoForm from "../components/PersonalInfoForm";
import ResumePreview from "../components/ResumePreview";
import TemplateSelector from "../components/TemplateSelector";
import ColorPicker from "../components/ColorPicker";
import ProfessionalSummaryForm from "../components/ProfessionalSummaryForm";
import ExperienceForm from "../components/ExperienceForm";
import EducationForm from "../components/EducationForm";
import ProjectForm from "../components/ProjectForm";
import SkillsForm from "../components/SkillsForm";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import api from "../configs/api";

const ResumeBuilder = () =>{

    const { resumeId } = useParams();
    const { token } = useSelector(state => state.auth);
    const [resumeData,setResumeData] = useState({
        _id : '',
        title :'',
        personal_info : {},
        experience : [],
        education : [],
        projects : [],
        skills : [],
        template : 'classic',
        accent_color :'#3B82F6',
        public : false,  
    })
    const [isLoading, setIsLoading] = useState(false);
    const [isEnhancingSummary, setIsEnhancingSummary] = useState(false);
    const [enhancingExpIndex, setEnhancingExpIndex] = useState(-1);

    const loadExistingResume = async () =>{
        try {
            const { data } = await api.get(`/api/resumes/get/${resumeId}`, {
                headers: { Authorization: token }
            });
            if(data.resume){
                setResumeData(data.resume);
                document.title = data.resume.title || 'Resume Builder';
            }
        } catch (error) {
            console.error('Error loading resume:', error);
        }
    }
    const [activeSectionIndex,setActiveSectionIndex] = useState(0)
    const [removeBackground,setRemoveBackground] = useState(false)
    
    const sections = [
        {id:"personal",name:"Personal Info",icon:User},
        {id:"summary",name:"Summary",icon:FileText},
        {id:"experience",name:"Experience",icon:Briefcase},
        {id:"education",name:"Education",icon:GraduationCap},
        {id:"projects",name:"Projects",icon:FolderIcon},
        {id:"skills",name:"Skills",icon:Sparkles},
    ]

    const activeSection = sections[activeSectionIndex]
    useEffect(()=>{
        loadExistingResume();
    },[])
    

    const enhanceSummary = async () => {
        if (!resumeData.professional_summary || !resumeData.professional_summary.trim()) {
            toast.error('Please write a draft summary first');
            return;
        }
        setIsEnhancingSummary(true);
        try {
            const { data } = await api.post(
                '/api/ai/enhance-pro-sum',
                { userContent: resumeData.professional_summary },
                { headers: { Authorization: token } }
            );
            if (data.enhancedContent) {
                setResumeData(prev => ({ ...prev, professional_summary: data.enhancedContent }));
                toast.success('Summary enhanced');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to enhance');
        }
        setIsEnhancingSummary(false);
    };

    const enhanceExperienceDescription = async (index, currentText) => {
        if (!currentText || !currentText.trim()) {
            toast.error('Please add a job description first');
            return;
        }
        setEnhancingExpIndex(index);
        try {
            const { data } = await api.post(
                '/api/ai/enhance-job-desc',
                { userContent: currentText },
                { headers: { Authorization: token } }
            );
            if (data.enhancedContent) {
                setResumeData(prev => {
                    const updated = [...(prev.experience || [])];
                    updated[index] = { ...updated[index], description: data.enhancedContent };
                    return { ...prev, experience: updated };
                });
                toast.success('Description enhanced');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to enhance');
        }
        setEnhancingExpIndex(-1);
    };

    const saveResume = async () => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify(resumeData));
            formData.append('removeBackground', removeBackground);
            
            // Add image if it's a file object
            if (resumeData.personal_info?.image && typeof resumeData.personal_info.image === 'object') {
                formData.append('image', resumeData.personal_info.image);
            }

            const { data } = await api.put('/api/resumes/update', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success('Resume saved successfully!');
            setResumeData(data.resume);
        } catch (error) {
            console.error('Error saving resume:', error);
            toast.error(error?.response?.data?.message || 'Failed to save resume');
        }
        setIsLoading(false);
    };

    const changeResumeVisibility = async () => {
        const newVisibility = !resumeData.public;
        setResumeData({...resumeData, public: newVisibility});
        
        try {
            const formData = new FormData();
            formData.append('resumeId', resumeId);
            formData.append('resumeData', JSON.stringify({...resumeData, public: newVisibility}));
            
            await api.put('/api/resumes/update', formData, {
                headers: { 
                    Authorization: token,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            toast.success(`Resume is now ${newVisibility ? 'public' : 'private'}`);
        } catch (error) {
            console.error('Error updating visibility:', error);
            toast.error('Failed to update visibility');
            // Revert the change
            setResumeData({...resumeData, public: !newVisibility});
        }
    }

    const getShareUrl = () => `${window.location.origin}/view/${resumeId}`

    const handleShare = async () =>{
        const resumeUrl = getShareUrl();
        if(navigator.share){
            try{
                await navigator.share({ url: resumeUrl, title: 'My Resume', text: 'Check out my resume' })
                return;
            }catch(err){
                // fall through to clipboard on user cancel or failure
            }
        }
        try{
            await navigator.clipboard.writeText(resumeUrl)
            alert('Link copied to clipboard')
        }catch{
            prompt('Copy this resume link:', resumeUrl)
        }
    }


    const downloadResume = () =>{
        window.print();
    }
    return(
        <div>
            <div className="max-w-7xl mx-auto px-4 py-6">
                <Link to={'/app'} className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all">
                    <ArrowLeftIcon className="size-4"/> Back to dashboard
                </Link>
            </div>

            <div className="max-w-7xl mx-auto px-4 pb-8">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/*Left Panel Form*/}
                    <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">
                            {/*Progress bar*/}
                            <hr className="absolute top-0 right-0 left-0 border-2 border-gray-200"/>
                            <hr className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-green-500 to-green-600 border-none transition-all duration-2000" style={{width : `${activeSectionIndex * 100/(sections.length-1)}%`}}/>
                            {/*Section Navigation */}
                            <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                                <div className="flex items-center gap-2">
                                    <TemplateSelector selectedTemplate={resumeData.template} onChange={(template)=>setResumeData(prev=>({
                                        ...prev,template
                                    }))}/>
                                    <ColorPicker selectedColor={resumeData.accent_color} onChange={(color)=>setResumeData(prev=>({...prev,accent_color:color}))}/>
                                </div>
                                <div className="flex items-center">
                                    {activeSectionIndex !== 0 && (
                                        <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.max(prevIndex-1,0))} className="flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all" disabled={activeSectionIndex === 0}>
                                            <ChevronLeft className="size-4"/>Previous
                                        </button>
                                    )}
                                     <button onClick={()=>setActiveSectionIndex((prevIndex)=>Math.min(prevIndex+1,sections.length-1))} className={`flex items-center gap-1 p-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all ${activeSectionIndex === sections.length - 1 && 'opacity-50'}`} disabled={activeSectionIndex === sections.length -1}>
                                            <ChevronRight className="size-4"/>Next
                                        </button>
                                </div>
                            </div>
                             {/*Form Content */}
                            <div className="space-y-6">
                                {activeSection.id === 'personal' && (
                                    <PersonalInfoForm data={resumeData.personal_info} onChange={(data)=>setResumeData(prev=>({...prev,personal_info:data}))} removeBackground={removeBackground} setRemoveBackground={setRemoveBackground}/>
                                )}    
                                {
                                    activeSection.id == 'summary' && (
                                        <ProfessionalSummaryForm 
                                            data={resumeData.professional_summary} 
                                            onChange={(data)=>setResumeData(prev=>({...prev,professional_summary:data}))}
                                            onEnhance={enhanceSummary}
                                            isEnhancing={isEnhancingSummary}
                                        />
                                    )
                                } 
                                {
                                    activeSection.id == 'experience' && (
                                        <ExperienceForm 
                                            data={resumeData.experience} 
                                            onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))}
                                            onEnhanceDescription={enhanceExperienceDescription}
                                            enhancingIndex={enhancingExpIndex}
                                        />
                                    )
                                }     
                                {
                                    activeSection.id == 'education' && (
                                        <EducationForm data={resumeData.education} onChange={(data)=>setResumeData(prev=>({...prev,education:data}))} setResumeData={setResumeData}/>
                                    )
                                }    
                                {
                                    activeSection.id == 'projects' && (
                                        <ProjectForm data={resumeData.project} onChange={(data)=>setResumeData(prev=>({...prev,project:data}))} setResumeData={setResumeData}/>
                                    )
                                }   
                                {
                                    activeSection.id == 'skills' && (
                                        <SkillsForm data={resumeData.skills} onChange={(data)=>setResumeData(prev=>({...prev,skills:data}))} setResumeData={setResumeData}/>
                                    )
                                }                  
                            </div>
                            <button 
                                onClick={saveResume}
                                disabled={isLoading}
                                className="bg-gradient-to-br from-green-100 to-green-200 ring-green-300 text-green-600 ring hover:ring-green-400 transition-all rounded-md px-6 py-2 mt-6 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                    {/*Right Panel Preview*/}
                    <div className="lg:col-span-7 max-lg:mt-6">
                        <div className="relative w-full">
                            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2">
                                {resumeData.public && (
                                    <button onClick={handleShare} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors">
                                        <Share2Icon className="sixe-4"/>Share
                                    </button>
                                )}
                                <button onClick={changeResumeVisibility} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors">
                                    {resumeData.public ? <EyeIcon className="size-4"/> : <EyeOffIcon className="size-4"/>}
                                    {resumeData.public ? 'Public' : 'Private'}
                                </button>

                                <button onClick={downloadResume} className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-blue-300 hover:ring transition-colors">
                                    <DownloadIcon className="size-4"/>Download
                                </button>
                            </div>
                        </div>

                        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ResumeBuilder;