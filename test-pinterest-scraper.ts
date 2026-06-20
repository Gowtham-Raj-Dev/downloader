import fs from 'fs';

async function testScrape() {
  const url = 'https://in.pinterest.com/pin/1033224339462719602/';
  try {
    const res = await fetch(url);
    const html = await res.text();
    fs.writeFileSync('pinterest-html.html', html);
    
    const relayMatch = html.match(/<script data-relay-response="true" type="application\/json">([\s\S]*?)<\/script>/g);
    if (relayMatch) {
        console.log('Found relay response scripts:', relayMatch.length);
        let combined = [];
        for (let m of relayMatch) {
           const content = m.replace(/<[^>]+>/g, '');
           combined.push(JSON.parse(content));
        }
        fs.writeFileSync('pinterest-relay.json', JSON.stringify(combined, null, 2));
        console.log('Saved to pinterest-relay.json');
    }
  } catch (err) {
    console.error(err);
  }
}
testScrape();
