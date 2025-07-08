
# 🎟️ Eventbrite Lite - Event RSVP & Management App

A full-stack event booking and RSVP platform built using **React**, **Node.js**, **Express**, **MongoDB**, and **Multer**. Admins can create events with images and guest limits. Users can RSVP to events and view their tickets.

---

## 🔥 Features

### 👤 User
- 📝 Signup & 🔐 Login (JWT-based auth)
- 🎫 RSVP to events (with ticket quantity)
- 📃 View previously booked tickets

### 🧑‍💼 Admin
- 📝 Signup & 🔐 Login
- ➕ Create events with image upload
- 📋 View all created events
- 🧾 View all guests for each event
- ❌ Delete events

---

## ⚙️ Tech Stack

| Layer        | Technologies                            |
|--------------|-----------------------------------------|
| 👨‍🎨 Frontend | React, TailwindCSS, React Router, Axios |
| 🧠 Backend   | Node.js, Express                        |
| 🛢️ Database | MongoDB with Mongoose                   |
| 🔐 Auth      | JWT, bcrypt                             |
| 🖼️ Uploads   | Multer (with static `/uploads` folder)  |

---

## 🗂️ Project Structure

eventbrite-lite/
├── backend/
│ ├── index.js
│ ├── uploads/ # uploaded event images
│ └── package.json
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ └── App.jsx
│ └── package.json

