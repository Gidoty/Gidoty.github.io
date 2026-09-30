#!/usr/bin/env python3
"""Independently verify a report exported from the app's "Export for
Submission" action (src/utils/integrity.js buildSubmissionExport), without
needing Node.js or a browser — for an editor, reviewer, or investigator who
receives an exported .json file and wants to confirm it has not been
altered since the reporter sealed it.

Usage:
    python3 validation/verify_export.py path/to/HSSE-XXXX-export.json

Exits 0 and prints PASS if the payload hash and (if present) the event
chain both recompute correctly; exits 1 and prints FAIL with details
otherwise. Understands both a raw sealed report and the export wrapper
({"record": {...}, ...}) that buildSubmissionExport produces.
"""
import json
import sys

from canonical import verify_report


def load_record(path):
    with open(path) as f:
        data = json.load(f)
    return data['record'] if isinstance(data, dict) and 'record' in data else data


def main():
    if len(sys.argv) != 2:
        print('Usage: python3 validation/verify_export.py <exported-report.json>', file=sys.stderr)
        return 2

    record = load_record(sys.argv[1])
    result = verify_report(record)

    print(f"Reference number : {record.get('referenceNumber', '(unknown)')}")
    print(f"Payload valid    : {result['payloadValid']}")
    print(f"Event chain valid: {result['eventChainValid']}")
    print(f"Details          : {json.dumps(result['details'], indent=2)}")

    if result['payloadValid'] is None:
        print('\nUNVERIFIABLE — legacy record, predates canonical hashing.')
        return 1
    if result['payloadValid'] and result['eventChainValid']:
        print('\nPASS — record matches its stored hash and event chain.')
        return 0

    print('\nFAIL — record does not match its stored hash and/or event chain.')
    return 1


if __name__ == '__main__':
    sys.exit(main())
