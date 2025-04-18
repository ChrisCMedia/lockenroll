import axios from 'axios';

const api = axios.create({
  baseURL: '/api'
});

// Request-Interceptor für Token-Authentifizierung
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  registerUser: (userData) => api.post('/auth/register', userData),
  getAllUsers: () => api.get('/auth/users'),
  updateUser: (userId, userData) => api.put(`/auth/users/${userId}`, userData),
  deleteUser: (userId) => api.delete(`/auth/users/${userId}`),
};

// Appointments API
export const appointmentAPI = {
  createAppointment: (appointmentData) => api.post('/appointments', appointmentData),
  getAvailableSlots: (date, staffId) => api.get('/appointments/available-slots', {
    params: { date, staffId }
  }),
  getAppointments: (filters) => api.get('/appointments', { params: filters }),
  getAppointmentById: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, appointmentData) => api.put(`/appointments/${id}`, appointmentData),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
};

// Config API
export const configAPI = {
  getConfig: () => api.get('/config'),
  updateConfig: (configData) => api.put('/config', { config: configData }),
  
  // Services
  getServices: () => api.get('/config/services'),
  addService: (serviceData) => api.post('/config/services', serviceData),
  updateService: (id, serviceData) => api.put(`/config/services/${id}`, serviceData),
  deleteService: (id) => api.delete(`/config/services/${id}`),
  
  // Staff
  getStaff: () => api.get('/config/staff'),
  addStaffMember: (staffData) => api.post('/config/staff', staffData),
  updateStaffMember: (id, staffData) => api.put(`/config/staff/${id}`, staffData),
  deleteStaffMember: (id) => api.delete(`/config/staff/${id}`),
  
  // Business Hours
  getBusinessHours: () => api.get('/config/business-hours'),
  updateBusinessHours: (businessHours) => api.put('/config/business-hours', { businessHours }),
};

// Contact API
export const contactAPI = {
  submitContactForm: (formData) => api.post('/contact', formData),
};

const apiServices = {
  auth: authAPI,
  appointment: appointmentAPI,
  config: configAPI,
  contact: contactAPI,
};

export default apiServices; 