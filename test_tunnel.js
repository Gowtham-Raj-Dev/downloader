(async () => {
  const res = await fetch('https://rue-cobalt.xenon.zone', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', videoQuality: '720' }) 
  });
  const json = await res.json();
  
  if (json.url) {
    const res1 = await fetch(json.url);
    const buf1 = await res1.arrayBuffer();
    console.log("Req 1 buf size:", buf1.byteLength);
    
    const res2 = await fetch(json.url);
    const buf2 = await res2.arrayBuffer();
    console.log("Req 2 buf size:", buf2.byteLength);
  }
})();
