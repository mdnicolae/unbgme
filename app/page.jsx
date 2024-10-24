"use client"; // This is a client component 👈🏽
import { useState } from 'react';
import { Button, message, Spin, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

export default function Page() {
    const [files, setFiles] = useState([]);
    const [uploadStatus, setUploadStatus] = useState({}); // Track status for each file

    const uploadServer = `https://api.nicolae.tech/api/upload`;

    // Retry mechanism for file upload
    const uploadWithRetry = async (file, maxRetries = 3) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj);

        let retries = 0;
        while (retries <= maxRetries) {
            try {
                return await axios.post(uploadServer, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    responseType: 'blob',
                });
            } catch (error) {
                retries++;
                if (retries > maxRetries) {
                    throw error;
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

        for (const file of files) {
            setUploadStatus(prev => ({ ...prev, [file.uid]: 'uploading' }));

            try {
                const response = await uploadWithRetry(file);

                // Handle successful file upload (download logic)
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

                setUploadStatus(prev => ({ ...prev, [file.uid]: 'done' }));
            } catch (error) {
                setUploadStatus(prev => ({ ...prev, [file.uid]: 'error' }));
                message.error(`Failed to upload ${file.name}`);
            }
        }

        setFiles([]);
    };

    const customItemRender = (originNode, file) => {
        const status = uploadStatus[file.uid];

        // Show error or uploading status
        let overlayContent = null;
        if (status === 'uploading') {
            overlayContent = <span className="text-sm text-secondary font-semibold">Trying...</span>;
        } else if (status === 'error') {
            overlayContent = <span className="text-sm text-warning font-semibold">Oups!</span>;
        } else if (status === 'done') {
            overlayContent = <span className="text-sm text-red font-semibold">unbged!</span>;
        }

        return (
            <div className={`thumbnail-wrapper ${status === 'error' ? 'error' : ''}`}>
                {originNode}
                {overlayContent && (
                    <div className="text-center justify-center justify-items-center">
                        {overlayContent}
                    </div>
                )}
            </div>
        );
    };

    return (
        <main className="flex flex-col gap-8 sm:gap-16">

            <section className="flex flex-col items-start gap-3 sm:gap-4 mt-10">
                <h1 className="mb-3">Easily remove background to any image using LLMs</h1>
                <p>All of the images are processed and returned by the server directly. We don't store any images.</p>
            </section>
            <section>
                <Upload
                    multiple
                    listType="picture-card"
                    maxCount={8}
                    beforeUpload={() => false} // Prevent immediate upload
                    onChange={({ fileList }) => setFiles(fileList)} // Track selected files
                    showUploadList={{
                        showRemoveIcon: true, // Allow removing files
                        showPreviewIcon: false, // Disable default preview
                    }}
                    itemRender={customItemRender} // Custom item render function
                >
                    {files.length >= 8 ? null : <div>+ Add Image</div>} {/* Limit max to 8 */}
                </Upload>

                <button
                    onClick={handleUpload}
                    disabled={files.length === 0}
                    className={`btn btn-lg btn-primary upload-btn sm:btn-wide mt-12 flex items-center justify-center ${
                        files.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    } rounded-lg `}
                >
                    <UploadOutlined className="mr-2" /> {/* You can still use the icon from `@ant-design/icons` */}
                    unbg.me
                </button>
            </section>
        </main>
    );
}
