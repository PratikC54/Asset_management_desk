import api from './axios';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export async function getEmployeeDashboardData() {
  try {
    const { data } = await api.get('/api/dashboard/employee');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getManagerDashboardData() {
  try {
    const { data } = await api.get('/api/dashboard/manager');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getStockManagerDashboardData() {
  try {
    const { data } = await api.get('/api/dashboard/stock-manager');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getAssetIssuerDashboardData() {
  try {
    const { data } = await api.get('/api/dashboard/asset-issuer');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}
