import FileUploadComponent from "./components/file-upload";
import ChatComponent from "./components/chat";
export default function Home() {
  return (
    <div className="app-container min-h-screen w-screen flex">
    {/* File Upload Section */}
    <div className="file-upload-section w-[30vw] min-h-screen p-4 flex justify-center items-center">
      <FileUploadComponent />
    </div>
  
    {/* Chat Section */}
    <div className="chat-section w-[70vw] min-h-screen border-l-2 border-gray-200"> {/* Adjusted border class */}
      <ChatComponent />
    </div>
  </div>
  );
}
