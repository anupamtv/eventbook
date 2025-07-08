import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function AdminHome() {
  const [events, setEvents] = useState([]);
  const[guests,setGuests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4200/my-events', {
      headers: { token: localStorage.getItem('token') }
    }).then((res) => setEvents(res.data))
    .then((res)=>setGuests(res.data));
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:4200/events/${id}`, {
      headers: { token: localStorage.getItem('token') }
    });
    setEvents(events.filter((e) => e._id !== id));
  };

  return (
    <div className="home-outer">
      
      <div className="home-inner">

        <h2 className="page-title">My Created Events</h2>
        <button className="btn-primary" onClick={() => navigate('/create')}>Create Event</button>
        <button className="btn-primary"
        onClick={() => navigate('/login')}>LogOut</button>
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <p> {event.guests.length}/{event.guestLimit} Guests</p>
              <div className="event-actions">
                <button onClick={() => navigate(`/admin/${event._id}`)}> View Guests</button>
                <button className="btn-secondary" onClick={() => handleDelete(event._id)}> Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}