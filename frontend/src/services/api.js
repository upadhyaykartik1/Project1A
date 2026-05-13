import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const saveFormProgress = (sessionId, formData) =>
  api.post('/save-form', { sessionId, formData }).then(res => res.data);

export const getResumedData = (sessionId) =>
  api.get(`/resume-form/${sessionId}`).then(res => res.data).catch(() => ({}));

export const verifyPAN = (pan) => api.post('/verify-pan', { pan }).then(res => res.data);

export const verifyAadhaar = (aadhaar) => api.post('/verify-aadhaar', { aadhaar }).then(res => res.data);

export const addressSuggest = async (q) => {
  const res = await api.get('/address-suggest', { params: { q } });
  return res.data.suggestions || [];
};

export const getPreApproval = (data) => api.post('/preapproval', data).then(res => res.data);

export const uploadDocument = (file) => {
  const fd = new FormData();
  fd.append('document', file);
  return api.post('/upload-doc', fd).then(res => res.data);
};