require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorCelebrate = require('celebrate').errors;
const helmet = require('helmet');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const errHandlers = require('./utils/handlers');
const { PORT, MONGODB } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/rateLimit');

const app = express();

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errorCelebrate());
app.use(errHandlers);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
