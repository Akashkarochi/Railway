/* admin.js — simple admin form handling */
document.addEventListener('DOMContentLoaded', ()=>{
  const bookingsRoot = document.getElementById('adminBookings');
  function renderBookings(){
    const bs = appApi.adminAllBookings();
    if(!bs.length) { bookingsRoot.innerHTML = '<p>No bookings yet</p>'; return; }
    bookingsRoot.innerHTML = bs.map(b=>`
      <div class="card-mini">
        <div><strong>${b.pnr}</strong> — Train:${b.trainId} — ${b.date} — <small>${b.status}</small></div>
        <div><a class="btn small" href="ticket.html?pnr=${b.pnr}">View</a></div>
      </div>
    `).join('');
  }
  renderBookings();

  document.getElementById('addTrainForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const num = document.getElementById('trainNumber').value.trim();
    const name = document.getElementById('trainName').value.trim();
    const route = document.getElementById('trainRoute').value.split(',').map(s=>s.trim()).filter(Boolean);
    const classes = document.getElementById('trainClasses').value.split(',').map(s=>s.trim()).filter(Boolean);
    if(!num || !name || !route.length){ document.getElementById('addTrainMsg').textContent = 'Please fill required fields'; return; }
    appApi.adminAddTrain({ number: num, name, route, classes });
    document.getElementById('addTrainMsg').textContent = 'Train added';
    setTimeout(()=>{ document.getElementById('addTrainMsg').textContent=''; document.getElementById('addTrainForm').reset(); renderBookings(); }, 600);
  });
});
