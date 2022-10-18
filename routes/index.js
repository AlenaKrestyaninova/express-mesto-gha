const router = require('express').Router();
const cardsRouter = require('./cards');
const usersRouter = require('./users');

router.get('/', (req, res) => {
  res.send('GET REQUEST');
});

router.post('/', (req, res) => {
  res.send(req.body);
});

router.use('./cards', cardsRouter);
router.use('./users', usersRouter);

module.exports = router;
