require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const errorCelebrate = require('celebrate').errors;
const path = require('path');
const helmet = require('helmet');
// const cors = require('cors');
const cors = require('./middlewares/cors');
const router = require('./routes/index');
const { ERROR_INTERNAL_SERVER } = require('./utils/constants');
const errHandlers = require('./utils/handlers');
const { PORT, MONGODB } = require('./config');
const { requestLogger, errorLogger } = require('./middlewares/logger');
// const limiter = require('./middlewares/rateLimit');

const app = express();

mongoose.connect(MONGODB, {
  useNewUrlParser: true,
});



// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Сервер сейчас упадёт');
//   }, 0);
// });

// const allowedCors = [
//   'https://project-mesto.nomoredomains.monster',
//   'http://project-mesto.nomoredomains.monster',
//   'https://api.project-mesto.nomoredomains.monster/users/me',
//   'https://api.project-mesto.nomoredomains.monster/cards',
//   'https://api.project-mesto.nomoredomains.monster/signup',
//   'localhost:3000',
//   'localhost:3001',
//   'https://130.193.48.152',
//   'http://130.193.48.152',
// ];

// const corsOptions = {
//   origin: allowedCors,
//   optionsSuccessStatus: 200,
//   credentials: true,
// };

// app.use('*', cors(corsOptions));

app.use(cors);
app.use(cookieParser());
app.use(express.json());
app.use(helmet());
// app.use(limiter);
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
