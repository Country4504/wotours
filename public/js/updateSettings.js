/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    console.log('updateSettings called with type:', type); // Debug log
    console.log('Data type:', data instanceof FormData ? 'FormData' : typeof data); // Debug log

    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    console.log('Request URL:', url); // Debug log

    // Add headers for FormData if needed
    const config = type === 'data' && data instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};

    console.log('Making API request...'); // Debug log
    const res = await axios({
      method: 'PATCH',
      url,
      data,
      ...config
    });

    console.log('API response:', res.data); // Debug log

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
      // For photo updates, reload the page to show new image
      if (type === 'data') {
        setTimeout(() => {
          location.reload();
        }, 1500);
      }
    }
  } catch (err) {
    console.error('Update error details:', err); // Debug log
    if (err.response) {
      console.error('Error response:', err.response.data); // Debug log
    }
    showAlert('error', err.response?.data?.message || 'An error occurred');
  }
};
