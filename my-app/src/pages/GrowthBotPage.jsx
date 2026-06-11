import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getRecommendations, isAuthenticated } from "../services/api";

export default function GrowthBotPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = location.state?.platform || "instagram";

  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [typing, setTyping] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!isAuthenticated()) {
      navigate("/login-analytics");
      return;
    }

    setTyping(true);
    setResponse(null);
    setError("");

    try {
      const data = await getRecommendations(platform, input.trim());
      setResponse(data.recommendations || []);
    } catch (err) {
      if (err.status === 401) {
        navigate("/login-analytics");
      } else {
        setError(err.message || "Could not get recommendations.");
      }
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#15153b] flex flex-col justify-between px-6 py-10 text-white">
      <div className="flex flex-col items-start gap-6">
        {input && (
          <div className="self-end bg-white text-black p-4 rounded-lg max-w-xl">
            {input}
          </div>
        )}

        {typing && (
          <div className="bg-gray-100 text-black p-4 rounded-2xl max-w-xl italic text-sm">
            AI is typing...
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-2xl max-w-xl">
            {error}
          </div>
        )}

        {response && (
          <div className="bg-gray-100 text-black p-4 rounded-2xl max-w-xl">
            <h3 className="font-bold mb-2">AI CHAT BOT</h3>
            <ul className="space-y-1">
              {response.map((item, index) => (
                <li key={index}>✅ {item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-10">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="w-full p-4 rounded-full bg-white text-black placeholder-gray-500 focus:outline-none"
        />
      </form>
    </div>
  );
}
