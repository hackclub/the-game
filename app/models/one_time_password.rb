# == Schema Information
#
# Table name: one_time_passwords
#
#  id         :bigint           not null, primary key
#  email      :string           not null
#  expires_at :datetime
#  secret     :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
class OneTimePassword < ApplicationRecord
  before_validation :generate, on: :create

  validates :secret, :expires_at, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }

  def expired?
    Time.current > expires_at
  end

  def send!
    AuthMailer.with(email: email, otp: secret).otp_email.deliver_later(queue: :realtime)
    true
  end

  def self.valid?(secret, email)
    otps = OneTimePassword.where(email: email, secret: secret)
    valid =  otps.any? { |otp| !otp.expired? }
    otps.each(&:destroy)
    valid
  end

  private

  def generate
    self.secret ||= SecureRandom.random_number(1000000).to_s.rjust(6, "0")
    self.expires_at ||= 15.minutes.from_now
  end
end
