const express = require('express');
const app = express();
const path = require('path');
const userModel = require('./models/user');
const { unsubscribe } = require('diagnostics_channel');
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/read', async (req, res) => {
  const users = await userModel.find();
  res.render('read', {users});
});

app.post('/create', async (req, res) => {
  const { name, email, image } = req.body;
  let createdUser = await userModel.create({ name, email, image });

  res.redirect('/read');
})

app.get('/delete/:_id', async (req, res) => {
  const { _id } = req.params;
  await userModel.findOneAndDelete({_id});
  res.redirect('/read');
})

app.get('/edit/:_id', async (req, res) => {
  const user = await userModel.findOne({ _id: req.params._id });
  res.render('edit', { user });
})

app.post('/update/:_id', async (req, res) => {
  const { name, email, image } = req.body;
  await userModel.findOneAndUpdate(
    { _id: req.params._id },
    { name, email, image },
    { new: true }
  );
  
  res.redirect('/read');
});


app.listen(3000);