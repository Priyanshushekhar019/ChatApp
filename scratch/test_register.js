const https = require('https');

const payload = JSON.stringify({
    fullName: "Test User",
    username: "test_user_rand_" + Math.floor(Math.random() * 1000000),
    password: "password123",
    confirmPassword: "password123",
    gender: "male"
});

console.log("Sending payload:", payload);

const options = {
    hostname: 'chatapp-5wdi.onrender.com',
    port: 443,
    path: '/api/v1/user/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
    }
};

const req = https.request(options, (res) => {
    console.log("Response Status:", res.statusCode);
    console.log("Response Headers:", res.headers['content-type']);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log("Response Body:", body);
    });
});

req.on('error', (e) => {
    console.error("Request failed:", e);
});

req.write(payload);
req.end();
