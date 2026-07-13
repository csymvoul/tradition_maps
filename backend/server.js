require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./db');
const Place = require('./models/Place');
const Tradition = require('./models/Tradition');

// Associations
Place.hasMany(Tradition, { as: 'traditions', foreignKey: 'placeId', onDelete: 'CASCADE' });
Tradition.belongsTo(Place, { foreignKey: 'placeId' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/places', require('./routes/api'));
app.use('/api/upload', require('./routes/upload'));
app.use('/auth', require('./routes/auth'));
app.use('/', require('./routes/pages'));

// Admin SPA — catch-all (must come last)
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

const port = process.env.PORT || 3000;

sequelize.sync()
  .then(() => {
    console.log('Database synced');
    app.listen(port, () => console.log(`Server listening on port ${port}`));
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
    process.exit(1);
  });
