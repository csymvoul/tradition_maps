const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Tradition = require('../models/Tradition');

const withTraditions = { include: [{ model: Tradition, as: 'traditions' }] };

router.get('/', (req, res) => {
  res.render('pages/home');
});

router.get('/map', (req, res) => {
  res.render('pages/index');
});

router.get('/about', (req, res) => {
  res.render('pages/about');
});

router.get('/info', async (req, res) => {
  try {
    const places = await Place.findAll(withTraditions);
    res.render('pages/info', { places });
  } catch (err) {
    res.status(500).send('Error loading places');
  }
});

router.get('/place/:id', async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id, withTraditions);
    if (!place) return res.status(404).send('Place not found');
    res.render('pages/place', { place });
  } catch (err) {
    res.status(500).send('Error loading place');
  }
});

module.exports = router;
