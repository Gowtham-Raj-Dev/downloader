(async () => {
  const res = await fetch('https://rue-cobalt.xenon.zone', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', videoQuality: '720', alwaysProxy: false }) 
  });
  console.log(res.status, await res.text());
})();
