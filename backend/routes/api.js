import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Temporary in-memory store for auto-save (production would use DB)
let savedFormData = {};

// Save form progress
// Address autocomplete (mock with rich objects)
router.get('/address-suggest', (req, res) => {
  const q = req.query.q?.toLowerCase() || '';
  const mockDatabase = [
    { street: '123 Main Street', city: 'New York', state: 'NY', pincode: '10001' },
    { street: '456 Oak Avenue', city: 'Los Angeles', state: 'CA', pincode: '90001' },
    { street: '789 Pine Road', city: 'Chicago', state: 'IL', pincode: '60601' },
    { street: '101 Maple Drive', city: 'Houston', state: 'TX', pincode: '77001' },
    { street: '202 Cedar Lane', city: 'Phoenix', state: 'AZ', pincode: '85001' },
    { street: '303 Birch Blvd', city: 'Philadelphia', state: 'PA', pincode: '19101' },
    { street: '404 Walnut Street', city: 'San Antonio', state: 'TX', pincode: '78201' },
    { street: '505 Spruce Avenue', city: 'San Diego', state: 'CA', pincode: '92101' },
    { street: '606 Elm Road', city: 'Dallas', state: 'TX', pincode: '75201' },
  ];
  const filtered = mockDatabase.filter(addr =>
    addr.street.toLowerCase().includes(q) ||
    addr.city.toLowerCase().includes(q) ||
    addr.pincode.includes(q)
  );
  res.json({ suggestions: filtered });
});
router.post('/save-form', (req, res) => {
  const { sessionId, formData } = req.body;
  if (!sessionId) return res.status(400).json({ error: 'sessionId required' });
  savedFormData[sessionId] = { ...savedFormData[sessionId], ...formData, lastUpdated: Date.now() };
  res.json({ success: true });
});

// Resume form
router.get('/resume-form/:sessionId', (req, res) => {
  const data = savedFormData[req.params.sessionId] || {};
  res.json(data);
});

// Verify PAN (mock)
router.post('/verify-pan', (req, res) => {
  const { pan } = req.body;
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isValid = panRegex.test(pan);
  res.json({ valid: isValid, message: isValid ? 'PAN verified' : 'Invalid PAN format' });
});

// Verify Aadhaar (mock)
router.post('/verify-aadhaar', (req, res) => {
  const { aadhaar } = req.body;
  const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
  const isValid = aadhaarRegex.test(aadhaar);
  res.json({ valid: isValid, message: isValid ? 'Aadhaar verified' : 'Invalid Aadhaar number' });
});

// Address autocomplete (mock)
router.get('/address-suggest', (req, res) => {
  const query = req.query.q || '';
  const mockSuggestions = [
    '123 Main St, New York, NY',
    '456 Oak Ave, Los Angeles, CA',
    '789 Pine Rd, Chicago, IL',
    '101 Maple Dr, Houston, TX'
  ].filter(s => s.toLowerCase().includes(query.toLowerCase()));
  res.json({ suggestions: mockSuggestions });
});

// Pre-approval summary calculation
router.post('/preapproval', (req, res) => {
  const { loanType, annualIncome, loanAmount, employmentType, cibilScore = 750 } = req.body;
  let eligibility = 'Low';
  let maxLoan = 0;
  if (loanType === 'Personal') maxLoan = annualIncome * 1.5;
  else if (loanType === 'Home') maxLoan = annualIncome * 4;
  else maxLoan = annualIncome * 2.5;

  if (annualIncome > 800000 && cibilScore > 700 && employmentType !== 'Unemployed') eligibility = 'High';
  else if (annualIncome > 400000 || cibilScore > 650) eligibility = 'Medium';

  const approvedAmount = Math.min(loanAmount || maxLoan, maxLoan);
  const summary = {
    eligibility,
    maxLoanAmount: maxLoan,
    suggestedAmount: approvedAmount,
    interestRate: eligibility === 'High' ? 8.5 : eligibility === 'Medium' ? 10.5 : 13.0,
    message: eligibility === 'High' ? 'Congratulations! You are pre-approved.' : 'Review required.'
  };
  res.json(summary);
});

// Document upload (single file)
router.post('/upload-doc', upload.single('document'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ filePath: `/uploads/${req.file.filename}`, originalName: req.file.originalname });
});

export default router;