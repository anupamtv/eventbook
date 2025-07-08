import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('http://localhost:4200/my-tickets', {
          headers: { token: localStorage.getItem('token') },
        });

        const grouped = res.data.reduce((acc, { eventTitle, name }) => {
          const key = `${eventTitle}|${name}`;
          if (!acc[key]) {
            acc[key] = { eventTitle, name, count: 1 };
          } else {
            acc[key].count += 1;
          }
          return acc;
        }, {});

        setTickets(Object.values(grouped));
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
      <button className="btn-primary"
        onClick={() => navigate('/home')}>Back</button>
        <h2 className="auth-title">My Tickets</h2>
        {tickets.length === 0 ? (
          <p>No tickets booked yet.</p>
        ) : (
          tickets.map((ticket, i) => (
            <div key={i} className="event-card" style={{ marginBottom: '1rem' }}>
              <p><strong>Event:</strong> {ticket.eventTitle}</p>
              <p><strong>Name:</strong> {ticket.name}</p>
              <p><strong>Total Tickets:</strong> {ticket.count}</p>
            </div>
          ))
          
        )}
      </div>
    </div>
  );
}
