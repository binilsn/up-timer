class WebhookPayloadBuilder
  # Build a consistent JSON payload for webhook delivery.
  #
  # @param event [String] "check_result" or "status_change"
  # @param monitor [UptimeMonitor] the monitor this event relates to
  # @param context [Hash] event-specific data (e.g. status_code, response_time for check_result)
  # @return [Hash] the payload ready for JSON serialization
  def self.build(event:, monitor:, **context)
    {
      event: event,
      timestamp: Time.current.iso8601,
      monitor: {
        id: monitor.id,
        name: monitor.name,
        url: monitor.url,
        status: monitor.status
      },
      data: context
    }
  end
end
