# Webhooks

UpTimer sends real-time status updates to your configured webhook endpoints. Each delivery is signed with a JWT HS256 token so you can verify authenticity.

## Payload Format

Every webhook payload follows this structure:

```json
{
  "event": "check_result",
  "timestamp": "2026-07-27T09:30:00+05:30",
  "monitor": {
    "id": 5,
    "name": "API Health",
    "url": "https://api.example.com/health",
    "status": "up"
  },
  "data": {
    "status": "up",
    "status_code": 200,
    "response_time": 142,
    "checked_at": "2026-07-27T09:30:00+05:30",
    "ssl_valid": true
  }
}
```

### Fields

| Field | Type | Description |
|---|---|---|
| `event` | string | Event type: `check_result` or `status_change` |
| `timestamp` | string | ISO 8601 timestamp of when the event was generated |
| `monitor.id` | integer | Internal monitor ID |
| `monitor.name` | string | Monitor display name |
| `monitor.url` | string | The monitored URL |
| `monitor.status` | string | Current monitor status: `up` or `down` |
| `data` | object | Event-specific payload (see below) |

## Event Types

### `check_result`

Sent after every monitor check. The `data` object contains:

| Field | Type | Description |
|---|---|---|
| `status` | string | `up` or `down` |
| `status_code` | integer | HTTP response code |
| `response_time` | integer | Response time in milliseconds |
| `checked_at` | string | ISO 8601 timestamp of the check |
| `ssl_valid` | boolean | Whether the SSL certificate is valid |

### `status_change`

Sent when a monitor transitions between `up` and `down` (only after the configured down threshold is met). The `data` object contains:

| Field | Type | Description |
|---|---|---|
| `previous_status` | string | Previous status: `up` or `down` |
| `new_status` | string | New status: `up` or `down` |

## Signature Verification

Each webhook request includes an `X-UpTimer-Signature` header containing a JWT HS256 token. You should verify this token to ensure the payload came from UpTimer and wasn't tampered with.

### JWT Claims

| Claim | Description |
|---|---|
| `event` | Event type (matches the payload) |
| `iat` | Issued-at Unix timestamp |
| `body_sha256` | SHA-256 hash of the raw request body |

### Verification Examples

**Ruby**

```ruby
require "jwt"
require "digest"

YOUR_SECRET = "the-token-shown-when-you-created-the-endpoint"

def verify_webhook(request_body, signature_header)
  expected_sha = Digest::SHA256.hexdigest(request_body)
  claims = JWT.decode(signature_header, YOUR_SECRET, true, algorithm: "HS256").first
  claims["body_sha256"] == expected_sha
rescue JWT::DecodeError
  false
end
```

**Python**

```python
import jwt
import hashlib

YOUR_SECRET = "the-token-shown-when-you-created-the-endpoint"

def verify_webhook(request_body, signature_header):
    try:
        claims = jwt.decode(signature_header, YOUR_SECRET, algorithms=["HS256"])
        expected_sha = hashlib.sha256(request_body.encode()).hexdigest()
        return claims["body_sha256"] == expected_sha
    except jwt.InvalidTokenError:
        return False
```

**JavaScript (Node.js)**

```js
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const YOUR_SECRET = "the-token-shown-when-you-created-the-endpoint";

function verifyWebhook(requestBody, signatureHeader) {
  try {
    const claims = jwt.verify(signatureHeader, YOUR_SECRET, { algorithms: ["HS256"] });
    const expectedSha = crypto.createHash("sha256").update(requestBody).digest("hex");
    return claims.body_sha256 === expectedSha;
  } catch {
    return false;
  }
}
```

**cURL (for testing)**

```bash
# 1. Store the raw body
BODY='{"event":"check_result","timestamp":"...","monitor":{...},"data":{...}}'

# 2. Compute SHA-256
BODY_SHA=$(echo -n "$BODY" | sha256sum | cut -d' ' -f1)

# 3. The JWT is computed server-side. To verify manually:
#    Decode the X-UpTimer-Signature header and compare body_sha256
echo "Expected body SHA-256: $BODY_SHA"
```

## Registering a Webhook

1. Go to **Webhooks** in the sidebar (admin only)
2. Enter your endpoint URL and click **Create**
3. Copy the generated token immediately — it will not be shown again
4. Use the token as the HS256 secret for signature verification

## Troubleshooting

| Issue | Likely Cause | Solution |
|---|---|---|
| Signature mismatch | Wrong token or body altered in transit | Verify you're using the correct token. Check that your middleware isn't modifying the raw body before verification. |
| Webhook not firing | Endpoint inactive or event type not assigned | Check the **Webhooks** page — the endpoint must be active. On the node's edit page, ensure the webhook is checked and the desired event types are selected. |
| 3 consecutive failures | Endpoint auto-deactivated | After 3 failed deliveries, the endpoint is deactivated. Fix the endpoint, then toggle it back to active on the **Webhooks** page. |
| JWT decode error | Wrong algorithm or secret | UpTimer uses HS256 only. Ensure you're passing the correct secret and algorithm. |
