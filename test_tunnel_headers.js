(async () => {
  const res = await fetch('https://rue-cobalt.xenon.zone', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', videoQuality: '720' }) 
  });
  const json = await res.json();
  
  if (json.url) {
    const res1 = await fetch(json.url);
    console.log("Headers:", Array.from(res1.headers.entries()));
  }
})();
