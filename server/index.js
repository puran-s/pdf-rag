import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Queue } from 'bullmq';
import { QdrantVectorStore } from "@langchain/qdrant";
import { OpenAIEmbeddings } from "@langchain/openai";
import OpenAI  from "openai";

const client = new OpenAI({apiKey: 'Key'});

const queue=new Queue('file-upload-queue',{connection: {
        host: 'localhost', port: 6379} }
);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + '-' + file.originalname);
    },
  });

const upload = multer({storage: storage});

const app = express();
app.use(cors());
app.get('/', (req, res) => {
    return res.json({status: 'All Good'});
});
app.post('/upload/pdf',upload.single('pdf'),async(req,res)=>{
    await queue.add('file-ready',JSON.stringify({
        filename: req.file.originalname,
        destination: req.file.destination,
        path: req.file.path
    })
);
    return res.json({message: 'File uploaded successfully'})
});

app.get('/chat', async (req, res) => {
    const userQuery=req.query.message;
    //console.log(userQuery1);
   // const userQuery='what is dependency injection';
    console.log(userQuery);
    const embeddings = new OpenAIEmbeddings({
            model: "text-embedding-3-small",
            apiKey: 'Key'
          });
const vectorStore = await QdrantVectorStore.fromExistingCollection(embeddings, {
        url: 'http://localhost:6333',
        collectionName: "rag-testing",
      });

    const ret = vectorStore.asRetriever({
        k:2,
    });
    const result=await ret.invoke(userQuery);
    const SYSTEM_PROMPT = 'You are helpfull AI assistance who answere user query based on the context available in pdf context: ${JSON.stringyfy(result)}';
    const charResult=await client.chat.completions.create({
        model: 'gpt-4.1',
        messages: [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            {
                role: 'user',
                content: userQuery
            }
        ]
    });
    return res.json({message: charResult.choices[0].message.content,docs :result});
});

app.listen(8000, () => {
    console.log('Server is running on port:${8000}');
});