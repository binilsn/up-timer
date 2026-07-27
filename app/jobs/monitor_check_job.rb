class MonitorCheckJob < ApplicationJob
  queue_as :default

  def perform(monitor_id)
    monitor = UptimeMonitor.find_by(id: monitor_id)
    return unless monitor
    return if monitor.paused?

    result = MonitorCheckService.call(monitor)
    status = result.up ? "up" : "down"

    monitor.monitor_checks.create!(
      status: status,
      response_time: result.duration,
      status_code: result.code,
      checked_at: Time.current,
      ssl_valid: result.ssl_valid,
      ssl_expires_at: result.ssl_expires_at,
      ssl_issuer: result.ssl_issuer,
      ssl_subject: result.ssl_subject
    )

    MonitorStatusService.call(monitor)

    enqueue_webhook_deliveries(monitor, status, result)
  end

  private

  def enqueue_webhook_deliveries(monitor, status, result)
    payload = WebhookPayloadBuilder.build(
      event: "check_result",
      monitor: monitor,
      status: status,
      status_code: result.code,
      response_time: result.duration,
      checked_at: Time.current.iso8601,
      ssl_valid: result.ssl_valid
    )

    monitor.webhook_endpoints.active.each do |endpoint|
      next unless endpoint.webhook_endpoint_monitors
                           .find_by(monitor_id: monitor.id)
                           &.sends_event?("check_result")

      WebhookDeliveryJob.perform_later(endpoint.id, "check_result", payload)
    end
  end
end
