import React, { useState, useEffect } from 'react';
import Layout from '@theme-original/Layout';
import { NotificationProvider, useNotification } from '@site/src/contexts/NotificationContext';
import Modal from '@site/src/components/Modal';
import Header from '@site/src/components/Header';
import { useAuthApi } from '../../api/auth';
import { SecureTokenManager, validatePassword, sanitizeInput } from '../../utils/security';

function LayoutContent(props) {
  const { showNotification } = useNotification();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: ایمیل، 2: رمز یا کد
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [hasAccount, setHasAccount] = useState(null); // null: هنوز بررسی نشده، true/false: نتیجه
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [codeAccepted, setCodeAccepted] = useState(false); // اگر کد درست بود
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');

  // لیست دانشکده‌ها و خوابگاه‌ها
  const FACULTY_CHOICES = [
    "فیزیک", "صنایع", "کامپیوتر", "برق", "عمران", "مواد", "مهندسی شیمی و نفت", "ریاضی", "هوافضا", "انرژی", "مدیریت و اقتصاد", "شیمی", "مکانیک"
  ];
  const DORMITORY_CHOICES = [
    "احمدی روشن", "طرشت ۲", "طرشت ۳", "خوابگاهی نیستم"
  ];
  const [faculty, setFaculty] = useState("");
  const [dormitory, setDormitory] = useState("خوابگاهی نیستم");
  const [infoError, setInfoError] = useState("");

  const authApi = useAuthApi();

  // مقداردهی اولیه و sync با SecureTokenManager
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = SecureTokenManager.getToken();
      const email = SecureTokenManager.getEmail();
      const role = SecureTokenManager.getRole();
      setIsLoggedIn(Boolean(token));
      setUserEmail(email || '');
      setUserRole(role || '');
    }
    // Handle auth logout event from auth.js
    const handleAuthLogout = () => {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserRole('');
      showNotification('جلسه شما منقضی شده است. به صفحه اصلی هدایت می‌شوید.', 'error');
    };
    
    // Handle auth login event
    const handleAuthLogin = (event) => {
      const { user, email } = event.detail;
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(user?.role || '');
    };
    
    window.addEventListener('auth:logout', handleAuthLogout);
    window.addEventListener('auth:login', handleAuthLogin);
    return () => {
      window.removeEventListener('auth:logout', handleAuthLogout);
      window.removeEventListener('auth:login', handleAuthLogin);
    };
  }, [showNotification]);

  // پاک کردن توکن‌های قدیمی در ابتدا
  useEffect(() => {
    if (authApi.clearOldTokens()) {
      setIsLoggedIn(false);
      setUserEmail('');
      setUserRole('');
      showNotification('توکن قدیمی پاک شد. لطفاً دوباره وارد شوید.', 'info');
    }
  }, [authApi, showNotification]);

  // تایمر بررسی اعتبار توکن (هر 2 دقیقه)
  useEffect(() => {
    if (!isLoggedIn) {
      return; // اگر لاگین نیست، نیازی به بررسی نیست
    }

    const checkTokenValidity = () => {
      const token = SecureTokenManager.getToken();
      if (!token) {
        return;
      }
      
      // بررسی انقضای توکن
      if (authApi.isTokenExpired && authApi.isTokenExpired(token)) {
        // پاک کردن اطلاعات کاربر و خروج
        SecureTokenManager.clearAuth();
        setIsLoggedIn(false);
        setUserEmail('');
        setUserRole('');
        showNotification('جلسه شما منقضی شده است. شما به صفحه اصلی هدایت می‌شوید.', 'error');
        // هدایت به صفحه اصلی
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
        return;
      }

      // بررسی نزدیک بودن به انقضا (30 دقیقه قبل)
      if (authApi.isTokenExpiringSoon && authApi.isTokenExpiringSoon(token, 30)) {
        showNotification('جلسه شما به زودی منقضی می‌شود. لطفاً دوباره وارد شوید.', 'warning');
      }
    };

    // بررسی اولیه
    checkTokenValidity();

    // تنظیم تایمر برای بررسی هر 2 دقیقه (120000 میلی‌ثانیه)
    const interval = setInterval(checkTokenValidity, 2 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isLoggedIn, authApi, showNotification]);

  // گوش دادن به رویداد انقضای نزدیک توکن
  useEffect(() => {
    const handleTokenExpiringSoon = () => {
      showNotification('جلسه شما به زودی منقضی می‌شود. لطفاً دوباره وارد شوید.', 'warning');
    };

    window.addEventListener('token:expiring-soon', handleTokenExpiringSoon);
    return () => window.removeEventListener('token:expiring-soon', handleTokenExpiringSoon);
  }, [showNotification]);

  const handleEmailSubmit = async e => {
    e.preventDefault();
    const value = email.trim();
    if (!/^[^@\s]+@sharif\.edu$/.test(value)) {
      setEmailError('ایمیل باید با @sharif.edu تمام شود.');
      return;
    }
    setEmailError('');
    setLoading(true);
    try {
      const exists = await authApi.checkEmailExists(value);
      setHasAccount(exists);
      if (exists) {
        setStep(2); // فرم رمز عبور
      } else {
        const sent = await authApi.sendVerificationCode(value);
        if (sent) {
          setStep(2); // فرم کد ۶ رقمی
        } else {
          setEmailError('ارسال کد تایید با خطا مواجه شد.');
        }
      }
    } catch (err) {
      setEmailError('خطا: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async e => {
    e.preventDefault();
    if (!/^[0-9]{6}$/.test(code)) {
      setCodeError('کد باید ۶ رقم باشد.');
      return;
    }
    setCodeError('');
    setLoading(true);
    try {
      const valid = await authApi.verifyCode(email, code);
      if (valid) {
        setCodeAccepted(true);
      } else {
        setCodeError('کد وارد شده صحیح نیست.');
      }
    } catch (err) {
      setCodeError('خطا: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors.join(' '));
      return;
    }
    if (password !== password2) {
      setPasswordError('رمز عبور و تکرار آن یکسان نیستند.');
      return;
    }
    setPasswordError('');
    setLoading(true);
    try {
      const res = await authApi.register(email, password);
      if (res.success) {
        showNotification('ثبت‌نام با موفقیت انجام شد!', 'success');
        handleClose();
      } else {
        setPasswordError('ثبت‌نام با خطا مواجه شد.');
      }
    } catch (err) {
      setPasswordError('خطا: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors.join(' '));
      return;
    }
    setPasswordError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      
              // Security: Removed debug logging to prevent sensitive data exposure
      
      if (res && res.token) {
        SecureTokenManager.setToken(res.token);
        SecureTokenManager.setRole(res.user?.role || '');
        SecureTokenManager.setEmail(email);
        // Store additional user info in localStorage for now
        localStorage.setItem('auth_email', email);
        localStorage.setItem('faculty', res.user?.faculty || '');
        localStorage.setItem('dormitory', res.user?.dormitory || '');
        
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserRole(res.user?.role || '');
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('auth:login', {
          detail: { user: res.user, email: email }
        }));
        
        showNotification('ورود موفقیت‌آمیز بود!', 'success');
        handleClose();
      } else {
        setPasswordError('ایمیل یا رمز عبور اشتباه است.');
      }
    } catch (err) {
              // Security: Removed debug error logging to prevent sensitive data exposure
      setPasswordError('خطا: ' + (err?.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setStep(1);
    setEmail('');
    setEmailError('');
    setHasAccount(null);
    setCode('');
    setCodeError('');
    setCodeAccepted(false);
    setPassword('');
    setPassword2('');
    setPasswordError('');
    setLoading(false);
  };

  // تابع خروج
  const handleLogout = () => {
    SecureTokenManager.clearAuth();
    setIsLoggedIn(false);
    setUserEmail('');
    setUserRole('');
    
    // انتقال به صفحه اصلی
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };



  // تابع بررسی دسترسی ادمین
  const hasAdminAccess = () => {
    return userRole === 'superadmin' || userRole === 'head' || userRole === 'center_member';
  };



  return (
    <Layout {...props}>
      {/* Header جدید */}
      <Header
        isLoggedIn={isLoggedIn}
        userEmail={userEmail}
        userRole={userRole}
        onLoginClick={() => {
          setModalOpen(true);
          setStep(1);
          setEmail('');
          setEmailError('');
          setHasAccount(null);
          setCode('');
          setCodeError('');
          setCodeAccepted(false);
          setPassword('');
          setPassword2('');
          setPasswordError('');
          setLoading(false);
        }}
        onLogout={handleLogout}
      />

      {/* BG overlays start */}
      <div
        className="home-bg-logo"
        aria-hidden="true"
      />
      {/* BG overlays end */}

      {/* کل محتوا میاد روی پس‌زمینه */}
      <div className="layout-content-wrapper"> 
        {props.children}
      </div>
      {/* Modal ورود/ثبت‌نام */}
      <Modal open={modalOpen} onClose={handleClose}>
        <h2 className="auth-modal-title">ورود / ثبت‌نام</h2>
        {step === 1 && (
          <form className="auth-form" onSubmit={handleEmailSubmit}>
            <label className="auth-form-label">ایمیل دانشگاه شریف:</label>
            <input 
              type="email" 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="yourname@sharif.edu" 
              className="auth-form-input"
              dir="ltr"
              required 
              pattern="^[^@\s]+@sharif\.edu$" 
              disabled={loading} 
            />
            {emailError && <div className="auth-form-error">{emailError}</div>}
            <button type="submit" className="auth-form-button" disabled={loading}>
              {loading ? '...' : 'ادامه'}
            </button>
          </form>
        )}
        {step === 2 && hasAccount === true && (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <label className="auth-form-label">رمز عبور:</label>
            <input 
              type="password" 
              value={password} 
              dir="ltr"
              onChange={e=>setPassword(e.target.value)} 
              placeholder="رمز عبور" 
              className="auth-form-input"
              required 
              disabled={loading} 
            />
            {passwordError && <div className="auth-form-error">{passwordError}</div>}
            <button type="submit" className="auth-form-button" disabled={loading}>
              {loading ? '...' : 'ورود'}
            </button>
          </form>
        )}
        {step === 2 && hasAccount === false && !codeAccepted && (
          <form className="auth-form" onSubmit={handleCodeSubmit}>
            <label className="auth-form-label">کد ۶ رقمی ارسال‌شده به ایمیل:</label>
            <input 
              type="text" 
              maxLength={6} 
              pattern="[0-9]{6}" 
              value={code} 
              dir="ltr"
              onChange={e=>setCode(e.target.value)} 
              placeholder="کد تایید" 
              className="auth-form-input auth-form-input-code"
              required 
              disabled={loading} 
            />
            {codeError && <div className="auth-form-error">{codeError}</div>}
            <button type="submit" className="auth-form-button" disabled={loading}>
              {loading ? '...' : 'تایید کد'}
            </button>
          </form>
        )}
        {step === 2 && hasAccount === false && codeAccepted && (
          <form className="auth-form" onSubmit={e => {
            e.preventDefault();
            if (!faculty) {
              setInfoError("لطفاً دانشکده را انتخاب کنید.");
              return;
            }
            setInfoError("");
            setStep(3); // برو به فرم رمز عبور
          }}>
            <label className="auth-form-label">دانشکده:</label>
            <select className="auth-form-input" value={faculty} onChange={e => setFaculty(e.target.value)} required>
              <option value="">انتخاب کنید...</option>
              {FACULTY_CHOICES.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <label className="auth-form-label">خوابگاه:</label>
            <select className="auth-form-input" value={dormitory} onChange={e => setDormitory(e.target.value)} required>
              {DORMITORY_CHOICES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            {infoError && <div className="auth-form-error">{infoError}</div>}
            <button type="submit" className="auth-form-button">ادامه</button>
          </form>
        )}
        {step === 3 && hasAccount === false && codeAccepted && (
          <form className="auth-form" onSubmit={async e => {
            e.preventDefault();
            if (password.length < 6) {
              setPasswordError('رمز عبور باید حداقل ۶ کاراکتر باشد.');
              return;
            }
            if (password !== password2) {
              setPasswordError('رمز عبور و تکرار آن یکسان نیستند.');
              return;
            }
            setPasswordError('');
            setLoading(true);
            try {
              const res = await authApi.register(email, password, faculty, dormitory);
              if (res.success) {
                showNotification('ثبت‌نام با موفقیت انجام شد!', 'success');
                handleClose();
              } else {
                setPasswordError('ثبت‌نام با خطا مواجه شد.');
              }
            } catch (err) {
              setPasswordError('خطا: ' + (err?.message || err));
            } finally {
              setLoading(false);
            }
          }}>
            <label className="auth-form-label">رمز عبور:</label>
            <input
              type="password"
              value={password}
              dir="ltr"
              onChange={e => setPassword(e.target.value)}
              placeholder="رمز عبور"
              className="auth-form-input"
              required
            />
            <label className="auth-form-label">تکرار رمز عبور:</label>
            <input
              type="password"
              value={password2}
              dir="ltr"
              onChange={e => setPassword2(e.target.value)}
              placeholder="تکرار رمز عبور"
              className="auth-form-input"
              required
            />
            {passwordError && <div className="auth-form-error">{passwordError}</div>}
            <button type="submit" className="auth-form-button" disabled={loading}>
              {loading ? '...' : 'ثبت‌نام'}
            </button>
          </form>
        )}
      </Modal>
    </Layout>
  );
}

export default function LayoutWrapper(props) {
  return (
    <NotificationProvider>
      <LayoutContent {...props} />
    </NotificationProvider>
  );
}
