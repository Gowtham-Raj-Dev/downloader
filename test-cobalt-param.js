async function test() {
  const url = "https://cobaltapi.kittycat.boo";
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: "https://www.youtube.com/watch?v=aqz-KE-bpKQ", videoQuality: "720" })
    });
    
    if (res.ok) {
      const json = await res.json();
      const tunnelUrl = json.url;
      console.log(`Got tunnel URL: ${tunnelUrl}`);
      
      const modifiedUrl = tunnelUrl + "&_cb=12345";
      console.log(`Testing modified URL: ${modifiedUrl}`);
      
      const getRes = await fetch(modifiedUrl, { method: 'GET', headers: { Range: 'bytes=0-10' }});
      console.log(`Status: ${getRes.status}`);
    }
  } catch(e) {
     console.error(e);
  }
}
test();
