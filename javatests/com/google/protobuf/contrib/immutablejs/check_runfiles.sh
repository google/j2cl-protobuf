#!/bin/bash

source "${TEST_SRCDIR}/google3/util/shell/gbash/gbash.sh" || exit 1

FAILED=0

for var in "$@"
do
    if [[ -s ${RUNFILES}/google3/${var} || -d ${RUNFILES}/google3/${var} ]]; then
       echo "Checking ${var}: SUCCESS"
    else
       let FAILED=FAILED+1
       echo "Checking ${var}: FAILURE"
    fi
done

exit $FAILED
