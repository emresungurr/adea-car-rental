import { useEffect, useState } from 'react';
import { db } from '../firebase'; 
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { calculateTotalPrice } from '../utils/pricing';
import './BookingForm.css';

const BookingForm = ({ car, userId }) => {
  const [bookedDates, setBookedDates] = useState([]);
  const [overlapError, setOverlapError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const q = query(
          collection(db, "reservations"), 
          where("carId", "==", car.id),
          where("status", "==", "approved")
        );
        const querySnapshot = await getDocs(q);
        const dates = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return { start: new Date(data.startDate), end: new Date(data.endDate) };
        });
        setBookedDates(dates);
      } catch (error) {}
    };
    fetchReservations();
  }, [car.id]);

  const validationSchema = Yup.object({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    phone: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email").required("Required"),
    startDate: Yup.date().required("Required"),
    endDate: Yup.date()
      .min(Yup.ref('startDate'), "Return date must be after pick-up date")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: { firstName: '', lastName: '', phone: '', email: '', startDate: '', endDate: '', totalPrice: 0 },
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await addDoc(collection(db, "reservations"), {
          carId: car.id,
          carName: `${car.brand} ${car.model}`,
          userId: userId,
          firstName: values.firstName,
          lastName: values.lastName,
          phone: values.phone,
          email: values.email,
          startDate: values.startDate,
          endDate: values.endDate,
          totalPrice: values.totalPrice,
          status: "pending",
          createdAt: serverTimestamp() 
        });
        alert("Booking request submitted successfully!");
        resetForm();
        setOverlapError("");
      } catch (error) { 
        alert("Failed to submit booking.");
      }
    },
  });

  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const total = calculateTotalPrice(formik.values.startDate, formik.values.endDate, car.price);
      formik.setFieldValue('totalPrice', total);
      
      const selectedStart = new Date(formik.values.startDate);
      const selectedEnd = new Date(formik.values.endDate);
      
      const isOverlapping = bookedDates.some(res => {
        return (selectedStart <= res.end) && (selectedEnd >= res.start);
      });

      if (isOverlapping) {
        setOverlapError("THIS VEHICLE IS ALREADY BOOKED FOR THESE DATES!");
      } else {
        setOverlapError("");
      }
    }
  }, [formik.values.startDate, formik.values.endDate, car.price, bookedDates]);

  const isFormInvalid = !formik.isValid || !formik.dirty || formik.values.totalPrice === 0 || overlapError !== "";

  return (
    <div className="booking-form-modal">
      {overlapError && (
        <div style={{ color: '#ffffff', background: '#e50914', padding: '10px', borderRadius: '8px', fontWeight: 'bold', textAlign: 'center', marginBottom: '15px' }}>
          {overlapError}
        </div>
      )}
      <form onSubmit={formik.handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            name="firstName" 
            type="text" 
            placeholder="First Name"
            className="form-input-field"
            {...formik.getFieldProps('firstName')} 
            style={{ borderColor: formik.errors.firstName && formik.touched.firstName ? '#e50914' : '#dddddd' }}
          />
          <input 
            name="lastName" 
            type="text" 
            placeholder="Last Name"
            className="form-input-field"
            {...formik.getFieldProps('lastName')} 
            style={{ borderColor: formik.errors.lastName && formik.touched.lastName ? '#e50914' : '#dddddd' }}
          />
          <input 
            name="phone" 
            type="tel" 
            placeholder="Phone Number"
            className="form-input-field"
            {...formik.getFieldProps('phone')} 
            style={{ borderColor: formik.errors.phone && formik.touched.phone ? '#e50914' : '#dddddd' }}
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address"
            className="form-input-field"
            {...formik.getFieldProps('email')} 
            style={{ borderColor: formik.errors.email && formik.touched.email ? '#e50914' : '#dddddd' }}
          />
          <input 
            name="startDate" 
            type="date" 
            className="form-input-field"
            {...formik.getFieldProps('startDate')} 
            style={{ borderColor: formik.errors.startDate && formik.touched.startDate ? '#e50914' : '#dddddd' }}
          />
          <input 
            name="endDate" 
            type="date" 
            className="form-input-field"
            {...formik.getFieldProps('endDate')} 
            style={{ borderColor: formik.errors.endDate && formik.touched.endDate ? '#e50914' : '#dddddd' }}
          />
        </div>
        
        {formik.values.totalPrice > 0 && !overlapError && (
          <div style={{ margin: '15px 0 15px 0', padding: '10px', background: 'rgba(46, 125, 50, 0.1)', border: '1px solid #2e7d32', borderRadius: '5px', textAlign: 'center' }}>
            <strong style={{ color: '#2e7d32' }}>Total: ${formik.values.totalPrice}</strong>
          </div>
        )}
        
        <button 
          type="submit" 
          className="confirm-btn"
          disabled={isFormInvalid}
        >
          Confirm Reservation
        </button>
      </form>
    </div>
  );
};

export default BookingForm;