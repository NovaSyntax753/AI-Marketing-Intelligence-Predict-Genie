import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { uploadDataset } from '@/lib/api';
import { FaUpload, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);

    try {
      const data = await uploadDataset(file);
      setResult(data);
      setFile(null);

      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Upload Dataset
          </h1>
          <p className="text-gray-600">
            Upload your social media dataset CSV to analyze engagement performance
          </p>
        </div>

        <div className="card">
          <div className="space-y-6">

            {/* Upload Box */}

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">

              <FaUpload className="text-5xl text-gray-400 mx-auto mb-4" />

              <label htmlFor="file-upload" className="cursor-pointer">

                <span className="text-primary font-semibold">
                  Choose a CSV file
                </span>

                <span className="text-gray-600"> or drag and drop</span>

                <input
                  id="file-upload"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  className="hidden"
                />

              </label>

              <p className="text-sm text-gray-500 mt-2">
                CSV files only
              </p>

            </div>

            {/* Selected File */}

            {file && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Selected:</strong> {file.name}
                </p>
                <p className="text-sm text-gray-600">
                  Size: {(file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            )}

            {/* Upload Button */}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Dataset'}
            </button>

            {/* Success Message */}

            {result && result.success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">

                <div className="flex items-start">

                  <FaCheckCircle className="text-green-500 text-xl mt-1 mr-3" />

                  <div>

                    <h3 className="font-semibold text-green-900">
                      Upload Successful
                    </h3>

                    <p className="text-sm text-green-700 mt-1">
                      {result.message}
                    </p>

                    <div className="mt-2 text-sm text-green-700">

                      <p>Records added: {result.records_added}</p>

                      <p>Total rows processed: {result.total_rows}</p>

                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* Error Message */}

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">

                <div className="flex items-start">

                  <FaExclamationCircle className="text-red-500 text-xl mt-1 mr-3" />

                  <div>

                    <h3 className="font-semibold text-red-900">
                      Upload Failed
                    </h3>

                    <p className="text-sm text-red-700 mt-1">
                      {error}
                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>
        </div>

        {/* CSV Format Guide */}

        <div className="card bg-gray-50">

          <h3 className="text-xl font-semibold mb-4">
            Required CSV Format
          </h3>

          <p className="text-gray-600 mb-4">
            Your CSV file must contain the following columns:
          </p>

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-300">

              <thead className="bg-gray-100">

                <tr>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Column</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-2 text-left text-sm font-semibold">Description</th>
                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">user_id</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">Unique user identifier</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Followers_count</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Number of followers</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Post_ID</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Post identifier</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Post_Date</td>
                  <td className="px-4 py-2 text-sm">date</td>
                  <td className="px-4 py-2 text-sm">Date of the post</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Post_type</td>
                  <td className="px-4 py-2 text-sm">string</td>
                  <td className="px-4 py-2 text-sm">Type of content (image, reel, video)</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Likes</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Number of likes</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Comments</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Number of comments</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Reposts</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Number of reposts</td>
                </tr>

                <tr>
                  <td className="px-4 py-2 text-sm font-mono">Engagement_score</td>
                  <td className="px-4 py-2 text-sm">integer</td>
                  <td className="px-4 py-2 text-sm">Overall engagement score</td>
                </tr>

              </tbody>

            </table>

          </div>

          <div className="mt-4 p-4 bg-white rounded border">

            <p className="text-sm font-semibold mb-2">
              Example CSV
            </p>

            <pre className="text-xs text-gray-700 overflow-x-auto">

user_id,Followers_count,Post_ID,Post_Date,Post_type,Likes,Comments,Reposts,Engagement_score
U1,5592,1,2024-01-01,image,120,10,2,35
U2,60000,1,2024-01-02,video,400,50,20,120

            </pre>

          </div>

        </div>

      </div>
    </Layout>
  );
}

