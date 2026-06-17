class DocsController < ApplicationController
  DOCS = %w[
    faq
  ].freeze

  def index
    skip_authorization
    render inertia: "docs/index"
  end

  def show
    skip_authorization
    return redirect_to docs_path unless DOCS.include?(params[:slug])

    render inertia: "docs/#{params[:slug]}"
  end
end
