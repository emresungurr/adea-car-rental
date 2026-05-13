import React from 'react';
import './AboutPage.css';

const AboutPage = () => {
  const team = [
    { name: "Emre Sungur", role: "FOUNDER & CEO", desc: "Visionary leader ensuring excellence in every transaction." },
    { name: "Abdalrahman Abualqare", role: "FLEET DIRECTOR", desc: "Overseeing global operations and strategic partnerships." },
    { name: "Ahmet Gürler", role: "GENERAL MANAGER", desc: "Expert in luxury vehicles and customer relations." },
    { name: "Deniz Hacıoğulları", role: "HEAD OF OPERATIONS", desc: "Ensuring technical quality and after-sales support." }
  ];

  const stats = [
    { label: "Years of Experience", value: "5+" },
    { label: "Cars Rented", value: "1.200+" },
    { label: "Customer Satisfaction", value: "98%" },
    { label: "Awards Won", value: "15" }
  ];

  return (
    <div className="about-wrapper">
      <section className="hero-section">
        <h1>Driving Dreams Since 2021</h1>
        <p className="hero-subtext">The most trusted name in premium automotive rentals.</p>
      </section>

      <section className="story-container">
        <div className="story-image">
           <img src="/cars/aboutus.png" alt="ADEA Auto Gallery" style={{ width: '100%', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
        </div>
        <div className="story-text">
          <h2>Our Story</h2>
          <p>
            Welcome to <strong>ADEA Luxury Fleet</strong>. Our journey began with a simple mission: 
            to change the perception of the car rental industry. We wanted to build a place 
            where transparency, quality, and customer satisfaction aren't just buzzwords, 
            but the foundation of our business.
          </p>
          <ul className="check-list">
            <li>✔ 100% Certified Inspection</li>
            <li>✔ Premium Financing Options</li>
            <li>✔ 24/7 VIP Support</li>
          </ul>
        </div>
      </section>

      <section className="stats-bar">
        {stats.map((s, i) => (
          <div key={i} className="stat-item">
            <h3>{s.value}</h3>
            <p>{s.label}</p>
          </div>
        ))}
      </section>

      <section className="team-section">
        <h2 className="section-title">Meet The Team</h2>
        <div className="team-grid">
          {team.map((m, i) => (
            <div key={i} className="team-card">
              <span className="member-role">{m.role}</span>
              <h4 className="member-name">{m.name}</h4>
              <p className="member-desc">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="map-container">
         <h2 className="section-title">Visit Our Showroom</h2>
         <p className="address-text">5. Levent, 15 Temmuz Şehitler Cd No: 14/12, 34060 Eyüpsultan/İstanbul</p>
         <div className="google-map">
            <iframe 
              title="ADEA Office"
              src="https://maps.google.com/maps?q=Hali%C3%A7%20%C3%9Cniversitesi%205.%20Levent%20Kamp%C3%BCs%C3%BC&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy"
            ></iframe>
         </div>
      </section>
    </div>
  );
};

export default AboutPage;