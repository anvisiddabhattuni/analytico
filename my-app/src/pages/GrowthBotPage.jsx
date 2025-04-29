import React, { useState, useEffect } from "react";

export default function GrowthBotPage() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(null);
  const [typing, setTyping] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setTyping(true);
    setResponse(null);

    // Simulate call to OpenAI or actual API integration
    setTimeout(async () => {
      const mockReply = [
        "✅ Post more Reels on Thursdays (highest CTR)",
        "✅ Boost engagement by responding to top 3 fan comments per post",
        "✅ Consider collaboration posts — accounts using this grew 12% faster",
        "✅ Switch posting times from morning to early evening for 22% more reach"
      ];

      // In real usage, replace the mockReply with API call like:
      // const res = await fetch("https://api.openai.com/v1/chat/completions", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     "Authorization": `Bearer YOUR_OPENAI_API_KEY`
      //   },
      //   body: JSON.stringify({
      //     model: "gpt-3.5-turbo",
      //     messages: [{ role: "user", content: input }]
      //   })
      // });
      // const data = await res.json();
      // setResponse([data.choices[0].message.content]);

      setTyping(false);
      setResponse(mockReply);
    }, 1200);
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

        {response && (
          <div className="bg-gray-100 text-black p-4 rounded-2xl max-w-xl">
            <h3 className="font-bold mb-2">AI CHAT BOT</h3>
            <ul className="space-y-1">
              {response.map((item, index) => (
                <li key={index}>{item}</li>
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
