class User
  class Airtable < AirpplicationRecord
    self.table_name = "Users"

    field :email, "Email"
    field :first_name, "First Name"
    field :verification_status, "Verification Status"
    field :hackatime_linked, "Hackatime Linked?"
  end
end
