import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

export default function AdminPanel() {
  const { eventId } = useParams();
  const [eventTitle, setEventTitle] = useState('');
  const [guests, setGuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');
    const token = localStorage.getItem('token');

    if (role !== 'admin' || !token) {
      alert('Access denied');
      navigate('/home');
      return;
    }

    // Get event title from all events
    axios.get(`http://localhost:4200/events`)
      .then((res) => {
        const found = res.data.find((e) => e._id === eventId);
        if (found) setEventTitle(found.title);
      });

    // Get guest list for this event
    axios.get(`http://localhost:4200/guests/${eventId}`, {
      headers: { token },
    })
      .then((res) => {
        setGuests(res.data);
      })
      .catch(() => {
        alert('Event not found or unauthorized');
        navigate('/admin-home');
      });
  }, [eventId, navigate]);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title"> Guest List for: {eventTitle}</h2>
        <ul className="guest-list">
          {guests.length === 0 ? (
            <p>No guests have RSVP'd yet.</p>
          ) : (
            guests.map((guest, i) => (
              <li key={i}>• {guest.name}</li>
            ))
          )}
        </ul>
        <button className="btn-secondary" onClick={() => navigate('/admin-home')}> Back</button>
      </div>
    </div>
  );
}
