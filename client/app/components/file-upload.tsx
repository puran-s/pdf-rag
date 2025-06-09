'use client'

import * as React from 'react';
import { Upload } from 'lucide-react';

const FileUploadComponent : React.FC = () => {
    
    const handleFileUploadButtonClick = () => {
        const el=document.createElement('input');
        el.setAttribute('type','file');
        el.setAttribute('accept','application/pdf');
        el.addEventListener('change',async(ev)=>{
            if(el.files && el.files.length>0){
                const file=el.files.item(0);
                if(file){
                    const formData=new FormData();
                    formData.append('pdf',file);
                   await fetch('http://localhost:8000/upload/pdf',{
                        method:'POST',
                        body:formData,
                    });
                    console.log('File uploaded');
                }
            }
            
        });
        el.click();
    };
    return (
<div className="bg-slate-900 text-white shadow-2xl p-4 rounded-lg border border-blue-500 flex justify-center items-center">
  <div
    onClick={handleFileUploadButtonClick}
    className="flex flex-col justify-center items-center cursor-pointer p-4" // Added cursor-pointer and padding
  >
    <h3 className="text-lg font-semibold mb-2">Upload PDF file</h3> {/* Added basic text styling */}
    {/* Assuming 'Upload' is a component or icon */}
    <Upload />
  </div>
</div>
    );
};

export default FileUploadComponent;