const {LOAN_STATUSES} = require('../utils/constants');
const {filterLoansByRole} = require('../utils/functions')
const fs = require('fs')
const path = require('path')
const loansData = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/loans.json'), 'utf8')
);

const getLoans = (req, res) => {
  try {
    const { status } = req.query;
    console.log(status)
    const user = req.user
    let filteredLoans = [...loansData];
    
    if (status) {
      const validStatuses = [...LOAN_STATUSES];
      if (!validStatuses.includes(status.toLowerCase())) {
        return res.status(400).json({ error: 'Invalid status parameter' });
      }
      filteredLoans = filteredLoans.filter(loan => 
        loan.status.toLowerCase() === status.toLowerCase()
      );
    }
    
    const result = filterLoansByRole(filteredLoans, user.role);
    
    res.json({
      loans: result,
      total: result.length
    });
    
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ error: 'Failed to fetch loans' });
  }
};



const getUserLoans = (req, res) => {
  try {
    const { userEmail } = req.params;
    console.log(userEmail)
    
    if (!userEmail) {
      return res.status(400).json({ error: 'User email is required' });
    }
    
    const userLoans = loansData.filter(loan => 
      loan.applicant.email.toLowerCase() === userEmail.toLowerCase()
    );
    
    if (userLoans.length === 0) {
      return res.status(400).json({ loans: [] });
    }
    
    const result = filterLoansByRole(userLoans, req.user.role);
    
    res.json({
      loans: result,
      total: result.length
    });
    
  } catch (error) {
    console.log('Error fetching user loans:', error);
    res.status(500).json({ error: 'Failed to fetch user loans' });
  }
};


const getExpiredLoans = (req, res) => {
  try {
    const currentDate = new Date();
    const expiredLoans = loansData.filter(loan => {
      const maturityDate = new Date(loan.maturityDate);
      return maturityDate < currentDate;
    });
    
    const result = filterLoansByRole(expiredLoans, req.user.role);
    
    res.json({
      loans: result,
      total: result.length
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch expired loans' });
  }
};


const deleteLoan =  (req, res) => {
    try {
      const { loanId } = req.params;
      
      if (!loanId) {
        return res.status(400).json({ error: 'Loan ID is required' });
      }
      
      const loanIndex = loansData.findIndex(loan => loan.id === loanId);
      
      if (loanIndex === -1) {
        return res.status(404).json({ error: 'Loan not found' });
      }
      
      const deletedLoan = loansData.splice(loanIndex, 1)[0];
      
      
      res.json({
        message: 'Loan deleted successfully',
        deletedLoan: {
          id: deletedLoan.id,
          applicantName: deletedLoan.applicantName,
          amount: deletedLoan.amount
        }
      });
      
    } catch (error) {
      console.error('Error deleting loan:', error);
      res.status(500).json({ error: 'Failed to delete loan' });
    }
  }

  module.exports = {
    getLoans,
    getUserLoans,
    getExpiredLoans,
    deleteLoan
  };