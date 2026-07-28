require "net/http"
require "uri"
require "jwt"
require "digest"

class WebhookDeliveryService
  Result = Struct.new(:success, :status_code, :message, keyword_init: true)

  def self.call(webhook_endpoint:, event_type:, payload:)
    new(webhook_endpoint, event_type, payload).call
  end

  def initialize(webhook_endpoint, event_type, payload)
    @webhook_endpoint = webhook_endpoint
    @event_type = event_type
    @payload = payload
  end

  def call
    return safety_result unless UrlValidator.public_url?(@webhook_endpoint.url) || Rails.env.development?

    body = build_body
    token = compute_token(body)

    uri = URI(@webhook_endpoint.url)
    http = Net::HTTP.new(uri.host, uri.port)
    http.use_ssl = uri.scheme == "https"
    http.open_timeout = 10
    http.read_timeout = 10

    request = Net::HTTP::Post.new(uri)
    request["Content-Type"] = "application/json"
    request["X-UpTimer-Signature"] = token
    request.body = body

    response = http.request(request)

    if response.code.to_i.between?(200, 299)
      reset_failures
      Result.new(success: true, status_code: response.code.to_i, message: "Delivered")
    else
      handle_failure
      Result.new(success: false, status_code: response.code.to_i, message: "HTTP #{response.code}")
    end
  rescue StandardError => e
    handle_failure
    Result.new(success: false, status_code: nil, message: e.message)
  end

  private

  def build_body
    {
      event: @event_type,
      timestamp: Time.current.iso8601,
      data: @payload
    }.to_json
  end

  def compute_token(body)
    claims = {
      event: @event_type,
      iat: Time.current.to_i,
      body_sha256: Digest::SHA256.hexdigest(body)
    }
    JWT.encode(claims, @webhook_endpoint.token, "HS256")
  end

  def reset_failures
    @webhook_endpoint.update!(consecutive_failures: 0, last_delivered_at: Time.current)
  end

  def handle_failure
    failures = @webhook_endpoint.consecutive_failures.to_i + 1
    if failures >= 3
      @webhook_endpoint.update!(consecutive_failures: failures, active: false)
    else
      @webhook_endpoint.update!(consecutive_failures: failures)
    end
  end

  def safety_result
    @webhook_endpoint.update!(active: false)
    Result.new(success: false, status_code: nil, message: "Blocked: internal/private URL")
  end
end
