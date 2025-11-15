/* payment.js — simulate payment and create booking */
document.addEventListener('DOMContentLoaded', ()=>{
  const pending = JSON.parse(sessionStorage.getItem('pendingBooking') || 'null');
  if(!pending){ document.getElementById('amountTxt').textContent = 'No pending booking'; return; }
  const amount = pending.passengers.length * 300;
  document.getElementById('amountTxt').textContent = `Amount: ₹${amount}`;

  document.getElementById('payNow').addEventListener('click', ()=>{
    document.getElementById('payMsg').textContent = 'Processing payment...';
    setTimeout(()=>{
      const success = Math.random()>0.2; // 80% success
      const booking = appApi.createBooking({...pending, paymentStatus: success ? 'SUCCESS':'FAILURE'});
      sessionStorage.removeItem('pendingBooking');
      document.getElementById('payMsg').textContent = success ? 'Payment successful!' : 'Payment failed (mock).';
      // redirect to ticket view (even if failed, to show status)
      setTimeout(()=> location.href = `ticket.html?pnr=${booking.pnr}`, 800);
    }, 1200);
  });

  document.getElementById('payCancel').addEventListener('click', ()=>{ if(confirm('Cancel payment?')) location.href='booking.html'; });
});
