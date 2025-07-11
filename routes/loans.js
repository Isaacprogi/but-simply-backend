const router = require('express').Router();
const {ROLES} = require('../utils/constants.js');
const {
  getLoans,
  getUserLoans,
  getExpiredLoans,
  deleteLoan,
} = require('../controllers/loans.js');

const { protect } = require('../middleware/protect.js');
const { authorizeRoles } = require('../middleware/authorizeRoles.js');

router.use(protect);

router.get('/loans', getLoans); 

router.get('/loans/:userEmail/get', getUserLoans);

router.get('/loans/expired', getExpiredLoans);

router.delete(
  '/loans/:loanId/delete',
  authorizeRoles(ROLES.SUPERADMIN),
  deleteLoan
);

module.exports = router;
