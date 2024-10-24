"use client"; // This is a client component 👈🏽
import { useState } from 'react';
import { Button, message, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({}); // Track upload status of each file

    const uploadServer = `https://api.nicolae.tech/api/upload`; // Your backend URL

    // Handle file upload
    const handleUpload = async () => {
        if (files.length === 0) {
            message.error('Please select images first.');
            return;
        }

        setLoading(true);
        let maxRetries = 3; // Number of retries

        // Upload files one by one
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file.originFileObj);

            setUploadStatus(prev => ({ ...prev, [file.uid]: 'started' }));

            try {
                // Retry function
                const uploadWithRetry = async (retryCount = 0) => {
                    try {
                        return await axios.post(uploadServer, formData, {
                            headers: { 'Content-Type': 'multipart/form-data' },
                            responseType: 'blob',
                        });
                    } catch (error) {
                        if (error.response && error.response.status === 502 && retryCount < maxRetries) {
                            console.log(`Retrying... (${retryCount + 1})`);
                            return uploadWithRetry(retryCount + 1);
                        }
                        throw error;
                    }
                };

                const response = await uploadWithRetry();

                // Create a Blob from the response with the correct MIME type
                const blob = new Blob([response.data], { type: 'image/png' });

                // Create an object URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Create a link to download the image
                const link = document.createElement('a');
                link.href = url;

                // Generate a unique filename
                const filename = 'unbgme-' + uuidv4() + '.png';
                link.setAttribute('download', filename);

                // Append link to the document and trigger click to download the image
                document.body.appendChild(link);
                link.click();

                // Clean up: remove the link and revoke the object URL
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                setUploadStatus(prev => ({ ...prev, [file.uid]: 'finished' }));
            } catch (error) {
                message.error(`Failed to upload ${file.name}`);
                setUploadStatus(prev => ({ ...prev, [file.uid]: 'failed' }));
            }
        }

        // Clear list with uploaded files
        setFiles([]);
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
