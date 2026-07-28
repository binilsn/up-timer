class WebhookEndpointsController < ApplicationController
  layout "dashboard"
  before_action :authenticate
  before_action -> { require_role!(:admin) }

  def index
    @endpoints = WebhookEndpoint.order(created_at: :desc)
    @new_endpoint = WebhookEndpoint.new
  end

  def create
    @endpoint = WebhookEndpoint.new(endpoint_params)
    @endpoint.token = SecureRandom.hex(32)

    if @endpoint.save
      ActionLog.log(action: :created, record: @endpoint, account: current_account,
                    metadata: { url: @endpoint.url })
      flash[:token] = @endpoint.token
      redirect_to webhook_endpoints_path, notice: "Webhook endpoint created. Copy the token now — it won't be shown again."
    else
      @endpoints = WebhookEndpoint.order(created_at: :desc)
      @new_endpoint = @endpoint
      render :index, status: :unprocessable_entity
    end
  end

  def edit
    @endpoint = WebhookEndpoint.find(params[:id])
  end

  def update
    @endpoint = WebhookEndpoint.find(params[:id])
    if @endpoint.update(endpoint_params)
      ActionLog.log(action: :updated, record: @endpoint, account: current_account,
                    metadata: { url: @endpoint.url })
      redirect_to webhook_endpoints_path, notice: "Webhook endpoint updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def toggle
    @endpoint = WebhookEndpoint.find(params[:id])
    @endpoint.toggle!(:active)
    ActionLog.log(action: @endpoint.active? ? :activated : :deactivated,
                  record: @endpoint, account: current_account,
                  metadata: { url: @endpoint.url })
    @endpoints = WebhookEndpoint.order(created_at: :desc)
    render :toggle
  end

  def destroy
    @endpoint = WebhookEndpoint.find(params[:id])
    @endpoint.destroy!
    ActionLog.log(action: :deleted, record: @endpoint, account: current_account,
                  metadata: { url: @endpoint.url })
    redirect_to webhook_endpoints_path, notice: "Webhook endpoint deleted."
  end

  private

  def endpoint_params
    params.require(:webhook_endpoint).permit(:url)
  end
end
