const fs = require('fs')
const axios = require("axios");
const crypto = require("crypto");

class crossServerRequest {
  static instance;

  constructor() {
    if (crossServerRequest.instance) {
      return crossServerRequest.instance;
    }
    const baseURL = 'http://traefik:3000'
    const serviceId = process.env.SERVICE_NAME
    
    this.serviceId = serviceId;
    this.keyVersion = process.env.CROSS_SERVICE_KEY_VERSION;
    this.client = axios.create({
      baseURL,
    });

    this.privateKey = fs.readFileSync(`${__dirname}/../keys/${this.keyVersion}_private.pem`, "utf-8");
    this.client.interceptors.request.use(async (config) => {
      const body = config.data ? JSON.stringify(config.data) : "";
      const timestamp = new Date().toISOString();
      const payload = JSON.stringify(body);
      const toSign = `${timestamp}\n${this.serviceId}\n${this.keyVersion}\n${payload}`;
      
      const signer = crypto.createSign("RSA-SHA256");
      signer.update(toSign);
      signer.end();
      const signature = signer.sign(this.privateKey, "base64");
      
      // add headers
      config.headers["X-Service-Id"] = this.serviceId;
      config.headers["X-Timestamp"] = timestamp;
      config.headers["X-Key-Version"] = this.keyVersion;
      config.headers["X-Signature"] = signature;
      config.headers["Content-Type"] = 'application/json';

      return config;
    });
    crossServerRequest.instance = this;
  }

  get(url, config = {}) {
    return this.client.get(url, config);
  }

  post(url, data, config = {}) {
    return this.client.post(url, data, config);
  }

  put(url, data, config = {}) {
    return this.client.put(url, data, config);
  }

  patch(url, data, config = {}) {
    return this.client.patch(url, data, config);
  }

  delete(url, config = {}) {
    return this.client.delete(url, config);
  }
}

module.exports = new crossServerRequest();
