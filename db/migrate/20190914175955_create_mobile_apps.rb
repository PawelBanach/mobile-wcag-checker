class CreateMobileApps < ActiveRecord::Migration[6.0]
  def change
    create_table :mobile_apps do |t|
      t.string :name
      t.string :status
      t.jsonb :accessibility, default: {}

      t.timestamps
    end
  end
end
