async function test() {
  try {
    const res = await fetch('https://pin.it/59oslgmob');
    const text = await res.text();
    
    // Find all MP4 URLs in the response
    const mp4Match = text.match(/https:\/\/[^\s"'<>]+\.mp4/gi);
    
    // Find all thumbnail URLs (m3u8 or image links as fallback)
    const jpgMatch = text.match(/https:\/\/[^\s"'<>]+\.jpg/gi);
    
    console.log('MP4 matches:', mp4Match ? [...new Set(mp4Match)] : 'None');
    if (jpgMatch) {
       console.log('Sample JPG match:', jpgMatch[0]);
    }
    
    // Let's also look for __PWS_DATA__ JSON
    const pwsDataMatch = text.match(/<script id="__PWS_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (pwsDataMatch) {
      console.log('Found PWS data. Length:', pwsDataMatch[1].length);
      const data = JSON.parse(pwsDataMatch[1]);
      console.log('Parsed PWS DATA properties:', Object.keys(data));
      // Just extract some snippet
      const stringData = JSON.stringify(data);
      const videoMatch = stringData.match(/https:\/\/[^\s"'<>]+\.mp4/gi);
      console.log('MP4 in PWS DATA:', videoMatch ? [...new Set(videoMatch)] : 'None');
      
      const v1200Match = stringData.match(/"v_720P.*?url":"(.*?)"/i);
      console.log('v_720P match:', v1200Match ? v1200Match[1] : 'None');
    }
  } catch(e) {
    console.error(e);
  }
}
test();
