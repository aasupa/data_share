// Example: pages/api/login.js
import axios from 'axios';
axios.default.withCredentials =true;
export default async function handler(req, res) {
  try {
    const response = await axios.post('http://deploy-data-share.vercel.app/api/login', req.body);
    res.status(response.status).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Server error' });
  }
}
