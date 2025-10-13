import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Image as ImageIcon, Sparkles, UploadCloud } from 'lucide-react';

const DocumentAnalyzerPage = () => {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError('');
        }
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
            if (err.response?.status === 403) {
                setError('You have run out of analysis credits. Please upgrade your plan in the Billing section.');
            } else {
                setError(err.response?.data?.message || 'Failed to analyze the document.');
            }
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
                        <label htmlFor="file-upload" style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '2rem', border: '2px dashed var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer',
                            backgroundColor: 'var(--muted)'
                        }}>
                            <UploadCloud size={40} style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
                                {file ? file.name : 'Click to upload or drag and drop'}
                            </span>
                            <span style={{ fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                                PDF, DOCX, JPG, or PNG
                            </span>
                        </label>
                        <input
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </div>

                    <button
                        onClick={handleAnalyze}
                        className="btn btn-primary"
                        disabled={isLoading || !file}
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