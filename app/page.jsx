"use client"; // This is a client component 👈🏽
import { useState } from 'react';
import { Button, message, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({});

    const uploadServer = `https://api.nicolae.tech/api/upload`; // Your backend URL

    // Retry mechanism for file upload
    const uploadWithRetry = async (file, maxRetries = 3) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj);

        let retries = 0;
        while (retries <= maxRetries) {
            try {
                // Try uploading the file
                const response = await axios.post(uploadServer, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'blob',
                });
                return response; // Success, return response
            } catch (error) {
                retries++;
                if (retries > maxRetries) {
                    throw error; // If retries are exhausted, throw error
                }
                console.log(`Retrying upload for ${file.name} (${retries}/${maxRetries})...`);
            }
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) {
            message.error('Please select images first.');
            return;
        }

        setLoading(true);

        for (const file of files) {
            setUploadStatus(prev => ({ ...prev, [file.uid]: 'started' }));

            try {
                const response = await uploadWithRetry(file);

                // Create a Blob from the response with the correct MIME type
                const blob = new Blob([response.data], { type: 'image/png' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                const filename = 'unbgme-' + uuidv4() + '.png';
                link.setAttribute('download', filename);

                // Trigger the download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                setUploadStatus(prev => ({ ...prev, [file.uid]: 'finished' }));
            } catch (error) {
                message.error(`Failed to upload ${file.name}`);
                setUploadStatus(prev => ({ ...prev, [file.uid]: 'failed' }));
            }
        }

        setFiles([]); // Clear files after upload
        message.success('All images have been processed and downloaded!');
        setLoading(false);
    };

    return (
        <main className="flex flex-col gap-8 sm:gap-16">
            <section className="flex flex-col items-start gap-3 sm:gap-4">
                <h1 className="mb-0">Easily remove background to any image using LLMs</h1>
            </section>
            <section>
                <Upload
                    multiple
                    listType="picture-card"
                    maxCount={8}
                    beforeUpload={() => false} // Prevent immediate upload; we'll handle it manually
                    onChange={({ fileList }) => setFiles(fileList)} // Track selected files
                >
                    {files.length >= 8 ? null : <div>+ Add Image</div>} {/* Limit max to 8 */}
                </Upload>

                <Button
                    icon={<UploadOutlined />}
                    onClick={handleUpload}
                    disabled={files.length === 0}
                    type="primary"
                    className="btn btn-lg btn-primary sm:btn-wide mt-4"
                >
                    unbg.me
                </Button>

                {loading && <Spin tip="Processing images..." style={{ marginTop: 16 }} />}

                <div className="file-status">
                    {files.map(file => (
                        <div key={file.uid} style={{ marginTop: 16 }}>
                            <img
                                src={URL.createObjectURL(file.originFileObj)}
                                alt={file.name}
                                style={{ width: 100, height: 100, objectFit: 'cover' }}
                            />
                            <p>
                                {uploadStatus[file.uid] === 'started' && 'Uploading...'}
                                {uploadStatus[file.uid] === 'finished' && 'Done!'}
                                {uploadStatus[file.uid] === 'failed' && 'Failed'}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
