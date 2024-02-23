#!/bin/sh

ENV="$(cat <<EOF
  window.env = {
      REACT_APP_DOMAIN: "$REACT_APP_DOMAIN",
      REACT_APP_SUBSCRIPTION_URL: "$REACT_APP_SUBSCRIPTION_URL",
  }
EOF
)"

echo $ENV > /shq/static/js/env.js

exec "$@"