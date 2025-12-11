
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { Sequelize, DataTypes } = require('sequelize');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// AI Setup
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- DATABASE SETUP (SQLite) ---
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false
});

// Models
const Job = sequelize.define('Job', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  department: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING },
  level: { type: DataTypes.STRING },
  shortDescription: { type: DataTypes.TEXT },
  description: { type: DataTypes.TEXT },
  responsibilities: { type: DataTypes.JSON }, // Store as JSON array
  requirements: { type: DataTypes.JSON }, // Store as JSON array
  perks: { type: DataTypes.JSON }, // Store as JSON array
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  postedDate: { type: DataTypes.STRING }
});

const Candidate = sequelize.define('Candidate', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
  location: { type: DataTypes.STRING },
  skills: { type: DataTypes.TEXT },
  linkedInUrl: { type: DataTypes.STRING },
  portfolioUrl: { type: DataTypes.STRING },
  resumePath: { type: DataTypes.STRING }
});

const Application = sequelize.define('Application', {
  referenceId: { type: DataTypes.STRING, primaryKey: true },
  status: { type: DataTypes.STRING, defaultValue: 'Received' },
  appliedDate: { type: DataTypes.STRING },
  lastUpdated: { type: DataTypes.STRING },
  jobTitle: { type: DataTypes.STRING },
  coverLetter: { type: DataTypes.TEXT },
  // Schedule tracks the state of rounds
  schedule: { type: DataTypes.JSON, defaultValue: { 
    round1: { status: 'Pending' }, 
    round2: { status: 'Pending' }, 
    round3: { status: 'Pending' } 
  }}
});

// Relationships
Job.hasMany(Application);
Application.belongsTo(Job);

Candidate.hasMany(Application);
Application.belongsTo(Candidate);

// Sync DB
sequelize.sync({ alter: true }).then(() => {
  console.log("Database synced");
  seedJobs(); // Optional: Seed initial jobs if empty
});

// File Upload Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- ROUTES ---

// 1. Get All Jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await Job.findAll();
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Apply for a Job (Create Candidate + Application)
app.post('/api/apply', upload.single('resume'), async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { 
      fullName, email, phone, location, jobId, jobType, 
      experienceYears, skills, portfolioUrl, linkedInUrl, coverLetter, jobTitle
    } = req.body;
    
    const resumePath = req.file ? req.file.path : null;

    // Check if candidate exists (Profile Reuse)
    let candidate = await Candidate.findOne({ where: { email } });

    if (candidate) {
      // Update existing profile
      await candidate.update({
        name: fullName, phone, location, skills, linkedInUrl, portfolioUrl,
        resumePath: resumePath || candidate.resumePath // Keep old resume if new one not provided
      }, { transaction: t });
    } else {
      // Create new candidate
      candidate = await Candidate.create({
        email, name: fullName, phone, location, skills, linkedInUrl, portfolioUrl, resumePath
      }, { transaction: t });
    }

    // Generate Reference ID
    const referenceId = `WCR-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString();

    // Create Application
    const application = await Application.create({
      referenceId,
      status: 'Received',
      appliedDate: date,
      lastUpdated: date,
      jobTitle: jobTitle || 'General Application',
      coverLetter,
      JobId: jobId !== 'general' ? jobId : null,
      CandidateId: candidate.id
    }, { transaction: t });

    await t.commit();
    
    // Simulate Email Trigger
    console.log(`[EMAIL SENT] To: ${email} | Subject: Application Received ${referenceId}`);

    res.json({ success: true, referenceId, message: 'Application submitted successfully' });

  } catch (err) {
    await t.rollback();
    console.error(err);
    res.status(500).json({ error: 'Application failed' });
  }
});

// 3. Candidate Login (Ref ID + Email)
app.post('/api/candidate/login', async (req, res) => {
  try {
    const { email, referenceId } = req.body;
    
    // Validate against Application
    const application = await Application.findOne({ 
      where: { referenceId },
      include: [{ model: Candidate, where: { email } }]
    });

    if (!application) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Return User Profile & Token (Simulated)
    res.json({
      success: true,
      candidate: application.Candidate
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Get Candidate Dashboard Data
app.get('/api/candidate/dashboard', async (req, res) => {
  try {
    const { email } = req.query;
    const candidate = await Candidate.findOne({
      where: { email },
      include: [{ model: Application }]
    });

    if (!candidate) return res.status(404).json({ error: 'Candidate not found' });

    res.json({
      candidate,
      applications: candidate.Applications
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Admin: Get All Applications
app.get('/api/admin/applications', async (req, res) => {
  try {
    const apps = await Application.findAll({
      include: [Candidate, Job]
    });
    
    // Flatten structure for frontend compatibility
    const formatted = apps.map(app => ({
      referenceId: app.referenceId,
      status: app.status,
      appliedDate: app.appliedDate,
      lastUpdated: app.lastUpdated,
      jobTitle: app.jobTitle,
      applicantName: app.Candidate.name,
      email: app.Candidate.email,
      phone: app.Candidate.phone,
      schedule: app.schedule,
      formData: {
        ...app.Candidate.toJSON(),
        coverLetter: app.coverLetter
      }
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Admin: Update Application Status / Schedule
app.put('/api/admin/application/:refId', async (req, res) => {
  try {
    const { refId } = req.params;
    const { status, schedule } = req.body;
    
    const app = await Application.findByPk(refId);
    if (!app) return res.status(404).json({ error: 'Not found' });

    if (status) app.status = status;
    if (schedule) app.schedule = schedule;
    app.lastUpdated = new Date().toLocaleDateString();

    await app.save();

    // Trigger Email if Scheduled
    if (status === 'Interview Scheduled') {
       const candidate = await Candidate.findByPk(app.CandidateId);
       console.log(`[EMAIL SENT] To: ${candidate.email} | Subject: Interview Scheduled. Check your portal.`);
    }

    res.json({ success: true, app });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. AI Question Generation
app.post('/api/generate-questions', async (req, res) => {
    try {
        const { domain, difficulty, topic, count, type } = req.body;

        let prompt = "";
        if (type === 'coding') {
            prompt = `Generate ${count} coding interview questions for a ${difficulty} level ${domain} developer. Topic: ${topic}. 
            Return JSON format: [{ "id": 1, "title": "...", "q": "Problem description...", "example": "Input/Output" }]`;
        } else {
            prompt = `Generate ${count} multiple choice questions for a ${difficulty} level ${domain} developer. Topic: ${topic}.
            Return JSON format: [{ "id": 1, "q": "Question text?", "options": ["A", "B", "C", "D"], "answer": "Correct Option String" }]`;
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });

        res.json(JSON.parse(response.text));
    } catch (err) {
        console.error(err);
        // Fallback data if AI fails or no key
        res.json([
            { id: 1, q: "Sample AI Question (Fallback)", options: ["A", "B", "C", "D"] }
        ]);
    }
});

// Helper: Seed Jobs
async function seedJobs() {
    const count = await Job.count();
    if (count === 0) {
        const { JOBS } = require('./seedData'); // You'd create this or just define array here
        // For simplicity, I'm skipping actual seed logic in this file snippet, 
        // but normally you'd Job.bulkCreate(JOBS_DATA)
    }
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
