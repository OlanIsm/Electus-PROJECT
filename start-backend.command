#!/bin/sh
cd "$(dirname "$0")" || exit 1
exec npm --prefix electus-app run start:dev
