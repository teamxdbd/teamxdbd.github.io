/*
# Create moderated shared BIN directory

1. New Tables
- `shared_bin_entries`
  - `id` (uuid, primary key): Unique submission identifier.
  - `alias` (text): Public contributor name or alias.
  - `app_name` (text): App or website name associated with the testing entry.
  - `bin_prefix` (text): Exactly six digits identifying a BIN prefix; no full card number is stored.
  - `country` (text): Country or region label supplied by the contributor.
  - `testing_notes` (text): Short, safety-focused notes for legitimate sandbox or educational testing.
  - `status` (text): `pending`, `approved`, or `rejected` moderation state.
  - `created_at` and `updated_at` (timestamptz): Record timestamps.

2. Security Changes
- Row-level security is enabled on `shared_bin_entries`.
- Anonymous visitors can read only approved entries.
- Direct browser inserts, updates, and deletes are blocked.
- A security-definer submission function validates and creates pending entries.
- The function rejects full card-number patterns and operational guidance involving expiry, security codes, VPNs, cookies, or checkout workarounds.

3. Important Notes
- No sign-in is required for submitting a public testing reference.
- Submissions remain hidden from the directory until trusted moderation changes their status.
- Only six-digit BIN prefixes are accepted; payment credentials are never accepted or stored.
*/

CREATE TABLE IF NOT EXISTS public.shared_bin_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alias text NOT NULL CHECK (char_length(alias) BETWEEN 1 AND 80),
  app_name text NOT NULL CHECK (char_length(app_name) BETWEEN 1 AND 120),
  bin_prefix text NOT NULL CHECK (bin_prefix ~ '^[0-9]{6}$'),
  country text NOT NULL CHECK (char_length(country) BETWEEN 1 AND 80),
  testing_notes text NOT NULL CHECK (char_length(testing_notes) BETWEEN 1 AND 500),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS shared_bin_entries_status_created_idx
  ON public.shared_bin_entries (status, created_at DESC);

CREATE INDEX IF NOT EXISTS shared_bin_entries_bin_prefix_idx
  ON public.shared_bin_entries (bin_prefix);

ALTER TABLE public.shared_bin_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read approved BIN entries" ON public.shared_bin_entries;
CREATE POLICY "Public can read approved BIN entries"
ON public.shared_bin_entries FOR SELECT
TO anon, authenticated
USING (status = 'approved');

DROP POLICY IF EXISTS "Public cannot insert BIN entries directly" ON public.shared_bin_entries;
CREATE POLICY "Public cannot insert BIN entries directly"
ON public.shared_bin_entries FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot update BIN entries" ON public.shared_bin_entries;
CREATE POLICY "Public cannot update BIN entries"
ON public.shared_bin_entries FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Public cannot delete BIN entries" ON public.shared_bin_entries;
CREATE POLICY "Public cannot delete BIN entries"
ON public.shared_bin_entries FOR DELETE
TO anon, authenticated
USING (false);

CREATE OR REPLACE FUNCTION public.submit_shared_bin(
  p_alias text,
  p_app_name text,
  p_bin_prefix text,
  p_country text,
  p_testing_notes text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id uuid;
  v_combined text;
BEGIN
  IF p_alias IS NULL OR char_length(btrim(p_alias)) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF p_app_name IS NULL OR char_length(btrim(p_app_name)) NOT BETWEEN 1 AND 120 THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF p_bin_prefix IS NULL OR p_bin_prefix !~ '^[0-9]{6}$' THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF p_country IS NULL OR char_length(btrim(p_country)) NOT BETWEEN 1 AND 80 THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF p_testing_notes IS NULL OR char_length(btrim(p_testing_notes)) NOT BETWEEN 1 AND 500 THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;

  v_combined := lower(concat_ws(' ', p_alias, p_app_name, p_country, p_testing_notes));
  IF v_combined ~ '[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9][ -]?[0-9]' THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;
  IF v_combined ~ '(expiry|expiration|expir|cvv|cvc|security code|vpn|cookie|checkout|zip code|postal code|full card|card number)' THEN
    RAISE EXCEPTION 'Invalid submission';
  END IF;

  INSERT INTO public.shared_bin_entries (alias, app_name, bin_prefix, country, testing_notes)
  VALUES (btrim(p_alias), btrim(p_app_name), p_bin_prefix, btrim(p_country), btrim(p_testing_notes))
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_shared_bin(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_shared_bin(text, text, text, text, text) TO anon, authenticated;
