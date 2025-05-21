import React, { useState } from "react";

const initialOptions = [
  "New Order",
  "Return/Cancel Service",
  "Technical Support",
  "Speak to a Representative"
];

const issueTypes = ["No Signal", "Slow Internet", "Dropped Calls", "Other"];
const languages = ["English", "Spanish", "French", "Portuguese"];
const orderOptions = [
  "Replacement Phone",
  "Replacement SIM Card",
  "New Phone",
  "New Cable TV Subscription"
];

const orderDetails = {
  "Replacement Phone": { stock: false, eta: "3 business days", delivery: "Pickup at office" },
  "Replacement SIM Card": { stock: true, eta: "Available immediately", delivery: "Pickup at office" },
  "New Phone": { stock: true, eta: "Available immediately", delivery: "Home delivery" },
  "New Cable TV Subscription": { stock: false, eta: "Available next week", delivery: "Technician will install at your home" },
};

export default function ChatBot() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Welcome to QuickConnect Support Chat!" },
    { from: "bot", text: "How can we assist you today?" }
  ]);

  const [state, setState] = useState("main_menu");
  const [input, setInput] = useState("");

  const addMessage = (from, text) => {
    setMessages((prev) => [...prev, { from, text }]);
  };

  const handleInputSubmit = () => {
    if (!input) return;
    addMessage("user", input);

    if (state === "awaiting_return_reason") {
      addMessage("bot", "Thank you. Your cancellation request has been noted and is being processed.");
    } else if (state === "awaiting_issue_description") {
      addMessage("bot", "Thanks. We've recorded your issue and will forward it to our technical team.");
    } else if (state === "check_resolved") {
      if (input.toLowerCase().includes("yes")) {
        addMessage("bot", "👍 Glad it's resolved! Let us know if you need anything else.");
      } else {
        addMessage("bot", "⚙️ We'll escalate this to our support team. You will be contacted shortly.");
      }
    }
    setState("main_menu");
    setInput("");
  };

  const handleSelect = (value) => {
    addMessage("user", value);
    if (value === "New Order") {
      setState("awaiting_order");
      addMessage("bot", "Select item to order: " + orderOptions.join(", "));
    } else if (value === "Return/Cancel Service") {
      setState("awaiting_return_reason");
      addMessage("bot", "Why are you cancelling?");
    } else if (value === "Technical Support") {
      setState("awaiting_issue_type");
      addMessage("bot", "Select issue: " + issueTypes.join(", "));
    } else if (value === "Speak to a Representative") {
      setState("awaiting_language");
      addMessage("bot", "Select language: " + languages.join(", "));
    } else if (issueTypes.includes(value)) {
      if (value === "Other") {
        setState("awaiting_issue_description");
        addMessage("bot", "Please describe your issue.");
      } else {
        addMessage("bot", "🛠 Suggested steps provided. Did it help? (yes/no)");
        setState("check_resolved");
      }
    } else if (languages.includes(value)) {
      addMessage("bot", `Connecting to a ${value}-speaking representative...`);
      setState("main_menu");
    } else if (orderOptions.includes(value)) {
      const d = orderDetails[value];
      addMessage("bot", d.stock
        ? `✅ ${value} is in stock. ETA: ${d.eta}. Delivery: ${d.delivery}`
        : `❌ ${value} is out of stock. ETA: ${d.eta}. Delivery: ${d.delivery}`);
      setState("main_menu");
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      <div className="bg-white border rounded p-4 h-[400px] overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`text-${m.from === "bot" ? "blue" : "green"}-700 mb-2`}>
            <strong>{m.from === "bot" ? "Bot" : "You"}:</strong> {m.text}
          </div>
        ))}
      </div>
      <select onChange={(e) => handleSelect(e.target.value)} className="w-full p-2 border rounded">
        <option value="">Select an option...</option>
        {initialOptions.map(opt => (
       
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type here..."
          className="flex-1 p-2 border rounded"
        />
        <button onClick={handleInputSubmit} className="px-4 bg-blue-600 text-white rounded">Send</button>
      </div>
    </div>
  );
}
