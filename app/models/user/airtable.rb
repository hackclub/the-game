class User
  class Airtable < AirpplicationRecord
    self.table_name = "Users"

    field :email, "Email"
    field :first_name, "First Name"
    field :address_line1, "Address (Line 1)"
    field :address_city, "City"
    field :address_state, "State / Province"
    field :address_country, "Country"
    field :address_postal, "ZIP / Postal Code"
    field :verification_status, "Verification Status"
    field :hackatime_linked, "Hackatime Linked?"
    field :first_project_created_at, "Loops - hctgFirstProjectCreatedAt"
    field :first_project_ship_at, "Loops - hctgFirstProjectShipAt"
    field :hours_logged, "Hours Logged"
  end
end
