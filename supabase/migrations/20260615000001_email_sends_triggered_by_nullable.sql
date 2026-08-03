-- Allow email_sends.triggered_by to be NULL so that automated/cron-triggered
-- emails (e.g. the weekly admin digest) can be recorded without attributing
-- them to a specific admin user.
ALTER TABLE email_sends ALTER COLUMN triggered_by DROP NOT NULL;
