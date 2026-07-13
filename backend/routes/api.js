const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Tradition = require('../models/Tradition');
const requireAuth = require('../middleware/auth');

const withTraditions = { include: [{ model: Tradition, as: 'traditions' }] };

// ── Public routes ──────────────────────────────────────────────────────────────

// GET /api/places
router.get('/', async (req, res) => {
  try {
    const places = await Place.findAll(withTraditions);
    res.json(places);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch places' });
  }
});

// GET /api/places/:id
router.get('/:id', async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id, withTraditions);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch place' });
  }
});

// ── Admin routes (JWT required) ────────────────────────────────────────────────

// POST /api/places
router.post('/', requireAuth, async (req, res) => {
  try {
    const place = await Place.create(req.body);
    res.status(201).json(await Place.findByPk(place.id, withTraditions));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/places/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    await place.update(req.body);
    res.json(await Place.findByPk(place.id, withTraditions));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/places/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const deleted = await Place.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Place not found' });
    res.json({ message: 'Place deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/places/:id/traditions
router.post('/:id/traditions', requireAuth, async (req, res) => {
  try {
    const place = await Place.findByPk(req.params.id);
    if (!place) return res.status(404).json({ error: 'Place not found' });
    await Tradition.create({ ...req.body, placeId: place.id });
    res.status(201).json(await Place.findByPk(place.id, withTraditions));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT /api/places/:id/traditions/:tid
router.put('/:id/traditions/:tid', requireAuth, async (req, res) => {
  try {
    const tradition = await Tradition.findOne({
      where: { id: req.params.tid, placeId: req.params.id }
    });
    if (!tradition) return res.status(404).json({ error: 'Tradition not found' });
    await tradition.update(req.body);
    res.json(await Place.findByPk(req.params.id, withTraditions));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE /api/places/:id/traditions/:tid
router.delete('/:id/traditions/:tid', requireAuth, async (req, res) => {
  try {
    const deleted = await Tradition.destroy({
      where: { id: req.params.tid, placeId: req.params.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Tradition not found' });
    res.json(await Place.findByPk(req.params.id, withTraditions));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
