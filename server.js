const express = require('express')
const app = express()
const port = 3000
const uuidv4 = require('uuid/v4');

const db = {};

app.post('/new-process', (req, res) => {
  const newProcessId = startNewAsyncProcess();
  res.json({ id: newProcessId });
})

app.get('/status/:id', (req, res) => {
  setTimeout(() => {
    const status = getStatus(req.params.id);
    res.json(status);
  }, randomIntFromInterval(30, 200))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

function startNewAsyncProcess() {
  const id = uuidv4();
  const startTime = new Date().getTime() / 1000;
  const endTime = startTime + randomIntFromInterval(10, 180);
  db[id] = {
    startTime,
    endTime,
  }
  return id;
}

function getStatus(id) {
  const record = db[id];
  const now = new Date().getTime() / 1000;
  const status = now > record.endTime ? 'Complete' : 'Pending';
  const progress = Math.min((now - record.startTime) / (record.endTime - record.startTime) * 100, 100);
  const downloadLink = now > record.endTime ? 'http://somedownloadlink' : null;
  return {
    status,
    progress,
    downloadLink,
  };
}

function randomIntFromInterval(min,max) {
  return Math.floor(Math.random()*(max-min+1)+min);
}
