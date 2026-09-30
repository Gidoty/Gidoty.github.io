#!/usr/bin/env python3
"""Confirm the integrity scheme actually detects tampering, and does not
raise false alarms on fields that are meant to change after submission.

Takes sealed records from validation/synthetic/synthetic_reports.json (run
make_synthetic.py first, with 2-4 events per record), applies one
tampering scenario at a time to a fresh copy of each record, and checks
that verify_report() flags it via payloadValid, eventChainValid,
statusConsistent, or eventLogComplete. Also runs the inverse check:
legitimate mutable-state changes made through a proper appendEvent() call
must NOT be flagged, while the same changes made by editing
report.regulatory directly — with no corresponding event — now must be
flagged by the statusConsistent check added after PR review (see
docs/MANUSCRIPT_CHANGES.md, Phase 10).

Standard library only. Writes a summary (including each scenario's `n`,
the record count it actually ran against) to
validation/results/tamper_check.json. Run:
    python3 validation/tamper_test.py
"""
import copy
import json
import os
import uuid

from canonical import append_event, verify_report

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


def tamper_event_truncation(report):
    r = copy.deepcopy(report)
    if len(r['events']) < 1:
        return None
    # Drop the last event but leave integrity.eventCount/headEventHash at
    # their pre-truncation values — the remaining chain is still perfectly
    # self-consistent, so only the eventCount/headEventHash cross-check
    # (eventLogComplete) can catch this, not eventChainValid.
    r['events'] = r['events'][:-1]
    return r


def legitimate_nosdra_via_event(report):
    r = copy.deepcopy(report)
    notified_at = '2026-12-31T00:00:00.000Z'
    r = append_event(r, str(uuid.uuid4()), 'nosdra_notified', notified_at, {'notifiedAt': notified_at})
    r['regulatory'] = {**r['regulatory'], 'nosdraNotified': True, 'nosdraNotifiedAt': notified_at}
    return r


def legitimate_nosdra_direct_edit(report):
    r = copy.deepcopy(report)
    r['regulatory'] = {**r['regulatory'], 'nosdraNotified': True, 'nosdraNotifiedAt': '2026-12-31T00:00:00.000Z'}
    return r


def legitimate_cleanup_via_event(report):
    r = copy.deepcopy(report)
    changed_at = '2026-12-31T00:00:00.000Z'
    r = append_event(r, str(uuid.uuid4()), 'cleanup_status_changed', changed_at, {'status': 'completed'})
    r['regulatory'] = {**r['regulatory'], 'cleanupStatus': 'completed'}
    return r


def legitimate_cleanup_direct_edit(report):
    r = copy.deepcopy(report)
    # Pick a status different from whatever the record's own random event
    # sequence already derived, so the direct edit always actually changes
    # something — a record whose events already ended at "completed" would
    # otherwise show no inconsistency to detect.
    current = r['regulatory'].get('cleanupStatus', 'pending')
    new_status = 'completed' if current != 'completed' else 'pending'
    r['regulatory'] = {**r['regulatory'], 'cleanupStatus': new_status}
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
    ('event_truncation', tamper_event_truncation, True),
]

# NOSDRA/cleanup status changes made through a proper appendEvent() call
# must still verify cleanly; the same changes made by editing
# report.regulatory directly, with no corresponding event, must now be
# caught by the statusConsistent check.
LEGITIMATE_SCENARIOS = [
    ('nosdra_via_event', legitimate_nosdra_via_event, False),
    ('nosdra_direct_edit_no_event', legitimate_nosdra_direct_edit, True),
    ('cleanup_via_event', legitimate_cleanup_via_event, False),
    ('cleanup_direct_edit_no_event', legitimate_cleanup_direct_edit, True),
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
        flagged = (
            result['payloadValid'] is False
            or result['eventChainValid'] is False
            or result.get('statusConsistent') is False
            or result.get('eventLogComplete') is False
        )
        if flagged == should_detect:
            detected += 1
    return {
        'scenario': name,
        'expectedDetection': should_detect,
        'n': attempted,
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
