import React, { useState } from 'react';
import { uploadImage,} from '../api';

export default function UploadTest() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testServer = async () => {
    setLoading(true);
    try {
      const response = await testConnection();
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await uploadImage(formData);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      setResult(`Upload Error: ${JSON.stringify(error.response?.data || error.message, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Upload Test & Debug</h2>
      
      <div className="space-y-4">
        <button 
          onClick={testServer}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Server Connection
        </button>

        <div>
          <label className="block text-sm font-medium mb-2">Test Image Upload:</label>
          <input
            type="file"
            accept="image/*"
            onChange={testUpload}
            disabled={loading}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {loading && (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
            Loading...
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Result:</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}