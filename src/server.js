import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import config from '../configs/config';

const { port } = config

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// default home route
app.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: "Welcome to eazy transact",
    });
  });

  const server = app.listen(port, () => {
    console.log(`Listening on port ${server.address().port}`);
  });
