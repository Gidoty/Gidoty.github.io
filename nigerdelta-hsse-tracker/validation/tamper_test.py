#!/usr/bin/env python3
"""Confirm the integrity scheme actually detects tampering, and does not
raise false alarms on fields that are meant to change after submission.

Takes sealed records from validation/synthetic/synthetic_reports.json (run
make_synthetic.py first), applies one tampering scenario at a time to a
fresh copy of each record, and checks that verify_report() flags it. Also
runs the inverse check: legitimate mutable-field changes (NOSDRA
notification, cleanup status) must NOT be flagged, since those fields are
deliberately excluded from the hashed evidence payload.

Standard library only. Writes a summary to
validation/results/tamper_check.json. Run:
    python3 validation/tamper_test.py
"""
import copy
import json
import os

from canonical import verify_report

SYNTHETIC_PATH = os.path.join(os.path.dirname(__file__), 'synthetic', 'synthetic_reports.json')
RESULTS_PATH = os.path.join(os.path.dirname(__file__), 'results', 'tamper_check.json')


def tamper_description(report):
    r = copy.deepcopy(report)
    r['incident']['description'] = r['incident']['description'] + ' TAMPERED'
    return r


def tamper_location_state(report):
    r = copy.deepcopy(report)
    r['location']['state'] = 'Tampered State'
    return r


def tamper_severity(report):
    r = copy.deepcopy(report)
    r['incident']['severity'] = 'minor' if r['incident']['severity'] != 'minor' else 'critical'
    return r


def tamper_photo_byte(report):
    r = copy.deepcopy(report)
    if not r['evidence']['photos']:
        return None
    original = r['evidence']['photos'][0]
    # Flip one base64 character well inside the payload — a single altered
    # byte in the underlying image data, not just a structural change.
    prefix, b64 = original.split(',', 1)
    mid = len(b64) // 2
    flipped_char = 'A' if b64[mid] != 'A' else 'B'
    r['evidence']['photos'][0] = f'{prefix},{b64[:mid]}{flipped_char}{b64[mid + 1:]}'
    return r


def tamper_event_data(report):
    r = copy.deepcopy(report)
    if not r['events']:
        return None
    r['events'][0]['data'] = {**r['events'][0]['data'], 'tampered': True}
    return r


def tamper_event_chain_link(report):
    r = copy.deepcopy(report)
    if len(r['events']) < 2:
        return None
    r['events'][1]['prevEventHash'] = 'deliberately-wrong-hash'
    return r


def legitimate_nosdra_change(report):
    r = copy.deepcopy(report)
    r['regulatory'] = {**r['regulatory'], 'nosdraNotified': True, 'nosdraNotifiedAt': '2026-12-31T00:00:00.000Z'}
    return r


def legitimate_cleanup_change(report):
    r = copy.deepcopy(report)
    r['regulatory'] = {**r['regulatory'], 'cleanupStatus': 'completed'}
    return r


def legitimate_contact_change(report):
    r = copy.deepcopy(report)
    r['contact'] = {**r.get('contact', {}), 'name': 'Changed Name', 'phone': '+2348000000000'}
    return r


TAMPER_SCENARIOS = [
    ('incident_description', tamper_description, True),
    ('location_state', tamper_location_state, True),
    ('incident_severity', tamper_severity, True),
    ('photo_single_byte', tamper_photo_byte, True),
    ('event_data', tamper_event_data, True),
    ('event_chain_link', tamper_event_chain_link, True),
]

LEGITIMATE_SCENARIOS = [
    ('nosdra_notification_change', legitimate_nosdra_change, False),
    ('cleanup_status_change', legitimate_cleanup_change, False),
    ('contact_detail_change', legitimate_contact_change, False),
]


def run_scenario(name, mutate, should_detect, reports):
    attempted = 0
    detected = 0
    skipped = 0
    for report in reports:
        mutated = mutate(report)
        if mutated is None:
            skipped += 1
            continue
        attempted += 1
        result = verify_report(mutated)
        flagged = (result['payloadValid'] is False) or (result['eventChainValid'] is False)
        if flagged == should_detect:
            detected += 1
    return {
        'scenario': name,
        'expectedDetection': should_detect,
        'recordsAttempted': attempted,
        'recordsSkipped': skipped,
        'recordsCorrect': detected,
        'allCorrect': attempted > 0 and detected == attempted,
    }


def main():
    if not os.path.exists(SYNTHETIC_PATH):
        raise SystemExit(
            f'{SYNTHETIC_PATH} not found — run validation/make_synthetic.py first.'
        )
    with open(SYNTHETIC_PATH) as f:
        reports = json.load(f)['reports']

    results = [run_scenario(name, mutate, should_detect, reports) for name, mutate, should_detect in TAMPER_SCENARIOS]
    results += [
        run_scenario(name, mutate, should_detect, reports) for name, mutate, should_detect in LEGITIMATE_SCENARIOS
    ]

    all_passed = all(r['allCorrect'] for r in results)

    os.makedirs(os.path.dirname(RESULTS_PATH), exist_ok=True)
    with open(RESULTS_PATH, 'w') as f:
        json.dump(
            {
                'generatedBy': 'validation/tamper_test.py',
                'sourceRecordCount': len(reports),
                'allScenariosPassed': all_passed,
                'scenarios': results,
            },
            f,
            indent=2,
        )

    print(f'Ran {len(results)} tamper-detection scenarios over {len(reports)} synthetic records.')
    for r in results:
        status = 'PASS' if r['allCorrect'] else 'FAIL'
        print(f"  [{status}] {r['scenario']}: {r['recordsCorrect']}/{r['recordsAttempted']} correct "
              f"(expected detection={r['expectedDetection']}, skipped={r['recordsSkipped']})")
    print(f'Wrote summary to {RESULTS_PATH}')

    if not all_passed:
        raise SystemExit(1)


if __name__ == '__main__':
    main()
