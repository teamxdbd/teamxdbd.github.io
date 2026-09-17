/*
# Auto-approve shared BIN entries

1. Changes
- Modified `submit_shared_bin` function to insert new entries with status 'approved' instead of 'pending'.
- This means shared BINs appear instantly in the BIN Finder directory with no manual review step.
- Existing pending entries are also approved so they show up immediately.

2. Security
- RLS policies remain unchanged: anon/authenticated can read approved entries, direct inserts blocked, function is SECURITY DEFINER.
- The validation logic (6-digit BIN only, no full card numbers, no expiry/cvv/vpn/cookie/checkout patterns) is unchanged.
*/

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

  INSERT INTO public.shared_bin_entries (alias, app_name, bin_prefix, country, testing_notes, status)
  VALUES (btrim(p_alias), btrim(p_app_name), p_bin_prefix, btrim(p_country), btrim(p_testing_notes), 'approved')
  RETURNING id INTO v_id;

  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_shared_bin(text, text, text, text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_shared_bin(text, text, text, text, text) TO anon, authenticated;

UPDATE public.shared_bin_entries SET status = 'approved', updated_at = now() WHERE status = 'pending';
