const fetch = require("node-fetch");

async function getAccessToken(access_code, client_id, client_secret) {
    const response = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: access_code,
        client_id: client_id,
        client_secret: client_secret,
      }),
    });
    const data = await response.text();
    const params = new URLSearchParams(data);
    return params.get("access_token");
  }
  
  async function getGithubUser(access_token) {
    const response = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `bearer ${access_token}`,
      },
    });
    const data = await response.json();
    return data;
  }

  module.exports = {
    getAccessToken,
    getGithubUser
  }