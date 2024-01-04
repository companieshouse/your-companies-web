# Define all hardcoded local variable and local variables looked up from data resources
locals {
  stack_name                = "filing-maintain" # this must match the stack name the service deploys into
  name_prefix               = "${local.stack_name}-${var.environment}"
  service_name              = "your-companies-web"
  container_port            = "3000" # default node port required here until prod docker container is built allowing port change via env var
  docker_repo               = "your-companies-web"
  lb_listener_rule_priority = 20
  lb_listener_paths         = ["/xbrl_validate", "/xbrl_validate/*"]
  healthcheck_path          = "/xbrl_validate/healthcheck" #healthcheck path for account-validator-web
  healthcheck_matcher       = "200"                        # no explicit healthcheck in this service yet, change this when added!

  kms_alias       = "alias/${var.aws_profile}/environment-services-kms"
  service_secrets = jsondecode(data.vault_generic_secret.service_secrets.data_json)

  parameter_store_secrets = {
    "vpc_name"             = local.service_secrets["vpc_name"]
    "chs_api_key"          = local.service_secrets["chs_api_key"]
    "internal_api_url"     = local.service_secrets["internal_api_url"]
    "chs_internal_api_key" = local.service_secrets["chs_internal_api_key"]
    "account_test_url"     = local.service_secrets["account_test_url"]
    "account_url"          = local.service_secrets["account_url"]
    "cookie_secret"        = local.service_secrets["cookie_secret"]
    "oauth2_auth_uri"      = local.service_secrets["oauth2_auth_uri"]
    "oauth2_redirect_uri"  = local.service_secrets["oauth2_redirect_uri"]
    "oauth2_token_uri"     = local.service_secrets["oauth2_token_uri"]
    "oauth2_client_id"     = local.service_secrets["oauth2_client_id"]
    "oauth2_client_secret" = local.service_secrets["oauth2_client_secret"]
    "oauth2_request_key"   = local.service_secrets["oauth2_request_key"]
  }

  vpc_name             = local.service_secrets["vpc_name"]
  chs_api_key          = local.service_secrets["chs_api_key"]
  internal_api_url     = local.service_secrets["internal_api_url"]
  chs_internal_api_key = local.service_secrets["chs_internal_api_key"]
  cdn_host             = local.service_secrets["cdn_host"]
  account_test_url     = local.service_secrets["account_test_url"]
  account_url          = local.service_secrets["account_url"]
  cookie_secret        = local.service_secrets["cookie_secret"]
  oauth2_auth_uri      = local.service_secrets["oauth2_auth_uri"]
  oauth2_redirect_uri  = local.service_secrets["oauth2_redirect_uri"]
  oauth2_token_uri     = local.service_secrets["oauth2_token_uri"]
  oauth2_client_id     = local.service_secrets["oauth2_client_id"]
  oauth2_client_secret = local.service_secrets["oauth2_client_secret"]
  oauth2_request_key   = local.service_secrets["oauth2_request_key"]

  # create a map of secret name => secret arn to pass into ecs service module
  # using the trimprefix function to remove the prefixed path from the secret name
  secrets_arn_map = {
    for sec in data.aws_ssm_parameter.secret :
    trimprefix(sec.name, "/${local.name_prefix}/") => sec.arn
  }

  service_secrets_arn_map = {
    for sec in module.secrets.secrets :
    trimprefix(sec.name, "/${local.service_name}-${var.environment}/") => sec.arn
  }

  task_secrets = [
    { "name" : "ACCOUNT_TEST_URL", "valueFrom" : "${local.service_secrets_arn_map.account_test_url}" },
    { "name" : "ACCOUNT_URL", "valueFrom" : "${local.service_secrets_arn_map.account_url}" },
    { "name" : "CHS_API_KEY", "valueFrom" : "${local.service_secrets_arn_map.chs_api_key}" },
    { "name" : "CHS_INTERNAL_API_KEY", "valueFrom" : "${local.service_secrets_arn_map.chs_internal_api_key}" },
    { "name" : "COOKIE_SECRET", "valueFrom" : "${local.secrets_arn_map.web-oauth2-cookie-secret}" },
    { "name" : "INTERNAL_API_URL", "valueFrom" : "${local.service_secrets_arn_map.internal_api_url}" },
    { "name" : "OAUTH2_AUTH_URI", "valueFrom" : "${local.service_secrets_arn_map.oauth2_auth_uri}" },
    { "name" : "OAUTH2_CLIENT_ID", "valueFrom" : "${local.service_secrets_arn_map.oauth2_client_id}" },
    { "name" : "OAUTH2_CLIENT_SECRET", "valueFrom" : "${local.service_secrets_arn_map.oauth2_client_secret}" },
    { "name" : "OAUTH2_REDIRECT_URI", "valueFrom" : "${local.service_secrets_arn_map.oauth2_token_uri}" },
    { "name" : "OAUTH2_REQUEST_KEY", "valueFrom" : "${local.service_secrets_arn_map.oauth2_request_key}" },
    { "name" : "OAUTH2_TOKEN_URI", "valueFrom" : "${local.service_secrets_arn_map.oauth2_redirect_uri}" },
  ]

  task_environment = [
    { "name" : "ACCOUNT_VALIDATOR_MAX_FILE_SIZE", "value" : "${var.account_validator_max_file_size}" },
    { "name" : "ACCOUNT_VALIDATOR_UI_UPDATE_INTERVAL", "value" : "${var.account_validator_ui_update_interval}" },
    { "name" : "ACCOUNT_VALIDATOR_UI_UPDATE_TIMEOUT", "value" : "${var.account_validator_ui_update_timeout}" },
    { "name" : "ACCOUNT_VALIDATOR_WEB_VERSION", "value" : "${var.account_validator_web_version}" },
    { "name" : "API_URL", "value" : "${var.api_url}" },
    { "name" : "CACHE_SERVER", "value" : "${var.cache_server}" },
    { "name" : "CDN_HOST", "value" : "${var.cdn_host}" },
    { "name" : "CHS_URL", "value" : "${var.chs_url}" },
    { "name" : "COOKIE_DOMAIN", "value" : "${var.cookie_domain}" },
    { "name" : "COOKIE_NAME", "value" : "${var.cookie_name}" },
    { "name" : "LOG_LEVEL", "value" : "${var.log_level}" },
    { "name" : "NODE_ENV", "value" : "${var.node_env}" },
    { "name" : "TZ", "value" : "${var.tz}" }
  ]
}
