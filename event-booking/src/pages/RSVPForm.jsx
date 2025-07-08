import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function RSVPForm() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [name, setName] = useState('');
  const [tickets, setTickets] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4200/events').then((res) => {
      const found = res.data.find((e) => e._id === eventId);
      setEvent(found);
    });
  }, [eventId]);

  const handleBook = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:4200/rsvp/${eventId}`,
        { name, ticketCount }, {
        headers: { token: localStorage.getItem('token') }
      });
      setTickets(res.data.tickets);
    } catch (err) {
      alert(err.response?.data?.error || 'Booking failed');
    }
  };

  if (!event) return <div className="auth-container">Loading...</div>;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Book for {event.title}</h2>
        <button className="btn-primary" onClick={() => navigate('/home')}>Back</button>
        <p className="event-description">{event.description}</p>
        <p className="event-guests">Spots left: {event.guestLimit - event.guests.length}</p>

        <form onSubmit={handleBook} className="auth-form">
          <input placeholder="Your Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <select
            value={ticketCount}
            onChange={(e) => setTicketCount(parseInt(e.target.value))}
          >
            {[...Array(10)].map((_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1} Ticket{i ? 's' : ''}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary">Confirm RSVP</button>
        </form>

        {tickets.length > 0 && (
      <div className="event-card" style={{ marginTop: '2rem' }}>
        <h3>Booking Confirmed</h3>
        <p><strong>Name:</strong> {tickets[0].name}</p>
        <p><strong>Total Tickets:</strong> {tickets.length}</p>
    </div>
)}

      </div>
    </div>
  );
}