import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import {API_BASE_URL} from '../../config/api';
const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [binanceWallet, setBinanceWallet] = useState('');
  
  const [referralData, setReferralData] = useState({
    referralCode: '',
    totalReferrals: 0,
    activeReferrals: 0,
    referralEarnings: '$0.00',
    referralLink: ''
  });
  const [referralList, setReferralList] = useState([]);
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [withdrawalStats, setWithdrawalStats] = useState({
    totalEarned: '$0.00',
    totalWithdrawn: '$0.00',
    availableBalance: '$0.00'
  });

  useEffect(() => {
    initializeDashboard();
    
    const statusCheckInterval = setInterval(async () => {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser?.id) {
        await refreshUserData(currentUser.id);
      }
    }, 30000);

    return () => clearInterval(statusCheckInterval);
  }, [navigate]);

  const initializeDashboard = async () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      navigate('/login');
      return;
    }

    try {
      const parsedUser = JSON.parse(user);
      
      if (parsedUser.isAdmin || parsedUser.role === 'admin') {
        alert('Admin users should use the admin panel. Redirecting...');
        navigate('/admin');
        return;
      }
      
      if (parsedUser.role !== 'user') {
        localStorage.clear();
        alert('Invalid user type. Please login again.');
        navigate('/login');
        return;
      }
      
      setUserData(parsedUser);
      
      await refreshUserData(parsedUser.id);
      await loadDashboardData(parsedUser.id);
      
      setLoading(false);
    } catch (error) {
      localStorage.clear();
      navigate('/login');
    }
  };

  const refreshUserData = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/plan/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta.status) {
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          const oldStatus = currentUser?.verificationStatus;
          const newStatus = data.data.verificationStatus;
          
          const updatedUser = {
            id: data.data.userId,
            email: data.data.email,
            selectedPlan: data.data.selectedPlan,
            screenshot: currentUser?.screenshot || null,
            role: 'user',
            isAdmin: false,
            verificationStatus: newStatus || 'pending',
            isVerified: data.data.isVerified || false
          };
          
          localStorage.setItem('user', JSON.stringify(updatedUser));
          setUserData(updatedUser);
          
          if (oldStatus && oldStatus !== newStatus) {
            if (newStatus === 'approved') {
              alert('🎉 Congratulations! Your account has been approved by admin. You can now access all features!');
              await loadDashboardData(userId);
            } else if (newStatus === 'rejected') {
              alert('❌ Your account has been rejected. Please contact support for more information.');
            }
          }
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const loadDashboardData = async (userId) => {
    try {
      await loadReferralData(userId);
      await loadWithdrawalData(userId);
    } catch (error) {
      // Silent error handling
    }
  };

  const loadReferralData = async (userId) => {
    try {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (currentUser?.verificationStatus !== 'approved') {
        setReferralData({
          referralCode: '',
          totalReferrals: 0,
          activeReferrals: 0,
          referralEarnings: '$0.00',
          referralLink: ''
        });
        setReferralList([]);
        return;
      }

      const statsResponse = await fetch(`${API_BASE_URL}/referral/stats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.meta.status) {
          setReferralData(statsData.data);
        }
      } else if (statsResponse.status === 403) {
        setReferralData({
          referralCode: '',
          totalReferrals: 0,
          activeReferrals: 0,
          referralEarnings: '$0.00',
          referralLink: ''
        });
      } else {
        await generateReferralCode(userId);
      }

      const usersResponse = await fetch(`${API_BASE_URL}/referral/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        if (usersData.meta.status) {
          setReferralList(usersData.data);
        }
      }
    } catch (error) {
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser?.verificationStatus === 'approved') {
        await generateReferralCode(userId);
      }
    }
  };

  const generateReferralCode = async (userId) => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (currentUser?.verificationStatus !== 'approved') {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/referral/generate/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.meta.status) {
          setReferralData(prev => ({
            ...prev,
            referralCode: data.data.referralCode,
            referralLink: data.data.referralLink
          }));
          return data.data;
        }
      } else if (response.status === 403) {
        setReferralData({
          referralCode: '',
          totalReferrals: 0,
          activeReferrals: 0,
          referralEarnings: '$0.00',
          referralLink: ''
        });
      }
    } catch (error) {
      // Silent error handling
    }
    
    return null;
  };

  const loadWithdrawalData = async (userId) => {
    try {
      const historyResponse = await fetch(`${API_BASE_URL}/withdrawal/history/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.meta.status) {
          setWithdrawalHistory(historyData.data);
        }
      }

      const statsResponse = await fetch(`${API_BASE_URL}/withdrawal/stats/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.meta.status) {
          setWithdrawalStats(statsData.data);
        }
      }
    } catch (error) {
      // Silent error handling
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const copyReferralLink = () => {
    const referralLink = referralData.referralLink || `${window.location.origin}/register?ref=${referralData.referralCode}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      alert('Referral link copied to clipboard!');
    }).catch(() => {
      const textArea = document.createElement('textarea');
      textArea.value = referralLink;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Referral link copied to clipboard!');
    });
  };

  const isWithdrawalAvailable = () => {
    const balance = parseFloat(withdrawalStats.availableBalance.replace('$', '')) || 0;
    return userData?.verificationStatus === 'approved' && balance >= 30;
  };

  const getAvailableBalance = () => {
    return parseFloat(withdrawalStats.availableBalance.replace('$', '')) || 0;
  };

  const handleWithdrawRequest = async () => {
    if (userData?.verificationStatus !== 'approved') {
      alert('Withdrawal features are only available for approved accounts.');
      return;
    }

    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (parseFloat(withdrawAmount) < 30) {
      alert('Minimum withdrawal amount is $30');
      return;
    }

    if (!binanceWallet || !binanceWallet.trim()) {
      alert('Please enter your Binance wallet address');
      return;
    }

    const availableBalance = parseFloat(withdrawalStats.availableBalance.replace('$', '')) || 0;
    
    if (availableBalance < 30) {
      alert(`Minimum balance of $30 required for withdrawal. Available: ${withdrawalStats.availableBalance}`);
      return;
    }

    if (parseFloat(withdrawAmount) > availableBalance) {
      alert(`Insufficient balance. Available: ${withdrawalStats.availableBalance}`);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/withdrawal/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: userData.id,
          amount: parseFloat(withdrawAmount),
          binanceWallet: binanceWallet.trim()
        })
      });

      const data = await response.json();

      if (response.ok && data.meta.status) {
        alert(`Withdrawal request of $${withdrawAmount} submitted successfully!`);
        setWithdrawAmount('');
        setBinanceWallet('');
        await loadWithdrawalData(userData.id);
      } else {
        alert(data.meta.message || 'Withdrawal request failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  const userPlan = userData?.selectedPlan;
  const planName = userPlan?.planName || 'No Plan';
  const dailyReturn = userPlan?.dailyReturn || '$0.00';
  const totalEarned = userPlan?.totalEarned || 0;

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Selected Plan</h3>
          <p className="stat-value">{planName.charAt(0).toUpperCase() + planName.slice(1)}</p>
          <small>Investment Plan</small>
        </div>
        
        <div className="stat-card">
          <h3>Investment Amount</h3>
          <p className="stat-value">{userPlan?.investmentAmount || '$0'}</p>
          <small>Total Invested</small>
        </div>
        
        <div className="stat-card">
          <h3>Daily Return</h3>
          <p className="stat-value">{dailyReturn}</p>
          <small>1% Daily</small>
        </div>
        
        <div className="stat-card">
          <h3>Weekly Income</h3>
          <p className="stat-value">{userPlan?.weeklyIncome || '$0'}</p>
          <small>Expected Weekly</small>
        </div>
        
        <div className="stat-card">
          <h3>Total Earned</h3>
          <p className="stat-value">
            {userData?.verificationStatus === 'approved' ? `$${totalEarned}` : '$0.00'}
          </p>
          <small>Investment Earnings</small>
        </div>
        
        <div className="stat-card">
          <h3>Referral Earnings</h3>
          <p className="stat-value">
            {userData?.verificationStatus === 'approved' ? referralData.referralEarnings : '$0.00'}
          </p>
          <small>Commission Earned</small>
        </div>
        
        <div className="stat-card">
          <h3>Available Balance</h3>
          <p className="stat-value">
            {userData?.verificationStatus === 'approved' ? withdrawalStats.availableBalance : '$0.00'}
          </p>
          <small>Ready to Withdraw</small>
        </div>
        
        <div className="stat-card">
          <h3>Status</h3>
          <p className="stat-value">
            {userData?.verificationStatus === 'approved' ? 'Approved' : 
             userData?.verificationStatus === 'pending' ? 'Pending' : 
             userData?.verificationStatus === 'rejected' ? 'Rejected' : 'Unknown'}
          </p>
          <small>Account Status</small>
        </div>
        
        <div className="stat-card">
          <h3>Plan Status</h3>
          <p className="stat-value">
            {userPlan?.isActive && userData?.verificationStatus === 'approved' ? 'Active' : 'Inactive'}
          </p>
          <small>Investment Plan</small>
        </div>
      </div>
    </div>
  );

  const renderHistory = () => (
    <div className="history-section">
      <div className="table-header">
        <div className="header-date">Date</div>
        <div className="header-amount">Amount</div>
        <div className="header-status">Status</div>
      </div>
      <div className="table-body">
        {withdrawalHistory.length > 0 ? (
          withdrawalHistory.map((item, index) => (
            <div key={index} className="table-row">
              <div className="row-date">{item.requestedAt}</div>
              <div className="row-amount">{item.amount}</div>
              <div className={`row-status ${item.status.toLowerCase()}`}>{item.status}</div>
            </div>
          ))
        ) : (
          <div className="no-data">
            <p>No withdrawal history found</p>
          </div>
        )}
      </div>
    </div>
  );

  const renderReferral = () => {
    if (userData?.verificationStatus !== 'approved') {
      return (
        <div className="referral-section">
          <div className="feature-locked">
            <div className="lock-icon">🔒</div>
            <h3>Referral Features Locked</h3>
            <p>Referral links and commissions are only available for approved accounts.</p>
            <div className="status-notice">
              {userData?.verificationStatus === 'pending' ? 
                '⏳ Your account is pending admin approval' :
                '❌ Account verification required'
              }
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="referral-section">
        <div className="referral-header">
          <h3>Share Your Link</h3>
          <div className="referral-link-container">
            <input 
              type="text" 
              value={referralData.referralLink || `${window.location.origin}/register?ref=${referralData.referralCode}`}
              readOnly
              className="referral-input"
            />
            <button onClick={copyReferralLink} className="copy-btn">Copy Link</button>
          </div>
        </div>

        <div className="referral-stats">
          <div className="stat-item">
            <span className="stat-number">{referralData.totalReferrals}</span>
            <span className="stat-label">Total Referrals</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{referralData.activeReferrals}</span>
            <span className="stat-label">Active Referrals</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{referralData.referralEarnings}</span>
            <span className="stat-label">Referral Earnings</span>
          </div>
        </div>

        <div className="referral-list">
          <h4>Referral List</h4>
          <div className="referral-table">
            <div className="referral-table-header">
              <span>Name</span>
              <span>Email</span>
              <span>Join Date</span>
              <span>Status</span>
            </div>
            {referralList.length > 0 ? (
              referralList.map((referral, index) => (
                <div key={index} className="referral-table-row">
                  <span>{referral.name}</span>
                  <span>{referral.email}</span>
                  <span>{referral.joinDate}</span>
                  <span className={`status ${referral.status.toLowerCase()}`}>{referral.status}</span>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No referrals found. Share your link to start earning!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderWithdraw = () => {
    if (userData?.verificationStatus !== 'approved') {
      return (
        <div className="withdraw-section">
          <div className="feature-locked">
            <div className="lock-icon">💰</div>
            <h3>Withdrawal Features Locked</h3>
            <p>Withdrawal requests are only available for approved accounts.</p>
            <div className="status-notice">
              {userData?.verificationStatus === 'pending' ? 
                '⏳ Your account is pending admin approval' :
                '❌ Account verification required'
              }
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="withdraw-section">
        <div className="withdraw-request">
          <h3>Request Withdrawal</h3>
          <div className="withdraw-form">
            <div className="form-group">
              <label>Amount to Withdraw</label>
              <input 
                type="number" 
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder={isWithdrawalAvailable() ? "Enter amount (Min: $30)" : "Insufficient balance"}
                className="withdraw-input"
                min="30"
                step="0.01"
                max={getAvailableBalance()}
                disabled={!isWithdrawalAvailable()}
              />
              {!isWithdrawalAvailable() && getAvailableBalance() > 0 && getAvailableBalance() < 30 && (
                <small className="error-text">
                  Need ${(30 - getAvailableBalance()).toFixed(2)} more to reach minimum withdrawal
                </small>
              )}
            </div>
            <div className="form-group">
              <label>Binance Wallet Address</label>
              <input 
                type="text" 
                value={binanceWallet}
                onChange={(e) => setBinanceWallet(e.target.value)}
                placeholder={isWithdrawalAvailable() ? "Enter your Binance wallet address" : "Available after reaching $30 balance"}
                className="withdraw-input"
                disabled={!isWithdrawalAvailable()}
              />
              <small>Only Binance wallet addresses are accepted</small>
            </div>
            <div className="form-group">
              <label>Available Balance: <strong className={getAvailableBalance() >= 30 ? 'text-success' : 'text-danger'}>{withdrawalStats.availableBalance}</strong></label>
              <small>Total Earned: {withdrawalStats.totalEarned} | Total Withdrawn: {withdrawalStats.totalWithdrawn}</small>
              <small className="error-text bold">Minimum withdrawal: $30</small>
              {!isWithdrawalAvailable() && getAvailableBalance() < 30 && (
                <div className="withdrawal-requirements">
                  <div className="requirements-header">
                    <span>⚠️</span>
                    <strong>Withdrawal Requirements</strong>
                  </div>
                  <div className="requirements-text">
                    • Minimum balance: $30.00<br/>
                    • Current balance: {withdrawalStats.availableBalance}<br/>
                    • Need: ${Math.max(0, 30 - getAvailableBalance()).toFixed(2)} more
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={handleWithdrawRequest} 
              className={`withdraw-btn ${!isWithdrawalAvailable() ? 'disabled' : ''}`}
              disabled={!isWithdrawalAvailable()}
            >
              {!isWithdrawalAvailable() ? 
                (getAvailableBalance() < 30 ? 'Insufficient Balance' : 'Account Not Approved') : 
                'Request Withdrawal'
              }
            </button>
          </div>
        </div>

        <div className="withdraw-history">
          <h4>Withdrawal History</h4>
          <div className="withdraw-table">
            <div className="withdraw-table-header">
              <span>Date</span>
              <span>Amount</span>
              <span>Status</span>
            </div>
            {withdrawalHistory.length > 0 ? (
              withdrawalHistory.map((item, index) => (
                <div key={index} className="withdraw-table-row">
                  <span>{item.requestedAt}</span>
                  <span>{item.amount}</span>
                  <span className={`status ${item.status.toLowerCase()}`}>{item.status}</span>
                </div>
              ))
            ) : (
              <div className="no-data">
                <p>No withdrawal history found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-wrapper">
        <div className="main-layout">
          <div className="sidebar">
            <div className="user-section">
              <div className="user-card">
                <div className="user-profile">
                  <div className="user-avatar">
                    <span className="avatar-text">{userData?.email?.charAt(0).toUpperCase() || 'U'}</span>
                  </div>
                  <div className="user-details">
                    <div className="user-name">{userData?.email?.split('@')[0] || 'User'}</div>
                    <div className="user-email">{userData?.email}</div>
                    <div className="plan-info">
                      <span className="plan-badge">{planName.charAt(0).toUpperCase() + planName.slice(1)}</span>
                      <span className={`status-badge ${userData?.verificationStatus || 'pending'}`}>
                        {userData?.verificationStatus?.charAt(0).toUpperCase() + userData?.verificationStatus?.slice(1) || 'Pending'}
                      </span>
                    </div>
                    <div className="earnings-info">
                      <div className="earning-item">
                        <span className="earning-label">Investment:</span>
                        <span className="earning-value">${userData?.verificationStatus === 'approved' ? totalEarned : '0.00'}</span>
                      </div>
                      <div className="earning-item">
                        <span className="earning-label">Referral:</span>
                        <span className="earning-value">{userData?.verificationStatus === 'approved' ? referralData.referralEarnings : '$0.00'}</span>
                      </div>
                      <div className="earning-item">
                        <span className="earning-label">Daily Return:</span>
                        <span className="earning-value">{dailyReturn}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <button className="logout-btn" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16,17 21,12 16,7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>

            <nav className="navigation">
              <ul className="nav-list">
                {['Overview', 'History', 'Referral', 'Withdraw'].map((tab) => (
                  <li key={tab} className="nav-item">
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`nav-button ${activeTab === tab ? 'active' : ''}`}
                    >
                      <svg className="nav-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {tab === 'Overview' && <><path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/></>}
                        {tab === 'History' && <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></>}
                        {tab === 'Referral' && <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></>}
                        {tab === 'Withdraw' && <><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><line x1="9" y1="9" x2="9" y2="9"/></>}
                      </svg>
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="main-content">
            <div className="header">
              <div className="logo-section">
                <div className="logo">S</div>
                <h1 className="app-title">SEASHELL</h1>
              </div>
              
              <div className="page-info">
                <h2 className="page-title">{activeTab}</h2>
                <p className="page-subtitle">
                  {activeTab === 'Overview' && 'Your investment performance and statistics'}
                  {activeTab === 'History' && 'Check your transaction history'}
                  {activeTab === 'Referral' && 'Invite friends and earn commissions'}
                  {activeTab === 'Withdraw' && 'Manage your withdrawals (Min: $30)'}
                </p>
                {userData?.verificationStatus === 'pending' && (
                  <div className="status-alert pending">
                    ⏳ Account Pending Approval - Some features may be limited
                    <button 
                      onClick={() => {
                        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
                        if (currentUser?.id) {
                          refreshUserData(currentUser.id);
                        }
                      }}
                      className="refresh-btn"
                    >
                      Refresh Status
                    </button>
                  </div>
                )}
                {userData?.verificationStatus === 'approved' && (
                  <div className="status-alert approved">
                    ✅ Account Verified & Active
                  </div>
                )}
                {userData?.verificationStatus === 'rejected' && (
                  <div className="status-alert rejected">
                    ❌ Account Rejected - Contact Support
                  </div>
                )}
              </div>
            </div>

            <div className="content-area">
              {activeTab === 'Overview' && renderOverview()}
              {activeTab === 'History' && renderHistory()}
              {activeTab === 'Referral' && renderReferral()}
              {activeTab === 'Withdraw' && renderWithdraw()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;