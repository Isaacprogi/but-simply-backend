require('dotenv/config');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.json());

// const allowedOrigins = ['http://localhost:5173'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log(origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true,
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   optionsSuccessStatus: 200,
// };

const corsOptions = {
  origin: true,
  credentials: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 200,
};


app.use(cors(corsOptions));
app.use(helmet());

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'https://trusted.cdn.com';"
  );
  next();
});

// Routes
const authRoutes = require('./routes/auth');
const loansRoutes = require('./routes/loans');

app.use('/api', authRoutes);
app.use('/api', loansRoutes);


// Error Handler
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
