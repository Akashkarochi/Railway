/* auth.js — handles login/signup/otp UI */
document.addEventListener('DOMContentLoaded', ()=>{
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const tabOtp = document.getElementById('tab-otp');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const otpForm = document.getElementById('otpForm');

  function showTab(t){
    tabLogin.classList.remove('active'); tabSignup.classList.remove('active'); tabOtp.classList.remove('active');
    loginForm.classList.add('hidden'); signupForm.classList.add('hidden'); otpForm.classList.add('hidden');
    if(t==='login'){ tabLogin.classList.add('active'); loginForm.classList.remove('hidden'); }
    if(t==='signup'){ tabSignup.classList.add('active'); signupForm.classList.remove('hidden'); }
    if(t==='otp'){ tabOtp.classList.add('active'); otpForm.classList.remove('hidden'); }
  }
  tabLogin.addEventListener('click', ()=>showTab('login'));
  tabSignup.addEventListener('click', ()=>showTab('signup'));
  tabOtp.addEventListener('click', ()=>showTab('otp'));

  showTab('login');

  // Demo login
  document.getElementById('demoLogin').addEventListener('click', ()=>{
    try{
      appApi.login({ idOrPhone:'demo@example.com', password:'demo123' });
      location.href = 'profile.html';
    }catch(e){ alert('Demo login error'); }
  });

  // Login submit
  loginForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const id = document.getElementById('loginId').value.trim();
    const pw = document.getElementById('loginPassword').value.trim();
    try{
      appApi.login({ idOrPhone:id, password:pw });
      location.href = 'profile.html';
    }catch(err){
      document.getElementById('loginMsg').textContent = err.message;
    }
  });

  // Signup
  signupForm.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const phone = document.getElementById('signupPhone').value.trim();
    const pw = document.getElementById('signupPassword').value.trim();
    try{
      appApi.register({ name, email, phone, password: pw });
      document.getElementById('signupMsg').textContent = 'Account created. You can login now.';
      setTimeout(()=>{ showTab('login'); }, 800);
    }catch(err){ document.getElementById('signupMsg').textContent = err.message; }
  });

  // OTP send & verify (mock)
  document.getElementById('sendOtp').addEventListener('click', ()=>{
    const phone = document.getElementById('otpPhone').value.trim();
    if(!phone || phone.length<10){ document.getElementById('otpMsg').textContent='Enter valid phone'; return; }
    document.getElementById('otpSection').classList.remove('hidden'); document.getElementById('otpMsg').textContent = 'OTP sent (mock). Use 1234';
  });
  document.getElementById('verifyOtp').addEventListener('click', ()=>{
    const phone = document.getElementById('otpPhone').value.trim();
    const otp = document.getElementById('otpInput').value.trim();
    try{
      appApi.otpLogin({ phone, otp });
      location.href = 'profile.html';
    }catch(err){ document.getElementById('otpMsg').textContent = err.message; }
  });
});
