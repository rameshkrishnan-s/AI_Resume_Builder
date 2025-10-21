

//Controller for enhancing a resume
// POST /api/ai/enhance-pro-sum

import Resume from "../models/Resume.js";
import ai from "../config/ai.js";


export const enhanceProfessionalSummary = async (req,res) =>{
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message : 'missing required fields'})
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
        { role: "system", content: "You are an expert resume writer. Improve the user's professional summary into 1–2 concise sentences (≈40–60 words). Optimize for ATS using relevant keywords. Requirements: (1) Lead with role/seniority; (2) Include domain/industry focus; (3) Highlight 4–6 core skills/tools; (4) Emphasize measurable impact with metrics where possible; (5) Keep it confident, specific, and plain text. Do not add headings, quotes, bullets, or extra commentary—return only the final summary text." },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}


//post /api/ai/enhance-job-desc


export const enhanceJobDescription = async (req,res) =>{
    try {
        const {userContent} = req.body;
        if(!userContent){
            return res.status(400).json({message : 'missing required fields'})
        }

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
        { role: "system", content: "You are an expert resume writer. Rewrite the user's job description into 4–6 concise, ATS-optimized bullet points. Each bullet must: (1) Start with a strong action verb; (2) Describe responsibilities and impact; (3) Include metrics/quantification where possible; (4) Name key tools/technologies; (5) Be one line, ≤28 words. Output plain text with only bullets using '- ' for each line. Do not add headers or any other text before/after the bullets." },
        {
            role: "user",
            content: userContent,
        },
    ],
        })

        const enhancedContent = response.choices[0].message.content;
        return res.status(200).json({enhancedContent})
    } catch (error) {
        return res.status(400).json({message : error.message})
    }
}





//post /api/ai/upload-resume


export const uploadResume = async (req,res) =>{
    try {
        const {resumeText,title} = req.body;
        const userId = req.userId;

        if(!resumeText){
            return res.status(400).json({message : 'Missing required fields'})
        }
        
        if(!title){
            return res.status(400).json({message : 'Title is required'})
        }
        const systemPrompt ="You are an expert ai agent to extract data from resume"
        const userPrompt = `extract data from this resume ${resumeText} 
        Provide data  in the following JSON format with no additional text in it professional_summary : {type : String,default : ''},
    skills : [{type : String}],
    personal_info : {
        image : {type : String , default : ''},
        full_name : {type : String , default : ''},
        profession : {type : String , default : ''},
        email : {type : String , default : ''},
        phone : {type : String , default : ''},
        location : {type : String , default : ''},
        linkedin : {type : String , default : ''},
        website : {type : String , default : ''},
    },

    experience : [
        {
            company : {type : String},
            position : {type : String},
            start_date : {type : String},
            end_date : {type : String},
            description : {type : String},
            is_current : {type : Boolean},
            
        }
    ],
    project : [
        {
            name : {type : String},
            type : {type : String},
            description : {type : String},           
        }
    ],

    education : [
        {
            institution : {type : String},
            degree : {type : String},
            field : {type : String},
            graduation_date : {type : String},
            gpa : {type : String},
            
        }
    ]`

        const response = await ai.chat.completions.create({
            model: process.env.OPENAI_MODEL,
            messages: [
        { role: "system", content: systemPrompt },
        {
            role: "user",
            content: userPrompt,
        },
    ],
    response_format : {type : 'json_object'}
        })

        const extractedData = response.choices[0].message.content;
        
        let parsedData;
        try {
            parsedData = JSON.parse(extractedData);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            return res.status(400).json({message: 'Failed to parse AI response. Please try again.'});
        }
        
        const newResume = await Resume.create({userId,title,...parsedData});

        return res.status(200).json({resumeId : newResume._id});

    } catch (error) {
        console.error('Upload Resume Error:', error);
        return res.status(400).json({message : error.message})
    }
}

