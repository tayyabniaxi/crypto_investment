import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPanel.css';
import { API_BASE_URL } from '../../config/api';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [loading, setLoading] = useState(false);

  const [adminStats, setAdminStats] = useState({});
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [showProfitHistoryModal, setShowProfitHistoryModal] = useState(false);
  const [userProfitHistory, setUserProfitHistory] = useState(null);

  const [accountNumber, setAccountNumber] = useState('');
  const [savingAccount, setSavingAccount] = useState(false);
  const [accountMessage, setAccountMessage] = useState('');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated, activeTab]);

  const checkAdminAuth = () => {
    const adminToken = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (adminToken && userData) {
      try {
        const user = JSON.parse(userData);
        if (user.isAdmin || user.role === 'admin') {
          setIsAuthenticated(true);
          return;
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }

    navigate('/login');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const loadAdminData = async () => {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    try {
      if (activeTab === 'Dashboard') {
        const statsResponse = await fetch(`${API_BASE_URL}/admin/stats`, { headers });
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          if (statsData.meta.status) {
            setAdminStats(statsData.data);
          }
        }
      }

      if (activeTab === 'Users') {
        const usersResponse = await fetch(`${API_BASE_URL}/admin/pending-users`, { headers });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.meta.status) {
            setPendingUsers(usersData.data);
          }
        }
      }

      if (activeTab === 'Approved Users') {
        const approvedResponse = await fetch(`${API_BASE_URL}/admin/approved-users`, { headers });
        if (approvedResponse.ok) {
          const approvedData = await approvedResponse.json();
          if (approvedData.meta.status) {
            setApprovedUsers(approvedData.data);
          }
        }
      }

      if (activeTab === 'Withdrawals') {
        const withdrawalsResponse = await fetch(`${API_BASE_URL}/admin/withdrawal-requests`, { headers });
        if (withdrawalsResponse.ok) {
          const withdrawalsData = await withdrawalsResponse.json();
          if (withdrawalsData.meta.status) {
            setWithdrawalRequests(withdrawalsData.data);
          }
        }
      }

      if (activeTab === 'Settings') {
        const accountResponse = await fetch(`${API_BASE_URL}/admin/account-number`, { headers });
        if (accountResponse.ok) {
          const accountData = await accountResponse.json();
          if (accountData.meta.status) {
            setAccountNumber(accountData.data.accountNumber);
          }
        }
      }
    } catch (error) {
      console.error('Error loading admin data:', error);
      if (error.message.includes('Unauthorized')) {
        handleLogout();
      }
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleWithdrawalClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowWithdrawalModal(true);
  };

  const handleApprovedUserClick = async (user) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/user-profit-history/${user.id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta.status) {
          setUserProfitHistory(data.data);
          setShowProfitHistoryModal(true);
        } else {
          alert('Failed to load user profit history');
        }
      }
    } catch (error) {
      console.error('Error loading profit history:', error);
      alert('Network error. Please try again.');
    }
  };

  const closeModals = () => {
    setShowUserModal(false);
    setShowWithdrawalModal(false);
    setShowProfitHistoryModal(false);
    setSelectedUser(null);
    setSelectedWithdrawal(null);
    setUserProfitHistory(null);
  };

  const handleUserAction = async (userId, action) => {
    const confirmAction = window.confirm(
      `Are you sure you want to ${action} this user? ${action === 'rejected' ? 'This will permanently delete their account.' : ''}`
    );

    if (!confirmAction) return;

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/update-user-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          status: action
        })
      });

      const data = await response.json();

      if (response.ok && data.meta.status) {
        alert(`User ${action} successfully!`);
        closeModals();
        loadAdminData();
      } else {
        alert(data.meta.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleWithdrawalAction = async (withdrawalId, status) => {
    const adminNotes = status === 'rejected' ? prompt('Enter reason for rejection:') : '';

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/update-withdrawal-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          withdrawalId,
          status,
          adminNotes
        })
      });

      const data = await response.json();

      if (response.ok && data.meta.status) {
        alert(`Withdrawal ${status} successfully!`);
        closeModals();
        loadAdminData();
      } else {
        alert(data.meta.message || 'Action failed');
      }
    } catch (error) {
      console.error('Error updating withdrawal status:', error);
      alert('Network error. Please try again.');
    }
  };

  const handleAccountSave = async () => {
    if (!accountNumber.trim()) {
      setAccountMessage('Account number is required');
      return;
    }

    setSavingAccount(true);
    setAccountMessage('');

    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/admin/account-number`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ accountNumber: accountNumber.trim() })
      });

      const data = await response.json();

      if (response.ok && data.meta.status) {
        setAccountMessage('✅ Account number updated successfully! Changes will reflect on signup page.');
      } else {
        setAccountMessage(`❌ ${data.meta.message || 'Failed to update account number'}`);
      }
    } catch (error) {
      console.error('Error updating account number:', error);
      setAccountMessage('❌ Network error. Please try again.');
    } finally {
      setSavingAccount(false);
    }
  };

  // const handlePreviewSignup = () => {
  //   window.open('/register?plan=gold', '_blank');
  // };

  const UserDetailsModal = () => {
    if (!showUserModal || !selectedUser) return null;

    return (
      <div className="modal-overlay" onClick={closeModals}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>User Registration Details</h3>
            <button className="close-btn" onClick={closeModals}>×</button>
          </div>

          <div className="modal-body">
            <div className="user-details-grid">
              <div className="user-info-section">
                <h4>📧 Contact Information</h4>
                <div className="detail-item">
                  <label>Email:</label>
                  <span>{selectedUser.email}</span>
                </div>
                <div className="detail-item">
                  <label>Registration Date:</label>
                  <span>{selectedUser.registeredAt}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedUser.status}`}>
                    {selectedUser.status.toUpperCase()}
                  </span>
                </div>
                {selectedUser.referredBy && (
                  <div className="detail-item">
                    <label>Referred By:</label>
                    <span className="referral-code">{selectedUser.referredBy}</span>
                  </div>
                )}
              </div>

              <div className="plan-info-section">
                <h4>💎 Investment Plan</h4>
                <div className="detail-item">
                  <label>Selected Plan:</label>
                  <span className="plan-name">{selectedUser.plan}</span>
                </div>
                <div className="detail-item">
                  <label>Investment Amount:</label>
                  <span className="amount">{selectedUser.investmentAmount}</span>
                </div>
              </div>
            </div>

            <div className="screenshot-section">
              <h4>🖼️ Payment Screenshot</h4>
              {selectedUser.screenshot ? (
                <div className="screenshot-container">
                  <img
                    src={selectedUser.screenshot}
                    alt="Payment Screenshot"
                    className="payment-screenshot"
                    onClick={() => window.open(selectedUser.screenshot, '_blank')}
                  />
                  <p className="screenshot-note">Click image to view full size</p>
                </div>
              ) : (
                <div className="no-screenshot">
                  <p>No payment screenshot provided</p>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <div className="action-buttons">
              <button
                onClick={() => handleUserAction(selectedUser.id, 'approved')}
                className="approve-btn-modal"
              >
                ✅ Approve User
              </button>
              <button
                onClick={() => handleUserAction(selectedUser.id, 'rejected')}
                className="reject-btn-modal"
              >
                ❌ Reject User
              </button>
              <button
                onClick={closeModals}
                className="cancel-btn-modal"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const WithdrawalDetailsModal = () => {
    if (!showWithdrawalModal || !selectedWithdrawal) return null;

    return (
      <div className="modal-overlay" onClick={closeModals}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Withdrawal Request Details</h3>
            <button className="close-btn" onClick={closeModals}>×</button>
          </div>

          <div className="modal-body">
            <div className="withdrawal-details-grid">
              <div className="withdrawal-info-section">
                <h4>💰 Withdrawal Information</h4>
                <div className="detail-item">
                  <label>User Email:</label>
                  <span>{selectedWithdrawal.userEmail}</span>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <span className="amount">{selectedWithdrawal.amount}</span>
                </div>
                <div className="detail-item">
                  <label>Withdrawal ID:</label>
                  <span className="withdrawal-id">{selectedWithdrawal.withdrawalId}</span>
                </div>
                <div className="detail-item">
                  <label>Requested Date:</label>
                  <span>{selectedWithdrawal.requestedAt}</span>
                </div>
                <div className="detail-item">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedWithdrawal.status}`}>
                    {selectedWithdrawal.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="wallet-info-section">
                <h4>🏦 Wallet Information</h4>
                <div className="detail-item">
                  <label>Binance Wallet:</label>
                  <span className="wallet-address">{selectedWithdrawal.binanceWallet}</span>
                </div>
                {selectedWithdrawal.adminNotes && (
                  <div className="detail-item">
                    <label>Admin Notes:</label>
                    <span>{selectedWithdrawal.adminNotes}</span>
                  </div>
                )}
                {selectedWithdrawal.processedAt && (
                  <div className="detail-item">
                    <label>Processed Date:</label>
                    <span>{selectedWithdrawal.processedAt}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            {selectedWithdrawal.status === 'pending' && (
              <div className="action-buttons">
                <button
                  onClick={() => handleWithdrawalAction(selectedWithdrawal.withdrawalId, 'completed')}
                  className="complete-btn-modal"
                >
                  💳 Mark as Paid
                </button>
                <button
                  onClick={() => handleWithdrawalAction(selectedWithdrawal.withdrawalId, 'rejected')}
                  className="reject-btn-modal"
                >
                  ❌ Reject
                </button>
                <button
                  onClick={closeModals}
                  className="cancel-btn-modal"
                >
                  Cancel
                </button>
              </div>
            )}
            {selectedWithdrawal.status !== 'pending' && (
              <div className="action-buttons">
                <button
                  onClick={closeModals}
                  className="cancel-btn-modal"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProfitHistoryModal = () => {
    if (!showProfitHistoryModal || !userProfitHistory) return null;

    return (
      <div className="modal-overlay" onClick={closeModals}>
        <div className="modal-content profit-history-modal" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>📊 Profit History - {userProfitHistory.user.email}</h3>
            <button className="close-btn" onClick={closeModals}>×</button>
          </div>

          <div className="modal-body">
            {/* User Summary */}
            <div className="user-summary-section">
              <h4>👤 User Summary</h4>
              <div className="summary-grid">
                <div className="summary-item">
                  <label>Plan:</label>
                  <span className="plan-badge">{userProfitHistory.user.plan.toUpperCase()}</span>
                </div>
                <div className="summary-item">
                  <label>Investment:</label>
                  <span>{userProfitHistory.user.investmentAmount}</span>
                </div>
                <div className="summary-item">
                  <label>Daily Return:</label>
                  <span>{userProfitHistory.user.dailyReturn}</span>
                </div>
                <div className="summary-item">
                  <label>Plan Started:</label>
                  <span>{userProfitHistory.user.planStartDate}</span>
                </div>
                <div className="summary-item">
                  <label>Total Days:</label>
                  <span>{userProfitHistory.user.totalDays}</span>
                </div>
                <div className="summary-item">
                  <label>Investment Earnings:</label>
                  <span className="earnings">{userProfitHistory.user.totalInvestmentEarnings}</span>
                </div>
                <div className="summary-item">
                  <label>Referral Earnings:</label>
                  <span className="earnings">{userProfitHistory.user.totalReferralEarnings}</span>
                </div>
                <div className="summary-item">
                  <label>Total Balance:</label>
                  <span className="total-balance">{userProfitHistory.user.totalBalance}</span>
                </div>
              </div>
            </div>

            {/* Daily Profits Table */}
            <div className="profits-section">
              <h4>💰 Daily Profit History</h4>
              <div className="profits-table-container">
                <table className="profits-table">
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Date</th>
                      <th>Daily Profit</th>
                      <th>Cumulative Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userProfitHistory.dailyProfits.length > 0 ? (
                      userProfitHistory.dailyProfits.map((profit, index) => (
                        <tr key={index}>
                          <td>Day {profit.day}</td>
                          <td>{profit.date}</td>
                          <td className="profit-amount">{profit.profitAmount}</td>
                          <td className="cumulative-amount">{profit.cumulativeTotal}</td>
                          <td>
                            <span className={`status-badge ${profit.status}`}>
                              {profit.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>No profit history yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Referral Earnings Table */}
            {userProfitHistory.referralEarnings.length > 0 && (
              <div className="referrals-section">
                <h4>🤝 Referral Earnings History</h4>
                <div className="referrals-table-container">
                  <table className="referrals-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>From User</th>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Rate</th>
                        <th>Original Profit</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userProfitHistory.referralEarnings.map((earning, index) => (
                        <tr key={index}>
                          <td>{earning.date}</td>
                          <td>{earning.fromUser}</td>
                          <td>
                            <span className={`type-badge ${earning.type === 'Signup Bonus' ? 'bonus' : 'commission'}`}>
                              {earning.type}
                            </span>
                          </td>
                          <td className="earning-amount">{earning.amount}</td>
                          <td>{earning.percentage}</td>
                          <td>{earning.originalProfit}</td>
                          <td>
                            <span className={`status-badge ${earning.status}`}>
                              {earning.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              onClick={closeModals}
              className="close-btn-modal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>Access Denied</h2>
        <p>Please login with admin credentials</p>
        <button onClick={() => navigate('/login')}>Go to Login</button>
      </div>
    );
  }

  return (
    <>
      <div className="admin-panel">
        <div className="admin-sidebar">
          <div className="admin-header">
            <h2>Admin Panel</h2>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </div>

          <nav className="admin-nav">
            {['Dashboard', 'Users', 'Approved Users', 'Withdrawals', 'Settings'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab === 'Settings' ? '⚙️ Settings' : 
                 tab === 'Approved Users' ? '✅ Approved Users' : tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="admin-content">
          {activeTab === 'Dashboard' && (
            <div className="dashboard-section">
              <h3>Dashboard Overview</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <h4>Total Users</h4>
                  <span className="stat-number">{adminStats.totalUsers || 0}</span>
                </div>
                <div className="stat-card">
                  <h4>Pending Users</h4>
                  <span className="stat-number">{adminStats.pendingUsers || 0}</span>
                </div>
                <div className="stat-card">
                  <h4>Approved Users</h4>
                  <span className="stat-number">{adminStats.approvedUsers || 0}</span>
                </div>
                <div className="stat-card">
                  <h4>Active Investments</h4>
                  <span className="stat-number">{adminStats.activeInvestments || 0}</span>
                </div>
                <div className="stat-card">
                  <h4>Pending Withdrawals</h4>
                  <span className="stat-number">{adminStats.pendingWithdrawalCount || 0}</span>
                </div>
                <div className="stat-card">
                  <h4>Pending Amount</h4>
                  <span className="stat-number">{adminStats.totalPendingWithdrawals || '$0'}</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Users' && (
            <div className="users-section">
              <h3>Pending User Registrations</h3>
              <div className="users-table">
                {pendingUsers.length > 0 ? (
                  pendingUsers.map((user) => (
                    <div
                      key={user.id}
                      className="user-card clickable-card"
                      onClick={() => handleUserClick(user)}
                    >
                      <div className="user-info">
                        <h4>{user.email}</h4>
                        <p>Plan: {user.plan} ({user.investmentAmount})</p>
                        <p>Registered: {user.registeredAt}</p>
                        {user.referredBy && (
                          <p>Referred by: <span className="referral-code">{user.referredBy}</span></p>
                        )}
                        <span className="click-hint">Click to view details</span>
                      </div>
                      <div className="user-screenshot">
                        {user.screenshot && (
                          <img src={user.screenshot} alt="Payment Screenshot" />
                        )}
                      </div>
                      <div className="user-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserAction(user.id, 'approved');
                          }}
                          className="approve-btn"
                        >
                          Approve
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUserAction(user.id, 'rejected');
                          }}
                          className="reject-btn"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No pending users found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Approved Users' && (
            <div className="approved-users-section">
              <h3>✅ Approved Users & Their Profits</h3>
              <div className="approved-users-table">
                {approvedUsers.length > 0 ? (
                  approvedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="approved-user-card clickable-card"
                      onClick={() => handleApprovedUserClick(user)}
                    >
                      <div className="approved-user-info">
                        <h4>{user.email}</h4>
                        <div className="user-stats-grid">
                          <div className="stat-item">
                            <label>Plan:</label>
                            <span className="plan-badge">{user.plan.toUpperCase()}</span>
                          </div>
                          <div className="stat-item">
                            <label>Investment:</label>
                            <span>{user.investmentAmount}</span>
                          </div>
                          <div className="stat-item">
                            <label>Daily Return:</label>
                            <span>{user.dailyReturn}</span>
                          </div>
                          <div className="stat-item">
                            <label>Total Earned:</label>
                            <span className="earning-amount">{user.totalEarned}</span>
                          </div>
                          <div className="stat-item">
                            <label>Referral Earnings:</label>
                            <span className="referral-amount">{user.totalReferralEarnings}</span>
                          </div>
                          <div className="stat-item">
                            <label>Total Balance:</label>
                            <span className="total-balance">{user.totalBalance}</span>
                          </div>
                          <div className="stat-item">
                            <label>Plan Started:</label>
                            <span>{user.planStartDate}</span>
                          </div>
                          <div className="stat-item">
                            <label>Last Profit:</label>
                            <span>{user.lastProfitDate}</span>
                          </div>
                          <div className="stat-item">
                            <label>Status:</label>
                            <span className={`status-badge ${user.isActive ? 'active' : 'inactive'}`}>
                              {user.isActive ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                          </div>
                        </div>
                        <span className="click-hint">📊 Click to view detailed profit history</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No approved users found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Withdrawals' && (
            <div className="withdrawals-section">
              <h3>Withdrawal Requests</h3>
              <div className="withdrawals-table">
                {withdrawalRequests.length > 0 ? (
                  withdrawalRequests.map((withdrawal) => (
                    <div
                      key={withdrawal.id}
                      className="withdrawal-card clickable-card"
                      onClick={() => handleWithdrawalClick(withdrawal)}
                    >
                      <div className="withdrawal-info">
                        <h4>{withdrawal.userEmail}</h4>
                        <p>Amount: {withdrawal.amount}</p>
                        <p>Binance Wallet: {withdrawal.binanceWallet}</p>
                        <p>Requested: {withdrawal.requestedAt}</p>
                        <p>Status: <span className={`status ${withdrawal.status}`}>{withdrawal.status}</span></p>
                        <span className="click-hint">Click to view details</span>
                      </div>
                      <div className="withdrawal-actions">
                        {withdrawal.status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWithdrawalAction(withdrawal.withdrawalId, 'completed');
                              }}
                              className="complete-btn"
                            >
                              Mark as Paid
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleWithdrawalAction(withdrawal.withdrawalId, 'rejected');
                              }}
                              className="reject-btn"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No withdrawal requests found.</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'Settings' && (
            <div className="settings-section">
              <h3>💳 Account Settings</h3>
              
              <div className="account-settings-card">
                <div className="settings-header">
                  <h4>Payment Account Number</h4>
                  <p>This account number will be shown to users on the signup page for making payments.</p>
                </div>

                <div className="account-form">
                  <div className="form-group">
                    <label htmlFor="accountNumber">Account Number:</label>
                    <textarea
                      id="accountNumber"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      placeholder="Enter the account number for user payments"
                      rows="3"
                      className="account-input"
                    />
                  </div>

                  <div className="form-actions">
                    <button
                      onClick={handleAccountSave}
                      disabled={savingAccount}
                      className="save-btn"
                    >
                      {savingAccount ? '💾 Saving...' : '💾 Save Changes'}
                    </button>

                    {/* <button
                      onClick={handlePreviewSignup}
                      className="preview-btn"
                    >
                      👁️ Preview Signup Page
                    </button> */}
                  </div>

                  {accountMessage && (
                    <div className={`message ${accountMessage.includes('✅') ? 'success' : 'error'}`}>
                      {accountMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserDetailsModal />
      <WithdrawalDetailsModal />
      <ProfitHistoryModal />
    </>
  );
};

export default AdminPanel;