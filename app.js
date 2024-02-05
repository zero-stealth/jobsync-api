const express = require("express");
const cors = require("cors");
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const morgan = require("morgan");
const helmet = require('helmet');
const nodemailer = require('nodemailer');
const MongoStore = require('connect-mongo');
const bodyParser = require("body-parser");
const multer = require('multer');
const { connectDB } = require("./config/db");
const adminRoute = require('./routes/adminRoute');

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_CONNECTION_URL }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
  },
}));

app.use(morgan('dev'));

app.use("/data", adminRoute);

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png'];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true); 
  } else {
    cb(new Error('Invalid file type. Please upload a valid PDF or image file.'), false); // Reject the file
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
});




app.post('/send-email', upload.fields([{ name: 'cv', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), async (req, res) => {
  try {
    const { job, fullname, email, link, phone } = req.body;

    const cvBuffer = req.files['cv'][0].buffer;
    const certificateBuffer = req.files['certificate'][0].buffer;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
    });

    const mailOptions = {
      from: email,
      to:  process.env.EMAIL, 
      subject: `Applying for  ${job}`,
      text: `Full Name: ${fullname}\nEmail: ${email}\nLink: ${link}\nPhone: ${phone}`,
      attachments: [
        { filename: 'cv.pdf', content: cvBuffer, encoding: 'base64' },
        { filename: 'certificate.png', content: certificateBuffer, encoding: 'base64' }
      ]
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);

    res.status(200).send('Email sent successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'app', 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
