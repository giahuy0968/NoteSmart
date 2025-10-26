import React, { useState } from 'react';
import { BrainCircuit, LoaderCircle, AlertTriangle } from 'lucide-react';
import { explainText, ExplainStyle } from '../services/geminiService';

// A simple markdown parser to render the output
const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n').map((line, index) => {
        if (line.startsWith('### ')) return <h3 key={index} className="text-xl font-bold mt-4 mb-2 text-primary-light">{line.substring(4)}</h3>;
        if (line.startsWith('## ')) return <h2 key={index} className="text-2xl font-bold mt-6 mb-3 text-white border-b border-slate-700 pb-2">{line.substring(3)}</h2>;
        if (line.startsWith('# ')) return <h1 key={index} className="text-3xl font-bold mt-8 mb-4 text-white">{line.substring(2)}</h1>;
        if (line.startsWith('- ')) return <li key={index} className="ml-5 list-disc">{line.substring(2)}</li>;
        if (line.trim() === '') return <br key={index} />;
        return <p key={index} className="my-2">{line}</p>;
    });
    return <div className="prose prose-invert text-slate-300 leading-relaxed">{lines}</div>;
};


const AIExplainView: React.FC = () => {
    const [content, setContent] = useState('');
    const [style, setStyle] = useState<ExplainStyle>('simple');
    const [explanation, setExplanation] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!content.trim()) return;
        setIsLoading(true);
        setError(null);
        setExplanation(null);
        try {
            const result = await explainText(content, style);
            setExplanation(result);
        } catch (e: any) {
            setError(e.message || "An unknown error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-lg p-6 border border-slate-700/50">
            <div className="mb-6 pb-4 border-b border-slate-700">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <BrainCircuit size={32} className="text-primary-light"/>
                    AI Explain
                </h1>
                <p className="text-slate-400">Paste any text to get a detailed explanation.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-grow min-h-0">
                {/* Input Column */}
                <div className="flex flex-col gap-4">
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-full flex-grow bg-slate-800 border border-slate-700 rounded-md p-4 text-slate-300 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder-slate-500"
                        placeholder="Enter text to explain here..."
                    />
                    <div className="flex-shrink-0 flex flex-col sm:flex-row items-center gap-4">
                        <div className="w-full sm:w-auto">
                            <label htmlFor="style-select" className="text-sm font-medium text-slate-400 mr-2">Style:</label>
                            <select
                                id="style-select"
                                value={style}
                                onChange={(e) => setStyle(e.target.value as ExplainStyle)}
                                className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="simple">Simple</option>
                                <option value="detailed">Detailed</option>
                                <option value="academic">Academic</option>
                            </select>
                        </div>
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !content.trim()}
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? <LoaderCircle className="animate-spin h-5 w-5" /> : <BrainCircuit className="h-5 w-5" />}
                            Generate Explanation
                        </button>
                    </div>
                </div>

                {/* Output Column */}
                <div className="bg-slate-800 border border-slate-700 rounded-md p-4 overflow-y-auto">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <LoaderCircle className="animate-spin h-10 w-10 mb-4 text-primary-light" />
                            <p>Generating explanation...</p>
                        </div>
                    )}
                    {error && (
                        <div className="flex flex-col items-center justify-center h-full text-error-light">
                            <AlertTriangle className="h-10 w-10 mb-4" />
                            <p className="font-semibold">Generation Failed</p>
                            <p className="text-sm text-center">{error}</p>
                        </div>
                    )}
                    {explanation && <SimpleMarkdown text={explanation} />}
                     {!isLoading && !error && !explanation && (
                         <div className="flex flex-col items-center justify-center h-full text-slate-500">
                             <p>The explanation will appear here.</p>
                         </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default AIExplainView;
