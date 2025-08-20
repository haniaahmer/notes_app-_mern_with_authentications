import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { healthCheck } from "../api";

// ✅ Temporary debugging component - Remove after fixing issues
export default function DebugPanel() {
  const { user, token, loading } = useContext(AuthContext);
  const [serverStatus, setServerStatus] = useState("unknown");
  const [expanded, setExpanded] = useState(false);

  const checkServer = async () => {
    try {
      await healthCheck();
      setServerStatus("healthy");
    } catch (error) {
      setServerStatus("error");
      console.error("Server health check failed:", error);
    }
  };

  useEffect(() => {
    checkServer();
  }, []);

  const clearLocalStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  const     testData = {
    localStorage: {
      user: localStorage.getItem("user"),
      token: localStorage.getItem("token") ? "Present" : "Absent",
    },
    context: {
      user: user ? "Present" : "Absent",
      token: token ? "Present" : "Absent",
      loading,
    },
    environment: {
      apiBase: import.meta.env.VITE_API_URL || "http://localhost:8000",
      mode: import.meta.env.MODE || "development",
    },
    server: serverStatus,
  };

  if (!expanded) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setExpanded(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded-lg shadow-lg hover:bg-blue-600"
        >
          🐛 Debug
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg shadow-lg p-4 max-w-md z-50">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800">Debug Panel</h3>
        <button
          onClick={() => setExpanded(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Server Status */}
        <div>
          <div className="font-medium">Server Status:</div>
          <div className={`text-${serverStatus === 'healthy' ? 'green' : serverStatus === 'error' ? 'red' : 'yellow'}-600`}>
            {serverStatus === 'healthy' ? '✅ Healthy' : serverStatus === 'error' ? '❌ Error' : '⏳ Checking...'}
          </div>
          <button
            onClick={checkServer}
            className="text-blue-500 hover:text-blue-700 text-xs"
          >
            Recheck Server
          </button>
        </div>

        {/* Environment */}
        <div>
          <div className="font-medium">Environment:</div>
          <div>API Base: {testData.environment.apiBase}</div>
          <div>Mode: {testData.environment.mode}</div>
        </div>

        {/* LocalStorage */}
        <div>
          <div className="font-medium">LocalStorage:</div>
          <div>User: {testData.localStorage.user ? '✅ Present' : '❌ Absent'}</div>
          <div>Token: {testData.localStorage.token === 'Present' ? '✅ Present' : '❌ Absent'}</div>
        </div>

        {/* Context */}
        <div>
          <div className="font-medium">Auth Context:</div>
          <div>User: {testData.context.user === 'Present' ? '✅ Present' : '❌ Absent'}</div>
          <div>Token: {testData.context.token === 'Present' ? '✅ Present' : '❌ Absent'}</div>
          <div>Loading: {testData.context.loading ? '⏳ Yes' : '✅ No'}</div>
        </div>

        {/* User Details */}
        {user && (
          <div>
            <div className="font-medium">User Details:</div>
            <div>Name: {user.name}</div>
            <div>Email: {user.email}</div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-2 border-t">
          <button
            onClick={clearLocalStorage}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 mr-2"
          >
            Clear Storage
          </button>
          <button
            onClick={() => window.location.reload()}
            className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
          >
            Reload Page
          </button>
        </div>

        {/* Console Message */}
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          💡 Check browser console for detailed logs
        </div>
      </div>
    </div>
  );
}