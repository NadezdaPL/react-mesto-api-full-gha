require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorCelebrate = require('celebrate').errors;
const path = require('path');
const helmet = require('helmet');
const router = require('./routes/index');
const { ERROR_INTERNAL_SERVER } = require('./utils/constants');
const errHandlers = require('./utils/handlers');
const { PORT, MONGODB } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const cors = require('./middlewares/cors');
const limiter = require('./middlewares/rateLimit');

const app = express();
mongoose.connect(MONGODB);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(cookieParser());
app.use(express.json());
// app.use(cors);
app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use('/', router);
app.use(errorLogger);
app.use(errorCelebrate());
app.use(errHandlers);

app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
  const { statusCode = ERROR_INTERNAL_SERVER, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === ERROR_INTERNAL_SERVER ? 'На сервере произошла ошибка' : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
