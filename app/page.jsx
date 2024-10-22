"use client"; // This is a client component 👈🏽
import { useState } from 'react';
import Link from 'next/link';
import { Upload, Button, message, Spin } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

export default function Page() {
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState([]);

    const uploadServer = `http://142.93.172.138:5000/api/upload`; // Your backend URL

    // Handle file upload
    const handleUpload = async () => {
        if (files.length === 0) {
            message.error('Please select images first.');
            return;
        }

        setLoading(true);
        const uploadPromises = files.map(file => {
            const formData = new FormData();
            formData.append('file', file.originFileObj); // 'file' is the backend parameter name

            // Sending each file request in parallel
            return axios.post(uploadServer, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        });

        try {
            const responses = await Promise.all(uploadPromises);
            // Download all beautified images after successful uploads
            responses.forEach(response => {
                //Download image contained in the response
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'unbg.me.png');
                document.body.appendChild(link);
                link.click();
            });
            message.success('All images have been processed and downloaded!');
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
                    className="btn btn-lg btn-primary sm:btn-wide"
                >
                    unbg.me
                </Button>

                {loading && <Spin tip="Processing images..." style={{ marginTop: 16 }} />}
            </section>
        </main>
    );
}
