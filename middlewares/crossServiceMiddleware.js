const crypto = require("crypto");
const request = require('../utils/crossServiceRequest')

async function getPublicKey(serviceId, keyVersion) {
  const url = `/config/internal/public-keys?serviceName=${serviceId}&version=${keyVersion}`
  const {data} = await request.get(url);
  return data.data.publicKey; // PEM format
}

async function verifyRequest(req, res, next) {

  const serviceId = req.get("X-Service-Id");
  const keyVersion = req.get("X-Key-Version");
  const timestamp = req.get("X-Timestamp");
  const signature = req.get("X-Signature");
  const body = req.body || '';

  if (!serviceId || !keyVersion || !timestamp || !signature) {
    return res.status(400).json({ error: "Missing headers" });
  }

  const publicKey = await getPublicKey(serviceId, keyVersion);
  const toVerify = `${timestamp}\n${serviceId}\n${keyVersion}\n${JSON.stringify(body)}`;

  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(toVerify);
  verifier.end();

  const isValid = verifier.verify(publicKey, signature, "base64");
  if (!isValid) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  // pass
  next();
}

module.exports = verifyRequest;
