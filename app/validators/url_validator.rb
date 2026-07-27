class UrlValidator < ActiveModel::EachValidator
  BLOCKED_HOSTS = %w[localhost 127.0.0.1 0.0.0.0].freeze

  def validate_each(record, attribute, value)
    return if value.blank?

    uri = parse_uri(value)
    return record.errors.add(attribute, "must be a valid HTTP(S) URL") unless uri

    if BLOCKED_HOSTS.include?(uri.host&.downcase)
      record.errors.add(attribute, "cannot point to #{uri.host}")
      return
    end

    if private_address?(uri.host)
      record.errors.add(attribute, "cannot point to internal/private addresses")
    end
  end

  def self.public_url?(url_string)
    uri = URI.parse(url_string)
    return false unless uri.is_a?(URI::HTTP)

    return false if BLOCKED_HOSTS.include?(uri.host&.downcase)

    !private_address?(uri.host)
  rescue URI::InvalidURIError
    false
  end

  private

  def parse_uri(value)
    uri = URI.parse(value)
    uri if uri.is_a?(URI::HTTP)
  rescue URI::InvalidURIError
    nil
  end

  def private_address?(host)
    return true if private_ip?(host)

    addrs = resolve(host)
    addrs.any? { |addr| private_ip?(addr) }
  end

  def private_ip?(addr)
    ip = IPAddr.new(addr)
    ip.loopback? || ip.private? || ip.link_local?
  rescue IPAddr::InvalidAddressError
    false
  end

  def resolve(host)
    Addrinfo.getaddrinfo(host, nil, nil, :STREAM).map(&:ip_address).uniq
  rescue SocketError
    []
  end

  def self.private_address?(host)
    new.send(:private_address?, host)
  end
end
