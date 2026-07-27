class AddLocationJsonbToMonitors < ActiveRecord::Migration[8.1]
  def change
    add_column :monitors, :location, :jsonb, default: {}
  end
end
