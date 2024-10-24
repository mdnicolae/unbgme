"use client"; // This is a client component 👈🏽
import { useState } from 'react';
import { Button, message, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const uploadServer = `https://api.nicolae.tech/api/upload`; // Your backend URL

    // Helper function to trigger file download
    const triggerDownload = (url, filename) => {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);

        // Check for mobile browser to handle download differently
        if (/Mobi|Android/i.test(navigator.userAgent)) {
            window.open(url); // Mobile browser fallback
        } else {
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        window.URL.revokeObjectURL(url);
    };

    // Handle file upload
    const handleUpload = async () => {
        if (files.length === 0) {
            message.error('Please select images first.');
            return;
        }

        setLoading(true);
        let maxRetries = 3; // Number of retries
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('file', file.originFileObj);

            // Retry function
            const uploadWithRetry = async (retryCount = 0) => {
                try {
                    return await axios.post(uploadServer, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        responseType: 'blob'
                    }); // Return response if successful
                } catch (error) {
                    if (error.response && error.response.status === 502 && retryCount < maxRetries) {
                        console.log(`Retrying... (${retryCount + 1})`);
                        return uploadWithRetry(retryCount + 1); // Retry
                    }
                    throw error; // Throw error if retries exhausted or different error
                }
            };

            return uploadWithRetry(); // Call retry function
        });

        try {
            const responses = await Promise.all(uploadPromises);

            // Download all beautified images after successful uploads
            for (const response of responses) {
                // Create a Blob from the response with the correct MIME type
                const blob = new Blob([response.data], { type: 'image/png' });

                // Create an object URL for the blob
                const url = window.URL.createObjectURL(blob);

                // Generate a unique filename
                const filename = 'unbgme-' + uuidv4() + '.png';

                // Trigger download with a small delay to ensure multiple downloads work
                setTimeout(() => {
                    triggerDownload(url, filename);
                }, 500); // 500ms delay between each download
            }

            message.success('All images have been processed and downloaded!');
            // Clear list with uploaded files
            setFiles([]);
        } catch (error) {
            message.error('Failed to upload some images.');
        } finally {
            setLoading(false);
        }
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
            </section>
        </main>
    );
}
