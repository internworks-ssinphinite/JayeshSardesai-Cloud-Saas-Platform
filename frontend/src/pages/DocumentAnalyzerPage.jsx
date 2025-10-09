import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Image as ImageIcon, Sparkles } from 'lucide-react';

const DocumentAnalyzerPage = () => {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAnalyze = async () => {
        if (!file) {
            setError('Please select a file to analyze.');
            return;
        }

        setIsLoading(true);
        setError('');
        setResults(null);
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('/api/analyze', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            setResults(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to analyze the document.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Document Analyzer</h1>
                <p style={{ color: 'var(--muted-foreground)' }}>
                    Upload a document (PDF, DOCX, JPG, PNG) and get an instant AI-powered summary and analysis.
                </p>
            </div>

            <div className="card">
                <div className="card-header space-y-4">
                    <div>
                        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700">Upload Document</label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            style={{ width: '100%', padding: '1rem', border: '1px solid var(--border)', borderRadius: 'var(--radius)', marginTop: '0.5rem' }}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        className="btn btn-primary"
                        disabled={isLoading}
                        style={{ width: '100%', marginTop: '1rem' }}
                    >
                        {isLoading ? 'Analyzing...' : 'Analyze Document'}
                    </button>
                </div>
            </div>

            {results && (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {results.summary && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center' }}><FileText size={20} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> Text Summary</h3>
                                <p style={{ color: 'var(--muted-foreground)', marginTop: '1rem' }}>{results.summary}</p>
                            </div>
                        </div>
                    )}
                    {results.image_analysis && results.image_analysis.length > 0 && (
                        <div className="card">
                            <div className="card-header">
                                <h3 className="card-title" style={{ display: 'flex', alignItems: 'center' }}><ImageIcon size={20} style={{ marginRight: '0.5rem', color: 'var(--primary)' }} /> Image Analysis</h3>
                                <ul style={{ listStyleType: 'disc', paddingLeft: '20px', color: 'var(--muted-foreground)', marginTop: '1rem' }}>
                                    {results.image_analysis.map((desc, index) => (
                                        <li key={index} style={{ marginBottom: '0.5rem' }}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="card" style={{ marginTop: '2rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'var(--destructive)' }}>
                    <div className="card-header">
                        <h3 className="card-title" style={{ color: 'var(--destructive)' }}>Error</h3>
                        <p style={{ color: '#c02626', marginTop: '1rem' }}>{error}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentAnalyzerPage;