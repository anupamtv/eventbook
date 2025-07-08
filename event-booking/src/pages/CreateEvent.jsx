import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../App.css';

export default function CreateEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [guestLimit, setGuestLimit] = useState(1);
  const navigate = useNavigate();
  const[image,setImage] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title',title);
    formData.append('description',description);
    formData.append('guestLimit',guestLimit);
    if(image) formData.append('image',image);
    await axios.post('http://localhost:4200/events', { title, description, guestLimit }, {
      headers: { token: localStorage.getItem('token'),
        'Content-type':'multipart/form-data'
       }
    });
    navigate('/admin-home');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">📝 Create New Event</h2>
        <form onSubmit={handleCreate} className="auth-form">
          <input placeholder="Event Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
          <input type="number" placeholder="Guest Limit" value={guestLimit} onChange={(e) => setGuestLimit(Number(e.target.value))} required />
          <button type="submit" className="btn-primary">Create Event</button>
          <button className="btn-primary"
            onClick={() => navigate('/admin-home')}>Back</button>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />  
        </form>
      </div>
    </div>
  );
}