import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
export const ContextObj = createContext();

const CRMProvider = ({ children }) => {
  // const navigate = useNavigate();
  // admin
  // ---> handle login






  // customer
  //  ---> dashboard functionality
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isCreateTicketModalOpen, setIsCreateTicketModalOpen] = useState(false);
  const [isTicketDetailsModalOpen, setIsTicketDetailsModalOpen] = useState(false);
  const handleOpenCreateTicketModal = () => {
    setIsCreateTicketModalOpen(true);
  };
  const handleOpenTicketDetailsModal = (ticket) => {
    setSelectedTicket(ticket);
    setIsTicketDetailsModalOpen(true);
  };
  const handleCloseModals = () => {
    setIsCreateTicketModalOpen(false);
    setIsTicketDetailsModalOpen(false);
    handleTicketCreated();
    setSelectedTicket(null);
  };
  const handleLogout = () => {
    sessionStorage.removeItem("Authorization");
    Navigate("/customer")
  };

  // State for controlling the visibility of the popup
  const [showPopup, setShowPopup] = useState(false);
  const handleTicketCreated = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  // Format date utility
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  };

  // ---> login and signup states
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  // ---> create ticket and fething tickets to show in customer dashboard
  const [tickets, setTickets] = useState([]);
  const fetchTickets = async (token) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tickets/', {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      const responseData = await response.json();
      setTickets(responseData);
      if (!response.ok) {
        sessionStorage.removeItem("Authorization");
        sessionStorage.removeItem('username');
      }
    } catch (error) {

      console.error('Error fetching tickets:', error);
    }
  };
  const handleSubmitTicketCustomer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get('subject').trim();
    const description = formData.get('description').trim();
    const token = sessionStorage.getItem('Authorization');
    try {
      const response = await fetch('http://127.0.0.1:8000/tickets/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
        body: JSON.stringify({ subject, description }),
      });

      if (response.ok) {
        fetchTickets(token);
        handleCloseModals();
      } else {
        const data = await response.json();
      }

      if (response.status == 401) {
        sessionStorage.removeItem("Authorization");
        sessionStorage.removeItem('username');
      }
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };
  useEffect(() => {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      fetchTickets(token);
    }
  }, []);

  // ---> handle chats on ticket
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const handleSendMessage = () => {
    if (message.trim()) {
      setChat([...chat, { user: 'Customer', message }]);
      setMessage('');
    }
  };















  // employee



  const chatData = [];


  return (
    <ContextObj.Provider value={{
      // admin



      // customer
      toggleForm, isLogin, handleSubmitTicketCustomer,
      message, chat, setMessage, handleSendMessage,
      handleCloseModals, handleLogout, handleOpenCreateTicketModal, handleOpenTicketDetailsModal,
      tickets, isCreateTicketModalOpen, isTicketDetailsModalOpen, selectedTicket, handleTicketCreated, setTickets,
      formatDate, showPopup, chatData, fetchTickets


      // employeee
    }} >
      {children}
    </ContextObj.Provider>
  );
};

export default CRMProvider;