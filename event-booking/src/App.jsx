import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CreateEvent from './pages/CreateEvent';
import RSVPForm from './pages/RSVPForm';
import AdminPanel from './pages/AdminPanel';
import MyTickets from './pages/MyTickets'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/rsvp/:eventId" element={<RSVPForm />} />
        <Route path="/admin/:eventId" element={<AdminPanel />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/mytickets" element={<MyTickets/>}/>
        
      </Routes>
    </BrowserRouter>
  );
}
export default App;