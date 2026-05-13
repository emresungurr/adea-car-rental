import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from './firebase'; 
import { collection, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BookingForm from './components/BookingForm';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { useAuthStore, useSearchStore } from './store/store';
import './App.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HomePage = () => {
  return (
    <div className="home-wrapper">
      <div className="landing-hero">
        <h1 className="main-title">FIND YOUR NEXT <span className="highlight-text">DREAM VEHICLE</span></h1>
        <p className="sub-text">We offer a curated selection of vehicles ranging from economical city models to high-performance luxury sports vehicles available for short and long-term rental. Quality and customer satisfaction are our guarantee.</p>
        <Link to="/customer" className="btn-elite">EXPLORE INVENTORY</Link>
      </div>

      <section className="featured-section">
        <h2>Featured This Month</h2>
        <div className="featured-grid">
          <div className="featured-card">
            <img src="/cars/bmw.png" alt="BMW M8 COUPE" />
            <h3>BMW M8 COUPE</h3>
            <p>A true sports car delivering thrilling performance.</p>
            <div className="price-pill">$250 / day</div>
          </div>
          <div className="featured-card">
            <img src="/cars/volkswagen.png" alt="VOLKSWAGEN PASSAT" />
            <h3>VOLKSWAGEN PASSAT</h3>
            <p>Synonymous with reliability and smooth driving experience.</p>
            <div className="price-pill">$105 / day</div>
          </div>
          <div className="featured-card">
            <img src="/cars/peugeot.png" alt="PEUGEOT 3008 SUV" />
            <h3>PEUGEOT 3008 SUV</h3>
            <p>Stylish French design with comfortable interiors.</p>
            <div className="price-pill">$100 / day</div>
          </div>
        </div>
      </section>

      <section className="why-choose-section">
        <h2>Why Choose ADEA?</h2>
        <div className="features-grid">
          <div className="feature-item">
            <h4>Certified Quality</h4>
            <p>Every vehicle undergoes a rigorous multi-point inspection by certified mechanics.</p>
          </div>
          <div className="feature-item">
            <h4>Transparent Pricing</h4>
            <p>No hidden fees. We believe in honest pricing that builds trust.</p>
          </div>
          <div className="feature-item">
            <h4>Expert Support</h4>
            <p>Our team is here to help you find the perfect car for your needs.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

const AdminDashboard = () => {
  const [reservations, setReservations] = useState([]);

  const fetchReservations = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reservations"));
      const resList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReservations(resList.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      }));
    } catch (error) {}
  };

  useEffect(() => { fetchReservations(); }, []);

  const totalRevenue = reservations
    .filter(res => res.status === 'approved' || res.status === 'completed')
    .reduce((sum, res) => sum + (Number(res.totalPrice) || 0), 0);

  const revenuePerCar = reservations
    .filter(res => res.status === 'approved' || res.status === 'completed')
    .reduce((acc, res) => {
      acc[res.carName] = (acc[res.carName] || 0) + Number(res.totalPrice);
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(revenuePerCar),
    datasets: [
      {
        label: 'Revenue ($)',
        data: Object.values(revenuePerCar),
        backgroundColor: '#ffb800',
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'REVENUE ANALYSIS PER VEHICLE', color: '#111', font: { size: 16, weight: 'bold' } },
    },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } }
    }
  };

  const handleStatusUpdate = async (reservationId, carId, newStatus) => {
    try {
      const resRef = doc(db, "reservations", reservationId);
      await updateDoc(resRef, { status: newStatus });
      
      if (newStatus === 'approved' && carId) {
        const carRef = doc(db, "cars", carId);
        await updateDoc(carRef, { isAvailable: false });
      }
      
      alert(`Reservation ${newStatus}!`);
      fetchReservations(); 
    } catch (error) {}
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Fleet Management</h1>
        <div className="stat-card">
          <small>GROSS REVENUE</small>
          <h3>${totalRevenue.toLocaleString()}</h3>
        </div>
      </div>

      <div className="chart-wrapper">
        <Bar data={chartData} options={chartOptions} />
      </div>

      <table className="data-table">
        <thead>
          <tr><th>Vehicle</th><th>Client</th><th>Total</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td>{res.carName}</td>
              <td>{res.firstName && res.lastName ? `${res.firstName} ${res.lastName}` : res.userId}</td>
              <td style={{ color: '#4caf50' }}>${res.totalPrice}</td>
              <td><span className={`status-badge ${res.status}`}>{res.status?.toUpperCase()}</span></td>
              <td>
                {res.status === 'pending' ? (
                  <div className="action-buttons">
                    <button onClick={() => handleStatusUpdate(res.id, res.carId, 'approved')} className="btn-approve">Approve</button>
                    <button onClick={() => handleStatusUpdate(res.id, res.carId, 'rejected')} className="btn-reject">Reject</button>
                  </div>
                ) : (
                  <span style={{color: '#ccc', fontSize: '0.8rem'}}>No Actions</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const CustomerDashboard = () => {
  const [cars, setCars] = useState([]);
  const { searchTerm } = useSearchStore();

  useEffect(() => {
    const fetchCars = async () => {
      const snap = await getDocs(collection(db, "cars"));
      setCars(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchCars();
  }, []);

  const filteredCars = cars.filter(car => 
    car.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const luxuryCars = filteredCars.filter(car => car.price >= 150);
  const midCars = filteredCars.filter(car => car.price >= 70 && car.price < 150);
  const economyCars = filteredCars.filter(car => car.price < 70);

  const renderSegment = (title, segmentCars) => {
    if (segmentCars.length === 0) return null;
    return (
      <div className="segment-wrapper">
        <h2 className="segment-title">{title}</h2>
        <div className="car-grid">
          {segmentCars.map(car => (
            <div key={car.id} className="car-card">
              <div className="image-container">
                <img src={car.imageUrl} alt={car.brand} className="car-image" />
              </div>
              <div className="car-info">
                <h2>{car.brand} {car.model}</h2>
                <p>Daily Rate: <span>${car.price}</span></p>
                <Link to={`/car/${car.id}`} className="btn-view-details">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      {renderSegment("Luxury Segment", luxuryCars)}
      {renderSegment("Mid-Range Segment", midCars)}
      {renderSegment("Economy Segment", economyCars)}
      {filteredCars.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>No vehicles found matching your criteria.</p>
      )}
    </div>
  );
};

const CarDetailPage = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCar = async () => {
      const docRef = doc(db, "cars", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchCar();
  }, [id]);

  if (!car) return <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.5rem' }}>Loading Elite Vehicle...</div>;

  return (
    <div className="detail-page-container">
      <button className="btn-back" onClick={() => navigate('/customer')}>← Back to Gallery</button>
      
      <div className="detail-card">
        <div className="detail-header">
          <h1 className="detail-title">{car.brand} {car.model}</h1>
          <div className="detail-price-capsule">${car.price}</div>
        </div>

        <div className="detail-content">
          <div className="detail-image-wrapper">
            <img src={car.imageUrl} alt={car.brand} className="detail-image" />
          </div>
          
          <div className="detail-specs-wrapper">
            <div className="spec-item"><strong>Engine Type:</strong> {car.engine || 'Not specified'}</div>
            <div className="spec-item"><strong>Power:</strong> {car.power || 'Not specified'}</div>
            <div className="spec-item"><strong>Torque:</strong> {car.torque || 'Not specified'}</div>
            <div className="spec-item"><strong>Transmission:</strong> {car.transmission || 'Automatic'}</div>
            <div className="spec-item"><strong>Km:</strong> {car.km ? `${car.km} Km` : '0 Km'}</div>

            <div className="detail-features">
              <h3>DETAILED</h3>
              <ul>
                <li>M xDrive System / Advanced Handling</li>
                <li>Premium Leather Interior</li>
                <li>Laser Headlight Technology</li>
                <li>360° Camera System</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="detail-booking-section">
          <div style={{maxWidth: '500px', margin: '0 auto'}}>
            <h3 style={{textAlign: 'center', marginBottom: '20px'}}>Reserve This Vehicle</h3>
            <BookingForm car={car} userId={user?.name || "Guest"} />
          </div>
        </div>
      </div>
    </div>
  );
};

const RentalAgentDashboard = () => {
  const [reservations, setReservations] = useState([]);
  useEffect(() => {
    const fetchRes = async () => {
      const snap = await getDocs(collection(db, "reservations"));
      setReservations(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).filter(r => r.status === 'approved'));
    };
    fetchRes();
  }, []);

  const handleReturn = async (reservationId, carId) => {
    try {
      await updateDoc(doc(db, "reservations", reservationId), { status: 'completed' });
      if (carId) await updateDoc(doc(db, "cars", carId), { isAvailable: true });
      alert("Car marked as returned!");
      window.location.reload();
    } catch (error) {}
  };

  return (
    <div className="dashboard-container">
      <h1>Return Operations</h1>
      <table className="data-table">
        <thead><tr><th>Active Vehicle</th><th>Client</th><th>Action</th></tr></thead>
        <tbody>
          {reservations.map(res => (
            <tr key={res.id}>
              <td>{res.carName}</td>
              <td>{res.firstName && res.lastName ? `${res.firstName} ${res.lastName}` : res.userId}</td>
              <td><button onClick={() => handleReturn(res.id, res.carId)} className="btn-complete">Mark as Returned</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AppContent = () => {
  const { user, login, logout } = useAuthStore();
  const { searchTerm, setSearchTerm } = useSearchStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handlePortalLogin = (role) => {
    if (role === 'ADMIN') {
      const username = window.prompt("Please enter ADMIN username:");
      if (username !== null) {
        if (username === "admin") {
          const pass = window.prompt("Please enter ADMIN password:");
          if (pass === "admin123") {
            login(role, "Admin Panel");
            navigate('/admin');
          } else if (pass !== null) {
            alert("Incorrect Password! Access Denied.");
          }
        } else {
          alert("Incorrect Username! Access Denied.");
        }
      }
    } else if (role === 'RENTAL_AGENT') {
      const username = window.prompt("Please enter AGENT username:");
      if (username !== null) {
        if (username === "agent") {
          const pass = window.prompt("Please enter AGENT password:");
          if (pass === "agent123") {
            login(role, "Agent Portal");
            navigate('/agent');
          } else if (pass !== null) {
            alert("Incorrect Password! Access Denied.");
          }
        } else {
          alert("Incorrect Username! Access Denied.");
        }
      }
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <Link to="/" className="brand">ADEA LUXURY</Link>
        <div className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/customer" className={`nav-link ${location.pathname === '/customer' ? 'active' : ''}`}>Vehicles</Link>
          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>About Us</Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>Contact</Link>
        </div>
        
        <div className="nav-right-section">
          <input 
            type="text" 
            placeholder="Search Vehicles..." 
            className="navbar-search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (location.pathname !== '/customer') navigate('/customer');
            }}
          />
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 320 512" width="18" height="18" fill="white"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 512 512" width="18" height="18" fill="white"><path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 448 512" width="18" height="18" fill="white"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
            </a>
          </div>
          <div className="portal-access">
            {!user ? (
              <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
                <button onClick={() => handlePortalLogin('ADMIN')} className="btn-portal">ADMIN</button>
                <button onClick={() => handlePortalLogin('RENTAL_AGENT')} className="btn-portal">AGENT</button>
              </div>
            ) : (
              <div className="user-nav">
                <span className="user-identity">{user.name}</span>
                <button onClick={() => { logout(); navigate('/'); }} className="logout-btn">SIGN OUT</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={user?.role === 'ADMIN' ? <AdminDashboard /> : <Navigate to="/" />} />
          <Route path="/customer" element={<CustomerDashboard />} />
          <Route path="/car/:id" element={<CarDetailPage />} />
          <Route path="/agent" element={user?.role === 'RENTAL_AGENT' ? <RentalAgentDashboard /> : <Navigate to="/" />} />
        </Routes>
      </div>

      <footer className="footer">
        © 2026 ADEA Auto Gallery. All Rights Reserved.
      </footer>
    </div>
  );
}

function App() {
  return <BrowserRouter><AppContent /></BrowserRouter>;
}

export default App;