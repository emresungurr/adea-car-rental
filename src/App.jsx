import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { create } from 'zustand';
import { useEffect, useState } from 'react';
import { db } from './firebase'; 
import { collection, getDocs } from 'firebase/firestore';

/**
 * Global State Management - Zustand
 * Authentication status and role-based access are managed globally[cite: 39].
 */
const useAuthStore = create((set) => ({
  user: null,
  login: (role) => set({ user: { role } }),
  logout: () => set({ user: null }),
}));

/**
 * CustomerDashboard Component
 * Real-time vehicle data is retrieved from Cloud Firestore and rendered in the UI[cite: 37, 38].
 */
const CustomerDashboard = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Asynchronous function to fetch vehicle data from the cloud database
     * maps the document data to the local component state[cite: 38].
     */
    const fetchCars = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "cars"));
        const carList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCars(carList);
      } catch (error) {
        console.error("Database connection failure: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Customer Booking Page</h1>
      <p>Welcome! Browse our live fleet retrieved from the cloud database:</p>
      
      {loading ? (
        <p>Connecting to Firebase and fetching data...</p>
      ) : (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', marginTop: '20px' }}>
          {cars.length > 0 ? (
            cars.map(car => (
              <div key={car.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '12px', background: '#ffffff', color: '#333', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                
                {/* Image Rendering Logic - Contain property is used to prevent cropping */}
                {car.imageUrl && (
                  <img 
                    src={car.imageUrl} 
                    alt={`${car.brand} ${car.model}`} 
                    style={{ 
                      width: '100%', 
                      height: '180px', 
                      objectFit: 'contain', 
                      background: '#f0f0f0', 
                      borderRadius: '8px', 
                      marginBottom: '10px' 
                    }} 
                  />
                )}
                
                <h3 style={{ margin: '10px 0' }}>{car.brand} {car.model}</h3>
                <p style={{ fontSize: '1.1rem' }}>Daily Rate: <strong style={{ color: '#2e7d32' }}>${car.price}</strong></p>
              </div>
            ))
          ) : (
            <p>No vehicle data found in the cloud repository.</p>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Main Application Component
 * Manages global routing and programmatic role-specific navigation[cite: 34, 35].
 */
function App() {
  const { user, login, logout } = useAuthStore();

  return (
    <BrowserRouter>
      {/* Global Navigation Bar */}
      <nav style={{ padding: '15px', background: '#1a1a1a', color: 'white', display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>ADEA Auto Gallery</Link>
        {user && (
          <>
            <span style={{ color: '#4caf50', fontWeight: '500' }}>| Active Role: {user.role}</span>
            <button onClick={logout} style={{ marginLeft: 'auto', cursor: 'pointer', padding: '8px 16px', borderRadius: '4px', border: 'none', background: '#f44336', color: 'white' }}>Logout</button>
          </>
        )}
      </nav>

      <Routes>
        {/* Authentication Interface with programmatic redirection based on user role[cite: 35, 36]. */}
        <Route path="/" element={
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <h1>Login Interface</h1>
            <p>Select a specific role to test system authorization:</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', marginTop: '30px' }}>
              <button onClick={() => login('ADMIN')} style={{ padding: '12px 24px', cursor: 'pointer', borderRadius: '6px' }}>Login as Admin</button>
              <button onClick={() => login('AGENT')} style={{ padding: '12px 24px', cursor: 'pointer', borderRadius: '6px' }}>Login as Rental Agent</button>
              <button onClick={() => login('CUSTOMER')} style={{ padding: '12px 24px', cursor: 'pointer', borderRadius: '6px', background: '#2196f3', color: 'white', border: 'none' }}>Login as Customer</button>
            </div>
            
            {/* Conditional navigation based on current user state[cite: 36]. */}
            {user?.role === 'ADMIN' && <Navigate to="/admin" />}
            {user?.role === 'AGENT' && <Navigate to="/agent" />}
            {user?.role === 'CUSTOMER' && <Navigate to="/customer" />}
          </div>
        } />

        {/* Dashboard Routes for specific user roles. */}
        <Route path="/admin" element={
          <div style={{ padding: '20px' }}>
            <h1>Fleet Manager Dashboard</h1>
            <p>Administrative access granted. Monitoring inventory and system logs.</p>
          </div>
        } />

        <Route path="/agent" element={
          <div style={{ padding: '20px' }}>
            <h1>Rental Agent Interface</h1>
            <p>Operational access granted. Managing check-in/check-out workflow.</p>
          </div>
        } />

        <Route path="/customer" element={<CustomerDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;