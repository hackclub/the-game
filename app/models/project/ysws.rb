class Project
  class Ysws < AirpplicationRecord
    self.table_name = "YSWS Project Submission"

    field :project_id
    field :review_id

    field :first_name, "First Name"
    field :last_name, "Last Name"
    field :email, "Email"
    field :github_username, "GitHub Username"
    field :address_line1, "Address (Line 1)"
    field :address_line2, "Address (Line 2)"
    field :address_city, "City"
    field :address_state, "State / Province"
    field :address_country, "Country"
    field :address_postal, "ZIP / Postal Code"
    field :birthday, "Birthday"

    field :name, "Name"
    field :description, "Description"
    field :hours, "Optional - Override Hours Spent"
    field :review_reason, "Optional - Override Hours Spent Justification"
    field :code_url, "Code URL"
    field :playable_url, "Playable URL"

    def attach_screenshot(file)
      data = Base64.encode64(file.download)
      AirtableService.new.attach(record_id: self.id, field_name: "fldTmg0Sr938GEqjg", type: file.content_type, data:, name: file.filename.sanitized)
    end
  end
end
