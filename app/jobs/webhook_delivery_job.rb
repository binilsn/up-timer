class WebhookDeliveryJob < ApplicationJob
  queue_as :default

  retry_on StandardError, wait: :exponentially_longer, attempts: 3

  def perform(webhook_endpoint_id, event_type, monitor_data)
    webhook_endpoint = WebhookEndpoint.find_by(id: webhook_endpoint_id)
    return unless webhook_endpoint&.active?

    WebhookDeliveryService.call(
      webhook_endpoint: webhook_endpoint,
      event_type: event_type,
      payload: monitor_data
    )
  end
end
