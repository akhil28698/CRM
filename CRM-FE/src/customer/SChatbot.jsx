import React, { useState } from 'react';
import { Chatbot } from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css'; // Import default styles
import './Chatbot.css'; // Import your custom CSS

// Define the configuration for the chatbot
const config = {
  botName: "CRM Bot",
  initialMessages: [
    { type: "text", text: "Hello! How can I assist you today?" }
  ],
};

// Define a custom message parser
class CustomMessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse = (message) => {
    this.actionProvider.handleDefault(message);
  };
}

// Define the action provider
class ActionProvider {
  constructor(createChatBotMessage, setState) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setState;
  }

  // Default response handler
  handleDefault = (message) => {
    const response = this.createChatBotMessage(this.getResponse(message));
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, response] }));
  };

  // Function to get responses based on user input
  getResponse = (message) => {
    // Convert message to lowercase for case-insensitive matching
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes("tickets")) {
      return "You can view your tickets in the Tickets section of your dashboard.";
    }
    if (lowerMessage.includes("create")) {
      return "To create a new ticket, go to the Tickets page and click on 'Create Ticket'.";
    }
    if (lowerMessage.includes("help")) {
      return "I'm happy to help! How can I assist you today?";
    }
    if (lowerMessage.includes("status")) {
      return "You can check the status of your tickets in the Tickets section. Look for the 'Status' column.";
    }
    if (lowerMessage.includes("employee")) {
      return "To view employee details, go to the Employees section on your dashboard.";
    }
    if (lowerMessage.includes("customer")) {
      return "You can find customer details in the Customers section of your dashboard.";
    }
    if (lowerMessage.includes("logout")) {
      return "To log out, click the Logout button located at the top right corner of your dashboard.";
    }
    if (lowerMessage.includes("change password")) {
      return "To change your password, go to your profile settings and look for the 'Change Password' option.";
    }
    if (lowerMessage.includes("chat")) {
      return "You can chat with support directly through the chat feature available on the bottom right of your dashboard.";
    }
    if (lowerMessage.includes("feedback")) {
      return "We value your feedback! Please go to the Feedback section to share your thoughts.";
    }
    if (lowerMessage.includes("report")) {
      return "To report an issue, please navigate to the Support section and fill out the report form.";
    }
    if (lowerMessage.includes("dashboard")) {
      return "Your dashboard provides an overview of your tickets, employees, and other relevant sections.";
    }

    return "I'm sorry, I didn't understand that. Can you please rephrase?";
  };

}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbot-toggle" onClick={toggleChatbot}>
        ChatBot
      </button>
      {isOpen && (
        <div className="chatbot-window">
          <Chatbot
            config={config}
            messageParser={CustomMessageParser}
            actionProvider={ActionProvider}
          />
        </div>
      )}
    </div>
  );
};

export default ChatBot;