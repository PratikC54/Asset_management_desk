import api from './axios';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export async function loginUser(credentials) {
  try {
    const { data } = await api.post('/api/auth/login', credentials);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'login'));
  }
}

export async function registerUser(user) {
  try {
    const { data } = await api.post('/api/auth/register', user);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'register'));
  }
}

export async function updateUserRole(email, role) {
  try {
    const { data } = await api.put(`/api/auth/role/${encodeURIComponent(email)}/${role}`);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getAllUsersEmails() {
  try {
    const { data } = await api.get('/api/allusers');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getUserRole() {
  try {
    const { data } = await api.get('/api/role');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'session'));
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'session'));
  }
}
