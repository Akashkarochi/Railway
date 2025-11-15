/* booking.js — handle booking form, passengers, and creating pending booking */
document.addEventListener('DOMContentLoaded', ()=>{
  const params = new URLSearchParams(location.search);
  const trainId = params.get('train');
  const date = params.get('date') || new Date().toISOString().slice(0,10);
  const train = appApi.getTrainDetail(trainId);
  if(!train){ document.getElementById('bookTitle').textContent = 'Train not found'; return; }
  document.getElementById('bookTitle').textContent = `Booking — ${train.number} ${train.name} on ${date}`;

  const classInput = document.getElementById('classInput');
  train.classes.forEach(c=>{
    const opt = document.createElement('option'); opt.value = c; opt.innerText = c; classInput.appendChild(opt);
  });

  const passArea = document.getElementById('passengersArea');
  let passCount = 1;
  function renderPassengers(){
    passArea.innerHTML = '<h4>Passengers</h4>';
    for(let i=0;i<passCount;i++){
      const div = document.createElement('div');
      div.className = 'pblock';
      div.innerHTML = `
        <div class="stack">
          <input class="pname" placeholder="Name" />
          <input class="page" placeholder="Age" />
          <select class="pgen"><option>M</option><option>F</option></select>
        </div>
      `;
      passArea.appendChild(div);
    }
  }
  renderPassengers();
  document.getElementById('addPassenger').addEventListener('click', ()=>{ passCount++; renderPassengers(); });

  document.getElementById('bookingForm').addEventListener('submit', (e)=>{
    e.preventDefault();
    const cls = classInput.value;
    const quota = document.getElementById('quotaInput').value;
    const names = Array.from(document.querySelectorAll('.pname')).map(i=>i.value.trim());
    const ages = Array.from(document.querySelectorAll('.page')).map(i=>i.value.trim());
    const gens = Array.from(document.querySelectorAll('.pgen')).map(i=>i.value);
    const passengers = names.map((n,idx)=>({ name:n||('Passenger'+(idx+1)), age: ages[idx]||'18', gender: gens[idx]||'M' }));
    const user = appApi.getCurrentUser();
    if(!user){ if(confirm('You need to login to continue (mock). Proceed to login?')) location.href='login.html'; return; }
    // store pending booking in session
    sessionStorage.setItem('pendingBooking', JSON.stringify({ userId:user.id, trainId:trainId, date, from:train.route[0], to:train.route[train.route.length-1], classCode:cls, passengers, quota }));
    location.href = 'payment.html';
  });
});
