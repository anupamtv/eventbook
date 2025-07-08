const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const JWT_SECRET = 'jwtpass';
const multer = require('multer');
const path = require('path');



app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


mongoose.connect('mongodb+srv://anupamtv007:anupamkrishna@cluster0.zqr8wvv.mongodb.net/Eventbook');


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
  });
  const upload = multer({ storage });


const userSchema = new mongoose.Schema({
    name: String,
    password: String,
    role: { type: String, enum: ['user', 'admin'], default: 'user' }
});
const User = mongoose.model('User', userSchema, 'users');

const eventSchema = new mongoose.Schema({
    title: String,
    description: String,
    guestLimit: Number,
    imageUrl:String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
const Event = mongoose.model('Event', eventSchema, 'events');

const guestSchema = new mongoose.Schema({
    name: String,
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
    eventName:String,
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    ticketCount:Number
});
const Guest = mongoose.model('Guest', guestSchema, 'guests');

async function basicAuth(req, res, next) {
    const token = req.headers.token;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

app.post('/signup', async (req, res) => {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const hashed = await bcrypt.hash(password, 10);

    try {
        await User.create({ name, password: hashed, role });
        res.json({ message: 'Signup successful' });
    } catch (err) {
        console.error(err);
        res.status(400).json({ error: 'Signup failed' });
    }
});

app.post('/login', async (req, res) => {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
        return res.status(400).json({ error: 'All fields required' });
    }

    const user = await User.findOne({ name, role });
    if (!user) return res.status(400).json({ error: 'Invalid credentials or role' });

    if (!user.password) return res.status(400).json({ error: 'User has no password set' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);
    res.json({ token });
});

app.post('/events', basicAuth, upload.single('image'), async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  const { title, description, guestLimit } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  const event = await Event.create({
    title,
    description,
    guestLimit,
    imageUrl,
    createdBy: req.user.userId
  });

  res.json(event);
});

app.get('/events', async (req, res) => {
    const events = await Event.find();
    const fullData = await Promise.all(events.map(async event => {
        const guests = await Guest.find({ eventId: event._id });
        return { ...event._doc, guests };
    }));
    res.json(fullData);
});

app.get('/my-events', basicAuth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    const events = await Event.find({ createdBy: req.user.userId });
    const fullData = await Promise.all(events.map(async event => {
        const guests = await Guest.find({ eventId: event._id });
        return { ...event._doc, guests };
    }));
    res.json(fullData);
});

app.delete('/events/:id', basicAuth, async (req, res) => {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.createdBy.toString() !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });
    await Guest.deleteMany({ eventId: event._id });
    await Event.findByIdAndDelete(event._id);
    res.json({ message: 'Event deleted' });
});

app.post('/rsvp/:eventId', basicAuth, async (req, res) => {
    if (req.user.role !== 'user') return res.status(403).json({ error: 'Forbidden' });
  
    const { eventId } = req.params;
    const { name, ticketCount } = req.body;
    const count = parseInt(ticketCount);
  
    if (!name || isNaN(count) || count < 1) {
      return res.status(400).json({ error: 'Name and valid ticket count required' });
    }
  
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const event = await Event.findById(eventId).session(session);
      if (!event) throw new Error('Event not found');
  
      const currentCount = await Guest.countDocuments({ eventId }).session(session);
      if (currentCount + count > event.guestLimit) {
        throw new Error('Not enough tickets left');
      }
  
   
      const guests = Array.from({ length: count }).map(() => ({
        name,
        eventId,
        eventName: event.title,       
        userId: req.user.userId,
        ticketCount: 1                
      }));
  
      await Guest.insertMany(guests, { session });
  
      await session.commitTransaction();
      session.endSession();
  
      res.json({
        message: 'Tickets booked successfully!',
        tickets: guests.map((_, i) => ({
          eventTitle: event.title,
          name,
          ticketNumber: currentCount + i + 1
        }))
      });
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      res.status(400).json({ error: err.message });
    }
  });
  

app.get('/guests/:eventId', basicAuth, async (req, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const guests = await Guest.find({ eventId: req.params.eventId }).populate('userId', 'name');
    res.json(guests);
});
app.get('/my-tickets', basicAuth, async (req, res) => {
    if (req.user.role !== 'user') return res.status(403).json({ error: 'Forbidden' });

    const tickets = await Guest.find({ userId: req.user.userId }).populate('eventId', 'title');
    res.json(tickets.map(ticket => ({
        eventTitle: ticket.eventId.title,
        name: ticket.name,
        ticketId: ticket._id
    })));
});



app.listen(4200, () => console.log('server running'));