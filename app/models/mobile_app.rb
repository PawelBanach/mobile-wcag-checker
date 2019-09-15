class MobileApp < ApplicationRecord
  has_one_attached :source
  # serialize :accessibility, HashSerializer
end
