class AddConsecutiveFailuresToWebhookEndpoints < ActiveRecord::Migration[8.1]
  def change
    add_column :webhook_endpoints, :consecutive_failures, :integer, default: 0, null: false
  end
end
