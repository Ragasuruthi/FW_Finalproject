fetch('http://localhost:5000/api/ai-tutor', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: "Hello tutor!" })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error("Error:", err));
