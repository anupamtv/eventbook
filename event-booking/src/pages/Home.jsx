import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css'; // Adjust the path if needed

export default function Home() {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4200/events').then((res) => setEvents(res.data));
  }, []);

  return (
    <div className="home-outer">
      <div className="home-inner">
        <h2 className="page-title">Discover Amazing Events</h2>
        <button className="btn-primary"
        onClick={() => navigate('/login')}>LogOut</button>
        <button className="btn-primary"
        onClick={() => navigate('/mytickets')}>My Bookings</button>
        <div className="card-grid">
          {events.map((event) => (
            <div key={event._id} className="event-card">
            {event.imageUrl && (
            <img
              src={`http://localhost:4200${event.imageUrl}`}
              alt="Event"
              className="event-img"
            />
          )}
 
              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>
              <p className="event-guests">
                {event.guests.length} / {event.guestLimit} Guests
              </p>
              <button
                className="btn-primary"
                onClick={() => navigate(`/rsvp/${event._id}`)}
              >
                 Book Now
              </button>
              
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
