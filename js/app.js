/* app.js — central mock API and helpers */
const DB_KEY = 'rly_demo_db_v1';

/* Seed data (only created if no db present) */
function seedData(){
  const db = {
    users: [{ id:1, name:'Demo User', email:'demo@example.com', phone:'9999999999', password:'demo123' }],
    stations: [
      { code:'NDLS', name:'New Delhi' }, { code:'BCT', name:'Mumbai Central' },
      { code:'LKO', name:'Lucknow' }, { code:'KYN', name:'Kalyan' }
    ],
    trains: [
      { id:101, number:'12951', name:'Rajdhani Express', route:['NDLS','LKO','BCT'], classes:['1A','2A','3A'] },
      { id:102, number:'12001', name:'Shatabdi', route:['NDLS','KYN','BCT'], classes:['CC','EC'] }
    ],
    bookings: []
  };
  localStorage.setItem(DB_KEY, JSON.stringify(db));
  return db;
}
function loadDB(){ const raw = localStorage.getItem(DB_KEY); return raw ? JSON.parse(raw) : seedData(); }
function saveDB(db){ localStorage.setItem(DB_KEY, JSON.stringify(db)); }

/* Small helpers */
function genPNR(){
  return 'PNR' + Date.now().toString(36).toUpperCase().slice(-6) + Math.random().toString(36).slice(2,6).toUpperCase();
}
function currentUser(){ const raw = localStorage.getItem('rly_current_user'); return raw ? JSON.parse(raw) : null; }
function setCurrentUser(user){ localStorage.setItem('rly_current_user', JSON.stringify(user)); }

/* Exposed API for pages */
const appApi = {
  register({name,email,phone,password}){
    const db = loadDB();
    if(db.users.some(u=>u.email===email || u.phone===phone)) throw new Error('User exists');
    const id = Math.max(0,...db.users.map(u=>u.id))+1;
    const u = { id, name, email, phone, password };
    db.users.push(u); saveDB(db); return u;
  },
  login({idOrPhone,password}){
    const db = loadDB();
    const user = db.users.find(u => (u.email===idOrPhone || u.phone===idOrPhone) && u.password===password);
    if(!user) throw new Error('Invalid credentials');
    setCurrentUser({ id:user.id, name:user.name, email:user.email, phone:user.phone });
    return user;
  },
  otpLogin({phone,otp}){
    // OTP mocked: accept 1234
    if(otp !== '1234') throw new Error('Invalid OTP');
    const db = loadDB();
    let user = db.users.find(u=>u.phone===phone);
    if(!user){
      const id = Math.max(0,...db.users.map(u=>u.id))+1;
      user = { id, name:'User'+id, email:`user${id}@example.com`, phone, password:'demo' };
      db.users.push(user); saveDB(db);
    }
    setCurrentUser({ id:user.id, name:user.name, email:user.email, phone:user.phone });
    return user;
  },
  logout(){ localStorage.removeItem('rly_current_user'); },
  getCurrentUser(){ return currentUser(); },
  searchTrains({from,to,date}){ const db = loadDB(); return db.trains.filter(t=>{ const i1=t.route.indexOf(from), i2=t.route.indexOf(to); return i1>=0 && i2>=0 && i1<i2 }).map(t=>({...t, availability: Math.floor(Math.random()*60)+1})); },
  getTrainDetail(trainId){
    const db = loadDB(); const t = db.trains.find(x=>x.id==trainId); if(!t) return null;
    // create mock seats
    const seats = []; for(let i=1;i<=60;i++){ seats.push({ seatNumber:i, berth:['L','M','U'][i%3], status: Math.random()>0.12 ? 'AVAILABLE' : 'BOOKED' }); }
    return { ...t, seats };
  },
  createBooking({userId,trainId,date,from,to,classCode,passengers,paymentStatus}){
    const db = loadDB();
    const pnr = genPNR();
    const assigned = passengers.map((p,i)=>({ seat: i+1, coach:'A1' }));
    const booking = { id: Math.max(-1,...db.bookings.map(b=>b.id))+1, pnr, userId, trainId, date, from, to, classCode, passengers, assignedSeats:assigned, status: paymentStatus==='SUCCESS' ? 'CONFIRMED':'FAILED', createdAt: (new Date()).toISOString() };
    db.bookings.push(booking); saveDB(db); return booking;
  },
  getBookingByPNR(pnr){ return loadDB().bookings.find(b=>b.pnr===pnr); },
  cancelBooking(pnr){ const db = loadDB(); const b = db.bookings.find(x=>x.pnr===pnr); if(!b) throw new Error('PNR not found'); b.status='CANCELLED'; saveDB(db); return b; },
  getUserBookings(userId){ return loadDB().bookings.filter(b=>b.userId===userId); },
  adminAddTrain(train){ const db = loadDB(); train.id = Math.max(0,...db.trains.map(t=>t.id))+1; db.trains.push(train); saveDB(db); return train; },
  adminAllBookings(){ return loadDB().bookings; }
};

/* UI helpers in app pages */
document.addEventListener('DOMContentLoaded', ()=>{
  // update nav login/profile
  const u = appApi.getCurrentUser();
  const navLogin = document.getElementById('nav-login');
  const navProfile = document.getElementById('nav-profile');
  if(u){
    if(navLogin) navLogin.textContent = 'Logout';
    if(navProfile) navProfile.textContent = u.name;
    if(navLogin) navLogin.href = 'javascript:void(0);';
    if(navLogin) navLogin.addEventListener('click', ()=>{ appApi.logout(); location.href='index.html'; });
  } else {
    if(navLogin) navLogin.href = 'login.html';
    if(navProfile) navProfile.href = 'login.html';
  }
});
