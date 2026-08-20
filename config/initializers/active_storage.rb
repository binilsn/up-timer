# Use ImageMagick (via the MiniMagick gem) instead of libvips for Active
# Storage image variants.
Rails.application.config.active_storage.variant_processor = :mini_magick
