import { Worker } from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";

import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

const worker=new Worker('file-upload-queue',
    async (job)=>{
   
    const data=JSON.parse(job.data);
    const {filename,path}=data;
    console.log('filename',data.filename);
    console.log('path',data.path);
    const loader = new PDFLoader(data.path);
    const docs = await loader.load();

 
      console.log('all doc added to vector store');

    const embeddings = new OpenAIEmbeddings({
        model: 'text-embedding-3-small',
        apiKey: 'Key'
    });
    
    const vectorStore= await QdrantVectorStore.fromExistingCollection(
        embeddings,{
                url: 'http://localhost:6333',
                collectionName: 'rag-testing',
        }
    );
    console.log('before added to vector store');
    await vectorStore.addDocuments(docs);
    console.log('all doc added to vector store');
},
{concurrency : 100 , 
    connection: {
        host: 'localhost', port: 6379}}
);