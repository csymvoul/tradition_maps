require('dotenv').config();
const express = require('express');
const path = require('path');
const { DataTypes } = require('sequelize');
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

// Admin SPA
app.use('/admin', express.static(path.join(__dirname, 'public', 'admin')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin', 'index.html'));
});

// 404 handler
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.status(404).render('pages/error', { status: 404, message: 'Η σελίδα δεν βρέθηκε' });
});

// 500 handler
app.use((err, req, res, next) => {
  console.error(err);
  if (req.path.startsWith('/api/')) {
    return res.status(500).json({ error: 'Εσωτερικό σφάλμα διακομιστή' });
  }
  res.status(500).render('pages/error', { status: 500, message: 'Εσωτερικό σφάλμα διακομιστή' });
});

const port = process.env.PORT || 3000;

async function start() {
  // Create tables if they don't exist (won't modify existing tables)
  await sequelize.sync();

  // Safe migration: add `images` column to traditions if it's missing
  try {
    const qi = sequelize.getQueryInterface();
    const cols = await qi.describeTable('traditions');
    if (!cols.images) {
      await qi.addColumn('traditions', 'images', {
        type: DataTypes.JSONB,
        defaultValue: []
      });
      console.log('Migration: added images column to traditions');
    }
  } catch (e) {
    // Table doesn't exist yet — sync() already created it with the column
  }

  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

start().catch(err => {
  console.error('Startup error:', err);
  process.exit(1);
});
