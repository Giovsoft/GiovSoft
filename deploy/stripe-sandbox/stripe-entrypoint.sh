#!/bin/sh
case "$STRIPE_API_KEY" in
  sk_test_*|rk_test_*) exec stripe "$@" ;;
  *) echo 'Stripe listener requires a test key; refusing to start.' >&2; exit 1 ;;
esac
