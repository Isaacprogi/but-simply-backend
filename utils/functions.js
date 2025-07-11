const { ROLES } = require('./constants.js');


const filterLoansByRole = (loans, userRole) => {
  if (userRole === ROLES.ADMIN || userRole === ROLES.SUPERADMIN) {
    return loans;
  }
  return loans.map(loan => {
    const { applicant, ...rest } = loan;
    const { totalLoan, ...applicantWithoutTotal } = applicant;
    return {
      ...rest,
      applicant: applicantWithoutTotal
    };
  });
};



module.exports = {
  filterLoansByRole
}
