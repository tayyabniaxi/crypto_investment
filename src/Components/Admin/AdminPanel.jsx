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
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

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
        } else {
          console.error('Failed to load admin stats:', statsResponse.status);
        }
      }

      if (activeTab === 'Users') {
        const usersResponse = await fetch(`${API_BASE_URL}/admin/pending-users`, { headers });
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          if (usersData.meta.status) {
            setPendingUsers(usersData.data);
          }
        } else {
          console.error('Failed to load pending users:', usersResponse.status);
        }
      }

      if (activeTab === 'Withdrawals') {
        const withdrawalsResponse = await fetch(`${API_BASE_URL}/admin/withdrawal-requests`, { headers });
        if (withdrawalsResponse.ok) {
          const withdrawalsData = await withdrawalsResponse.json();
          if (withdrawalsData.meta.status) {
            setWithdrawalRequests(withdrawalsData.data);
          }
        } else {
          console.error('Failed to load withdrawals:', withdrawalsResponse.status);
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

  const closeModals = () => {
    setShowUserModal(false);
    setShowWithdrawalModal(false);
    setSelectedUser(null);
    setSelectedWithdrawal(null);
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
                  onClick={() => handleWithdrawalAction(selectedWithdrawal.withdrawalId, 'approved')}
                  className="approve-btn-modal"
                >
                  ✅ Approve
                </button>
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
            {['Dashboard', 'Users', 'Withdrawals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
              >
                {tab}
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
                                handleWithdrawalAction(withdrawal.withdrawalId, 'approved');
                              }}
                              className="approve-btn"
                            >
                              Approve
                            </button>
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
        </div>
      </div>

      <UserDetailsModal />
      <WithdrawalDetailsModal />
    </>
  );
};

export default AdminPanel;