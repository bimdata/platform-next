#!/bin/bash

set -euo pipefail

js_original_path="/usr/share/nginx/html/assets-original"
js_path="/usr/share/nginx/html/assets"

# Associative var_name => placeholder_value
declare -A vars_to_placeholders=(
    [VUE_APP_BASE_URL]="bimdata.env.VUE_APP_BASE_URL"
    [VUE_APP_IAM_BASE_URL]="bimdata.env.VUE_APP_IAM_BASE_URL"
    [VUE_APP_API_BASE_URL]="bimdata.env.VUE_APP_API_BASE_URL"
    [VUE_APP_BACKEND_BASE_URL]="bimdata.env.VUE_APP_BACKEND_BASE_URL"
    [VUE_APP_OIDC_CLIENT_ID]="bimdata.env.VUE_APP_OIDC_CLIENT_ID"
    [VUE_APP_MAPTILER_TOKEN]="bimdata.env.VUE_APP_MAPTILER_TOKEN"
    [VUE_APP_MAX_UPLOAD_SIZE]="bimdata.env.VUE_APP_MAX_UPLOAD_SIZE"
    [VUE_APP_URL_BIMDATACONNECT]="bimdata.env.VUE_APP_URL_BIMDATACONNECT"
    [VUE_APP_URL_DOCUMENTATION]="bimdata.env.VUE_APP_URL_DOCUMENTATION"
    [VUE_APP_URL_MARKETPLACE]="bimdata.env.VUE_APP_URL_MARKETPLACE"
    [VUE_APP_ARCHIVE_BASE_URL]="bimdata.env.VUE_APP_ARCHIVE_BASE_URL"
    [VUE_APP_URL_OLD_PLATFORM]="bimdata.env.VUE_APP_URL_OLD_PLATFORM"
    [VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS]="bimdata.env.VUE_APP_AUTHORIZED_IDENTITY_PROVIDERS"
    [VUE_APP_SUBSCRIPTION_ENABLED]="bimdata.env.VUE_APP_SUBSCRIPTION_ENABLED"
    [VUE_APP_PADDLE_SANDBOX]="bimdata.env.VUE_APP_PADDLE_SANDBOX"
    [VUE_APP_PADDLE_VENDOR_ID]="bimdata.env.VUE_APP_PADDLE_VENDOR_ID"
    [VUE_APP_FREE_PLAN_STORAGE]="bimdata.env.VUE_APP_FREE_PLAN_STORAGE"
    [VUE_APP_PRO_PLAN_ID]="bimdata.env.VUE_APP_PRO_PLAN_ID"
    [VUE_APP_PRO_PLAN_STORAGE]="bimdata.env.VUE_APP_PRO_PLAN_STORAGE"
    [VUE_APP_DATAPACK_PLAN_ID]="bimdata.env.VUE_APP_DATAPACK_PLAN_ID"
    [VUE_APP_PROJECT_STATUS_LIMIT_NEW]="bimdata.env.VUE_APP_PROJECT_STATUS_LIMIT_NEW"
    [VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE]="bimdata.env.VUE_APP_PROJECT_STATUS_LIMIT_ACTIVE"
    [VUE_APP_USER_IFRAME_PROFILE]="bimdata.env.VUE_APP_USER_IFRAME_PROFILE"
    [VUE_APP_GUIDED_TOUR_ENABLED]="bimdata.env.VUE_APP_GUIDED_TOUR_ENABLED"
)

# Copy the original JS
if [[ -d "${js_path}" ]] ; then
    rm -r "${js_path}"
fi
cp -r "${js_original_path}" "${js_path}"

# For each env variable, if unset, set it to empty string and replace
# the placeholder by the wanted value in the JS files
for var_name in "${!vars_to_placeholders[@]}" ; do
    if [[ -z ${!var_name+x} ]] ; then
        declare ${var_name}=""
    fi
    sed -i "s|${vars_to_placeholders[$var_name]}|\"${!var_name}\"|g" "${js_path}"/*
done
