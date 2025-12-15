import Appointment from '../models/Appointment.js';
import User from '../models/User.js';

export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    
    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if doctor exists
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(400).json({ message: 'Invalid doctor' });
    }
    
    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: new Date(date),
      time,
      status: 'scheduled'
    });
    
    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }
    
    const appointment = new Appointment({
      patientId: req.user._id,
      doctorId,
      date: new Date(date),
      time,
      reason
    });
    
    await appointment.save();
    await appointment.populate('doctorId', 'name email');
    
    res.status(201).json({
      message: 'Appointment booked successfully',
      appointment
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    let appointments;
    
    if (req.user.role === 'doctor') {
      appointments = await Appointment.find({ doctorId: req.user._id })
        .populate('patientId', 'name email phone')
        .sort({ date: 1, time: 1 });
    } else {
      appointments = await Appointment.find({ patientId: req.user._id })
        .populate('doctorId', 'name email')
        .sort({ date: 1, time: 1 });
    }
    
    res.json({ appointments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }
    
    // Check if user can cancel this appointment
    if (appointment.patientId.toString() !== req.user._id.toString() && 
        appointment.doctorId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this appointment' });
    }
    
    appointment.status = 'cancelled';
    await appointment.save();
    
    res.json({ message: 'Appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};