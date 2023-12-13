# ------------------------------------------------------------------------------
# Environment
# ------------------------------------------------------------------------------
variable "environment" {
  type        = string
  description = "The environment name, defined in envrionments vars."
}
variable "aws_region" {
  default     = "eu-west-2"
  type        = string
  description = "The AWS region for deployment."
}
variable "aws_profile" {
  default     = "development-eu-west-2"
  type        = string
  description = "The AWS profile to use for deployment."
}

# ------------------------------------------------------------------------------
# Docker Container
# ------------------------------------------------------------------------------
variable "docker_registry" {
  type        = string
  description = "The FQDN of the Docker registry."
}

# ------------------------------------------------------------------------------
# Service performance and scaling configs
# ------------------------------------------------------------------------------
variable "desired_task_count" {
  type        = number
  description = "The desired ECS task count for this service"
  default     = 1 # defaulted low for dev environments, override for production
}
variable "required_cpus" {
  type        = number
  description = "The required cpu resource for this service. 1024 here is 1 vCPU"
  default     = 128 # defaulted low for dev environments, override for production
}
variable "required_memory" {
  type        = number
  description = "The required memory for this service"
  default     = 256 # defaulted low for node service in dev environments, override for production
}

# ------------------------------------------------------------------------------
# Service environment variable configs
# ------------------------------------------------------------------------------
variable "log_level" {
  default     = "info"
  type        = string
  description = "The log level for services to use: trace, debug, info or error"
}

variable "account_validator_web_version" {
  type        = string
  description = "The version of the account_validator_web container to run."
}

variable "api_url" {
  type = string
}

variable "account_validator_max_file_size" {
  type = string
}

variable "cdn_host" {
  type = string
}
variable "chs_url" {
  type = string
}

variable "cache_server" {
  type = string
}

variable "cookie_domain" {
  type = string
}

variable "cookie_name" {
  type    = string
  default = "__SID"
}

variable "node_env" {
  type = string
}

variable "tz" {
  type = string
}

variable "account_validator_ui_update_interval" {
  type = string
}

variable "account_validator_ui_update_timeout" {
  type = string
}