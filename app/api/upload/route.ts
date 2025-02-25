import pdf from "pdf-parse";
import { NextResponse } from "next/server";
import { pipeline } from "@huggingface/transformers";
import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});
const index = pinecone.index('docrux');

export const runtime = 'nodejs';

export async function POST(req: Request){
  try {
    const formData = await req.formData();
    const user = formData.get("user");
    const files = formData.getAll("files");

    if (!user || typeof user!== "string") {
      return new Response(JSON.stringify({ error: "No username provided" }), {
        status: 400,
      });
    }

    const data = [];

    for(let file of files){
      if(file instanceof File){
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const pdfData = await pdf(buffer);

        const sentences = pdfData.text
        .replace(/\n/g, ' ') // Replace all newlines with spaces
        .split(/(?<=\.)\s+/) // Split by full stop followed by whitespace
        .map((sentence) => sentence.trim()) // Trim whitespace from each sentence
        .filter((sentence) => sentence.length > 0); // Remove empty strings

        for(let i = 0; i < sentences.length; i++){
          const embedder = await pipeline("feature-extraction", "sentence-transformers/all-MiniLM-L6-v2");
          const embeddings = await embedder(sentences[i]);

          const newArray = embeddings.tolist();
          const pooledEmbedding = newArray[0].reduce((acc: number[], row: number[]) => 
            acc.map((value, index) => value + row[index] / newArray[0].length), 
            new Array(384).fill(0)
          );
          const newData = {
            id: `sentence-${Date.now()}-${i}`,
            values: pooledEmbedding,
            metadata:{
              text: sentences[i],
              user
            }
          };
          data.push(newData);
        }
      }
    }

    if(data.length > 0){
      try {
        await index.upsert(data);
      } catch (error) {
        console.error("Error upserting vectors:", error);
      }
    }

    // const imgData = await  fetch('http://127.0.0.1:5000/pdf-img', {
    //       method: 'POST',
    //       body: formData,
    // });
    // const imgs = await imgData.json();
    const imgs : any = [];
    
    return NextResponse.json({"images" : imgs});

  } catch (error) {
    return NextResponse.json("error Occured");
  }
}