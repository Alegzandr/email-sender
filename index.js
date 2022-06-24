const express = require('express');
const helmet = require('helmet');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const port = process.env.PORT;
const transporter = nodemailer.createTransport({
  service: process.env.SERVICE,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

app.use(helmet());
app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  transporter.sendMail({
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: req.body.name + ' <' + req.body._replyto + '> : ' + req.body._subject,
    text: req.body.message
  }, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: 'Error while sending your email.' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ success: true, message: 'Email sent successfully !' });
    }
  });
});

app.listen(port, () => {
  console.log(`Mailing app listening on port ${port}`)
});
