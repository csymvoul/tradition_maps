require('dotenv').config();
const sequelize = require('./db');
const Place = require('./models/Place');
const Tradition = require('./models/Tradition');

Place.hasMany(Tradition, { as: 'traditions', foreignKey: 'placeId', onDelete: 'CASCADE' });
Tradition.belongsTo(Place, { foreignKey: 'placeId' });

const rawPlaces = [
  {
    name: 'Κρήτη', region: 'Κρήτη',
    description: 'Η Κρήτη, ως ένα από τα μεγαλύτερα και πιο πολιτισμικά πλούσια νησιά της Ελλάδας, διαθέτει πλούσιες τοπικές μουσικές παραδόσεις που συνδυάζουν επιρροές από την ελληνική και την ανατολική μουσική.',
    latitude: 35.23, longitude: 24.81,
    image: 'https://foresies-paradosi.gr/wp-content/uploads/2017/05/kythnos-andriki-paradosiaki-foresia-kyklades-638x961.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Κρήτης', category: 'festival',
      description: 'Η Κρήτη διαθέτει πλούσιες τοπικές μουσικές παραδόσεις που συνδυάζουν επιρροές από την ελληνική και την ανατολική μουσική.',
      detailedDescription: 'Η Κρήτη, ως ένα από τα μεγαλύτερα νησιά, διαθέτει πλούσιες παραδόσεις. <p><b>Μουσικά Όργανα</b></p><ul><li>Λύρα</li><li>Λαούτο</li><li>Νταούλι</li></ul>',
      image: 'https://foresies-paradosi.gr/wp-content/uploads/2017/05/kythnos-andriki-paradosiaki-foresia-kyklades-638x961.jpg',
      youtube: 'https://www.youtube.com/watch?v=m-ZUQGwt7yo',
      google: 'https://www.google.com/search?q=athens+greece',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/athens'
    }]
  },
  {
    name: 'Κυκλάδες', region: 'Κυκλάδες',
    description: 'Οι Κυκλάδες είναι μια ομάδα νησιών στο Αιγαίο, με πλούσια μουσική παράδοση που συνδυάζει στοιχεία από την αρχαία ελληνική μουσική.',
    latitude: 37.00, longitude: 25.30,
    image: 'https://foresies-paradosi.gr/wp-content/uploads/2017/05/kythnos-andriki-paradosiaki-foresia-kyklades-638x961.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Κυκλάδων', category: 'festival',
      description: 'Οι Κυκλάδες διαθέτουν μια πλούσια μουσική παράδοση, με ποικιλία οργάνων.',
      detailedDescription: 'Οι Κυκλάδες διαθέτουν μια πλούσια μουσική παράδοση. <ul><li>Τσαμπούνα</li><li>Τουμπί</li><li>Βιολί</li></ul>',
      image: 'https://foresies-paradosi.gr/wp-content/uploads/2017/05/kythnos-andriki-paradosiaki-foresia-kyklades-638x961.jpg',
      youtube: 'https://www.youtube.com/watch?v=WtExNiTIrlA',
      google: 'https://www.google.com/search?q=kyklades',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/platamonas'
    }]
  },
  {
    name: 'Επτάνησα', region: 'Επτάνησα',
    description: 'Τα νησιά του Ιονίου Πελάγους έχουν μια πλούσια μουσική παράδοση, επηρεασμένη από τη δυτική μουσική.',
    latitude: 38.39, longitude: 20.58,
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Neapolitan_mandolin_001.jpg/184px-Neapolitan_mandolin_001.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Επτανήσων', category: 'festival',
      description: 'Τα Επτάνησα διαθέτουν ιδιαίτερη μουσική κουλτούρα με έντονες δυτικές επιρροές.',
      detailedDescription: 'Τα Επτάνησα διαθέτουν πλούσια παράδοση. <ul><li>Μαντολίνο</li><li>Κιθάρα</li><li>Βιολί</li></ul>',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Neapolitan_mandolin_001.jpg/184px-Neapolitan_mandolin_001.jpg',
      youtube: 'https://www.youtube.com/watch?v=2xm4U4vx-DI',
      google: 'https://www.google.com/search?q=eptanisa-greece',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/tripoli'
    }]
  },
  {
    name: 'Πελοπόννησος', region: 'Πελοπόννησος',
    description: 'Η Πελοπόννησος έχει πλούσια μουσική παράδοση που αντλεί στοιχεία από την αρχαία ελληνική, τη βυζαντινή και τη δημοτική μουσική.',
    latitude: 37.59, longitude: 22.04,
    image: 'https://www.kalimera-arkadia.gr/media/k2/items/cache/74224e85c5bab006cf267e4b805f8772_XL.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Πελοποννήσου', category: 'festival',
      description: 'Η Πελοπόννησος αποτελεί έναν από τους σημαντικότερους πυρήνες ελληνικής παραδοσιακής μουσικής.',
      detailedDescription: 'Η Πελοπόννησος έχει πλούσια παράδοση. <ul><li>Κλαρίνο</li><li>Βιολί</li><li>Ζουρνάς</li></ul>',
      image: 'https://www.kalimera-arkadia.gr/media/k2/items/cache/74224e85c5bab006cf267e4b805f8772_XL.jpg',
      youtube: 'https://www.youtube.com/watch?v=v8wkQqYXJtA',
      google: 'https://www.google.com/search?q=peloponnisos-greece',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/tripoli'
    }]
  },
  {
    name: 'Ήπειρος', region: 'Ήπειρος',
    description: 'Η Ήπειρος είναι μια περιοχή με ιδιαίτερα πλούσια μουσική παράδοση, γνωστή για τα βαθιά συναισθηματικά τραγούδια της.',
    latitude: 39.81, longitude: 20.76,
    image: 'https://olanea.gr/wp-content/uploads/2023/06/ipeiros230608.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Ηπείρου', category: 'music',
      description: 'Η μουσική παράδοση της Ηπείρου είναι από τις αρχαιότερες της Ελλάδας.',
      detailedDescription: 'Η Ήπειρος έχει βαθιά μουσική παράδοση. <ul><li>Κλαρίνο</li><li>Βιολί</li><li>Λαούτο</li></ul>',
      image: 'https://olanea.gr/wp-content/uploads/2023/06/ipeiros230608.jpg',
      youtube: 'https://www.youtube.com/watch?v=oWRoD8XR6A8',
      google: 'https://www.google.com/search?q=epirus-greece',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/tripoli'
    }]
  },
  {
    name: 'Μακεδονία', region: 'Μακεδονία',
    description: 'Η μουσική παράδοση της Μακεδονίας είναι πλούσια και πολυποίκιλη, αντικατοπτρίζοντας την ιστορία και τις πολιτισμικές επιρροές της περιοχής.',
    latitude: 41.03, longitude: 23.07,
    image: 'https://olanea.gr/wp-content/uploads/2023/06/ipeiros230608.jpg',
    traditions: [{
      name: 'Μουσική Παράδοση Μακεδονίας', category: 'music',
      description: 'Η μακεδονική μουσική παράδοση διαμορφώθηκε μέσα από ποικίλες ιστορικές επιρροές.',
      detailedDescription: 'Η Μακεδονία έχει δυναμική μουσική παράδοση. <ul><li>Γκάιντα</li><li>Κλαρίνο</li><li>Ζουρνάς</li></ul>',
      image: 'https://olanea.gr/wp-content/uploads/2023/06/ipeiros230608.jpg',
      youtube: 'https://www.youtube.com/watch?v=T5sC5aXRfTA',
      google: 'https://www.google.com/search?q=macedonia-greece',
      visitgreece: 'https://www.visitgreece.gr/en/mainland/tripoli'
    }]
  }
];

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Tables created');

  for (const p of rawPlaces) {
    const { traditions, ...placeData } = p;
    const place = await Place.create(placeData);
    for (const t of traditions) {
      await Tradition.create({ ...t, placeId: place.id });
    }
    console.log(`  Seeded: ${place.name}`);
  }

  console.log('Done');
  await sequelize.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
