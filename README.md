# NLP, LLM-powered RAG system for HR Assistant

A modern, no-code, responsive chat interface powered by n8n workflow automation and RAG (Retrieval-Augmented Generation) AI technology.

## Features

- 🤖 RAG-powered HR Assistant
- 💬 Real-time chat interface
- 📱 Responsive design for all devices
- ⚡ Fast webhook-based communication
- 🎨 Modern gradient UI design
- 💾 Session persistence
- ⚡ Fast and lightweight 
- 🔄 Auto-retry on network failures
- 💾 Deployed on cloud and easily scalable (Docker & Kubernetes)

## Setup

1. **Fork this repository** to your GitHub account

2. **Update the webhook URL** in `app.js`:
   ```javascript
   const CONFIG = {
       WEBHOOK_URL: 'https://your-n8n-instance.com/webhook/your-webhook-id/chat', **Insert the webhook url**
       // ... other config
   };
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll down to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

4. **RAG-powered chat will be available at**: `https://yourusername.github.io/your-repo-name`

## n8n Webhook Setup

The n8n webhook should:

1. **Accept POST requests** with JSON payload:
   ```json
   {
     "message": "User's message",
     "timestamp": "2024-01-01T00:00:00.000Z",
     "sessionId": "session_12345"
   }
   ```

2. **Return JSON response** in one of these formats:
   ```json
   { "response": "AI response text" }
   ```
   or
   ```json
   { "message": "AI response text" }
   ```
   or just a plain string

## Customization

### Styling
Edit `style.css` to customize:
- Colors and gradients
- Fonts and typography
- Layout and spacing
- Animations

### Functionality
Edit `app.js` to customize:
- Webhook URL and payload format
- Response handling
- Error messages
- Retry logic

### Content
Edit `index.html` to customize:
- Page title and meta tags
- Header content
- Initial bot message

## File Structure

```
.
├── index.html         # Main HTML structure
├── style.css          # Styling and responsive design
├── app.js             # Chat functionality and n8n integration         
└── README.md          # This file
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this for your projects!

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify your n8n webhook is working
3. Test the webhook URL directly
4. Check CORS settings on your n8n instance

## Workflow

## RAG Pipeline Workflow

![image alt](https://github.com/vikasyadavv/faq/blob/9f1facecb9b869103697f73af53aeb45affec042/images/RAG_pipeline.svg)

## 1. Overview of RAG
- **Retrieval**: Find relevant documents or data from a knowledge base (e.g., FAQs, PDFs, spreadsheets).
- **Augmentation**: Pass retrieved context to a generative model (LLM) to produce a natural language answer.
- **Generation**: The LLM generates a response using both the query and the retrieved context.

---

## 2. Workflow Steps (No Human Intervention required)
### A. Data Ingestion & Preprocessing
- **File Triggers**: The workflow monitors Google Drive folders for new or updated files (PDFs, CSVs, Excel, Docs).
- **Download & Extraction**: When a file is detected, it is downloaded and its text content is extracted using format-specific extractors (PDF, Excel, CSV, Docs).
- **Text Splitting**: Large documents are split into smaller chunks for efficient embedding and retrieval.

### B. Embedding & Storage
- **Embeddings Generation**: Each text chunk is converted into a vector embedding using an embedding model (**nomic embedding text model**).
- **Vector Database Insertion**: Embeddings and metadata are stored in a vector database (**Supabase Vectorstore**), enabling fast similarity search.
- **Metadata Management**: Document metadata (file ID, title, schema) is stored in a relational database for tracking and retrieval through SQL query using **postgres**

### C. Retrieval
- **Similarity Search**: When a user asks a question, the system searches the vector database for the most relevant chunks using embedding similarity and SQL query.
- **Context Aggregation**: Retrieved chunks are concatenated to form the context for the LLM.

### D. Generation
- **Prompt Construction**: The user query and retrieved context are combined into a prompt.
- **LLM Response**: The prompt is sent to a generative model (**qwen model**) to generate a natural language answer.

![image alt](https://github.com/vikasyadavv/faq/blob/9f1facecb9b869103697f73af53aeb45affec042/images/LLM_pipeline.svg)

---

## 3. Node-by-Node Breakdown

- **Google Drive Trigger**: Watches folders for file creation or updates.
- **Download File**: Downloads the detected file.
- **Extract Text**: Extracts text from PDFs, Excel, CSV, or Docs.
- **Text Splitter**: Splits extracted text into manageable chunks.
- **Embeddings Node**: Generates vector embeddings for each chunk.
- **Insert into Vectorstore**: Stores embeddings and metadata in Supabase.
- **Metadata Nodes**: Manage document metadata in Postgres.
- **Retrieval Node**: Similar chunks are found using embeddings on the query.
- **LLM Node**: Generates answer using context + query.

---

## 4. Advantages of RAG
- **Up-to-date Knowledge**: Can ingest new documents automatically.
- **Scalable Retrieval**: Efficiently finds relevant information from large datasets.
- **Contextual Generation**: LLM answers are grounded in retrieved facts.

---

## 5. Extending the Pipeline
- Add more file types or sources (e.g., web pages, databases).
- Use more advanced embedding models or LLMs.
- Integrate feedback loops for continuous improvement.

---

## 6. Example Use Case
1. User uploads a new FAQ document to Google Drive.
2. Workflow extracts, splits, and embeds the document.
3. Embeddings are stored in Supabase.
4. User asks a question via API/UI.
5. System retrieves relevant chunks and generates an answer using an LLM.

---

## 7. References
- [LangChain RAG Documentation](https://python.langchain.com/docs/modules/agents/agent_types/rag)
- [OpenAI API](https://platform.openai.com/docs/api-reference)
- [Supabase Vector Database](https://supabase.com/docs/guides/database/vector)
- [n8n Workflow Automation](https://n8n.io/)

---

This workflow enables robust, scalable, and up-to-date question answering by combining retrieval and generation in a seamless pipeline. Scalable up to 1 lakh+ documents.
The workflow required zero cost and was hosted in Docker on the cloud. 


