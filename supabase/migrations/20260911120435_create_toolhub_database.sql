/*
# Create ToolHub database foundation

1. New Tables
- `tool_catalog`
  - `slug` (text, primary key): Stable URL-friendly identifier for a tool.
  - `name` (text): Display name shown to visitors.
  - `description` (text): Short explanation of what the tool does.
  - `category` (text): Category identifier used for browsing and filtering.
  - `icon` (text): Lucide icon name used by the interface.
  - `is_active` (boolean): Whether the tool should be presented as available.
  - `created_at` and `updated_at` (timestamptz): Record timestamps.
- `tool_usage_events`
  - `id` (uuid, primary key): Unique event identifier.
  - `tool_slug` (text): Tool used by the visitor, linked to `tool_catalog`.
  - `event_type` (text): Event name such as `opened` or `completed`.
  - `created_at` (timestamptz): Time the event was recorded.

2. Security
- Row-level security is enabled on both tables.
- The public app can read active catalog entries.
- Usage events can be recorded by the public app but cannot be read, changed, or deleted through the browser.
- Catalog changes are blocked through the browser; they are intended to be managed by trusted database access only.

3. Important Notes
- This migration does not add sign-in or user accounts.
- The existing app can continue using its bundled tool definitions while the database is available for future catalog management and analytics.
- No existing data is modified or removed.
*/

CREATE TABLE IF NOT EXISTS public.tool_catalog (
  slug text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  icon text NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tool_usage_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_slug text NOT NULL REFERENCES public.tool_catalog(slug) ON UPDATE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('opened', 'completed')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS tool_catalog_category_idx
  ON public.tool_catalog (category);

CREATE INDEX IF NOT EXISTS tool_catalog_active_idx
  ON public.tool_catalog (is_active);

CREATE INDEX IF NOT EXISTS tool_usage_events_tool_slug_idx
  ON public.tool_usage_events (tool_slug);

CREATE INDEX IF NOT EXISTS tool_usage_events_created_at_idx
  ON public.tool_usage_events (created_at DESC);

ALTER TABLE public.tool_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_usage_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active tools" ON public.tool_catalog;
CREATE POLICY "Public can read active tools"
ON public.tool_catalog FOR SELECT
TO anon, authenticated
USING (is_active = true);

DROP POLICY IF EXISTS "Browser cannot add tools" ON public.tool_catalog;
CREATE POLICY "Browser cannot add tools"
ON public.tool_catalog FOR INSERT
TO anon, authenticated
WITH CHECK (false);

DROP POLICY IF EXISTS "Browser cannot change tools" ON public.tool_catalog;
CREATE POLICY "Browser cannot change tools"
ON public.tool_catalog FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Browser cannot remove tools" ON public.tool_catalog;
CREATE POLICY "Browser cannot remove tools"
ON public.tool_catalog FOR DELETE
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Public can record tool usage" ON public.tool_usage_events;
CREATE POLICY "Public can record tool usage"
ON public.tool_usage_events FOR INSERT
TO anon, authenticated
WITH CHECK (true);

DROP POLICY IF EXISTS "Usage events are not publicly readable" ON public.tool_usage_events;
CREATE POLICY "Usage events are not publicly readable"
ON public.tool_usage_events FOR SELECT
TO anon, authenticated
USING (false);

DROP POLICY IF EXISTS "Usage events cannot be changed" ON public.tool_usage_events;
CREATE POLICY "Usage events cannot be changed"
ON public.tool_usage_events FOR UPDATE
TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS "Usage events cannot be removed" ON public.tool_usage_events;
CREATE POLICY "Usage events cannot be removed"
ON public.tool_usage_events FOR DELETE
TO anon, authenticated
USING (false);
