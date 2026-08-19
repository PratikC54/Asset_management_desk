import api from './axios';
import { getFriendlyErrorMessage } from '../utils/errorMessages';

export async function createAsset(asset) {
  try {
    const { data } = await api.post('/api/asset/create-asset', asset);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getAvailableAssets() {
  try {
    const { data } = await api.get('/api/asset/status', { params: { status: 'AVAILABLE' } });
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function getEmployees() {
  try {
    const { data } = await api.get('/api/employees');
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function createAssetRequest(request) {
  try {
    const { data } = await api.post('/api/assets/asset-request', request);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function updateAssetRequestStatus(id, status) {
  try {
    await api.patch(`/api/assets/asset-request/${id}/status`, status);
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function issueAsset(issue) {
  try {
    const { data } = await api.post('/api/assets/issue-request', issue);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}

export async function returnAsset(returnRequest) {
  try {
    const { data } = await api.post('/api/assets/return-request', returnRequest);
    return data;
  } catch (error) {
    throw new Error(getFriendlyErrorMessage(error, 'generic'));
  }
}
