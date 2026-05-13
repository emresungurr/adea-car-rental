import React from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import './ContactPage.css';

const ContactPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      await addDoc(collection(db, "messages"), {
        fullName: data.fullName,
        email: data.email,
        subject: data.subject,
        message: data.message,
        createdAt: serverTimestamp()
      });
      alert("Message sent successfully! Our team will contact you shortly.");
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-card">
        
        <div className="contact-header">
          <h1 className="contact-title">Get In Touch</h1>
          <p className="contact-subtitle">Have a question about a vehicle? We are here to help.</p>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="fullName" required placeholder="Enter your full name" className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" required placeholder="name@example.com" className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input type="text" name="subject" required placeholder="I'm interested in..." className="form-input" />
          </div>
          
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea name="message" required placeholder="Type your message here..." className="form-textarea"></textarea>
          </div>
          
          <button type="submit" className="submit-btn">
            Send Message
          </button>
        </form>

        <div className="contact-info-section">
          <div className="contact-info-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffb800" className="contact-info-icon">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
            </svg>
            <span className="contact-info-text">+(90) 552 343 4431</span>
          </div>
          <div className="contact-info-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffb800" className="contact-info-icon">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="contact-info-text">5. Levent, 15 Temmuz Şehitler Cd<br/>No: 14/12, Eyüpsultan</span>
          </div>
          <div className="contact-info-item">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#ffb800" className="contact-info-icon">
              <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
            </svg>
            <span className="contact-info-text">info@adealuxury.com</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;