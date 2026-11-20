-- ==============================================================================
-- CivicFix / CivicSense - Complete Supabase Full-Stack Database Schema & Seed
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PROFILES TABLE (Extends auth.users with Citizen/Official metadata & Karma)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'citizen' CHECK (role IN ('citizen', 'admin')),
  department TEXT,
  phone TEXT,
  ward TEXT DEFAULT 'Central Bengaluru',
  karma_points INTEGER DEFAULT 100,
  badges JSONB DEFAULT '["ward_watchdog", "community_champion"]'::jsonb,
  reports_count INTEGER DEFAULT 0,
  endorsements_count INTEGER DEFAULT 0,
  verifications_count INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure newly added columns exist if table was already created
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '["ward_watchdog", "community_champion"]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reports_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS endorsements_count INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS verifications_count INTEGER DEFAULT 0;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. GRIEVANCES / ISSUES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.issues (
  id TEXT PRIMARY KEY,
  ticket_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  urgency TEXT NOT NULL DEFAULT 'Medium',
  status TEXT NOT NULL DEFAULT 'Submitted',
  location JSONB NOT NULL DEFAULT '{}'::jsonb,
  media_url TEXT,
  before_photo_url TEXT,
  after_photo_url TEXT DEFAULT '',
  department TEXT DEFAULT 'BBMP Road Infrastructure',
  assigned_team JSONB,
  eta TEXT DEFAULT 'Awaiting triage',
  upvotes INTEGER DEFAULT 1,
  reporter JSONB NOT NULL DEFAULT '{}'::jsonb,
  timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  comments JSONB NOT NULL DEFAULT '[]'::jsonb,
  triage_metadata JSONB DEFAULT '{}'::jsonb,
  feedback JSONB,
  reported_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.issues ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Issues are viewable by everyone" ON public.issues;
CREATE POLICY "Issues are viewable by everyone" 
  ON public.issues FOR SELECT USING (true);

DROP POLICY IF EXISTS "Issues can be inserted by anyone" ON public.issues;
CREATE POLICY "Issues can be inserted by anyone" 
  ON public.issues FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Issues can be updated by anyone" ON public.issues;
CREATE POLICY "Issues can be updated by anyone" 
  ON public.issues FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Issues can be deleted by anyone" ON public.issues;
CREATE POLICY "Issues can be deleted by anyone" 
  ON public.issues FOR DELETE USING (true);

CREATE INDEX IF NOT EXISTS idx_issues_status ON public.issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_department ON public.issues(department);
CREATE INDEX IF NOT EXISTS idx_issues_urgency ON public.issues(urgency);
CREATE INDEX IF NOT EXISTS idx_issues_reported_at ON public.issues(reported_at DESC);

-- ------------------------------------------------------------------------------
-- 3. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  timestamp TEXT,
  type TEXT DEFAULT 'info',
  ticket_id TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Notifications are viewable by everyone" ON public.notifications;
CREATE POLICY "Notifications are viewable by everyone" 
  ON public.notifications FOR SELECT USING (true);

DROP POLICY IF EXISTS "Notifications can be inserted" ON public.notifications;
CREATE POLICY "Notifications can be inserted" 
  ON public.notifications FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Notifications can be updated" ON public.notifications;
CREATE POLICY "Notifications can be updated" 
  ON public.notifications FOR UPDATE USING (true);

-- ------------------------------------------------------------------------------
-- 4. WARDS CONFIGURATION TABLE (Bengaluru Wards & SLAs)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.wards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  zone TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  sla_hours_avg INTEGER NOT NULL DEFAULT 24,
  lead_engineer TEXT,
  ward_office TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Wards are viewable by everyone" ON public.wards;
CREATE POLICY "Wards are viewable by everyone" 
  ON public.wards FOR SELECT USING (true);

DROP POLICY IF EXISTS "Wards can be modified by admins" ON public.wards;
CREATE POLICY "Wards can be modified by admins" 
  ON public.wards FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 5. DISPATCH TEAMS TABLE (Municipal Response Squads)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.dispatch_teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  lead TEXT NOT NULL,
  phone TEXT NOT NULL,
  dept TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.dispatch_teams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Dispatch teams are viewable by everyone" ON public.dispatch_teams;
CREATE POLICY "Dispatch teams are viewable by everyone" 
  ON public.dispatch_teams FOR SELECT USING (true);

DROP POLICY IF EXISTS "Dispatch teams can be modified" ON public.dispatch_teams;
CREATE POLICY "Dispatch teams can be modified" 
  ON public.dispatch_teams FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 6. APP CONFIG & TAXONOMY TABLE (Categories, Urgencies, Departments, Preset Images)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_config (
  key TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App config is viewable by everyone" ON public.app_config;
CREATE POLICY "App config is viewable by everyone" 
  ON public.app_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "App config can be updated" ON public.app_config;
CREATE POLICY "App config can be updated" 
  ON public.app_config FOR ALL USING (true);

-- ------------------------------------------------------------------------------
-- 7. TRIGGER: AUTO-CREATE PROFILE ON USER SIGNUP
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    department,
    phone,
    ward,
    karma_points,
    badges,
    reports_count,
    endorsements_count,
    verifications_count
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'citizen'),
    NEW.raw_user_meta_data->>'department',
    NEW.raw_user_meta_data->>'phone',
    COALESCE(NEW.raw_user_meta_data->>'ward', 'Central Bengaluru'),
    COALESCE((NEW.raw_user_meta_data->>'karma_points')::integer, 100),
    '["ward_watchdog", "community_champion"]'::jsonb,
    0,
    0,
    0
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department = EXCLUDED.department,
    phone = EXCLUDED.phone,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 8. REALTIME REPLICATION (Safe Idempotent Activation)
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.issues;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.wards;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.app_config;
  EXCEPTION WHEN duplicate_object THEN NULL; WHEN undefined_object THEN NULL;
  END;
END $$;

-- ==============================================================================
-- 9. SEED DATABASE DATA (Replaces All Hardcoded Application Data)
-- ==============================================================================

-- A. Seed App Configuration
INSERT INTO public.app_config (key, data, description) VALUES
  ('categories', '["Infrastructure","Sanitation","Electrical","Water & Drainage","Public Safety","Parks & Recreation"]'::jsonb, 'Municipal Grievance Categories'),
  ('urgencies', '["Low","Medium","High","Emergency"]'::jsonb, 'Urgency Severity Tiers'),
  ('statuses', '["Submitted","Under Review","Assigned","In Progress","Resolved"]'::jsonb, 'Grievance Workflow Lifecycle Statuses'),
  ('departments', '["BBMP Road Infrastructure","BBMP Solid Waste Management (SWM)","BWSSB (Water Supply & Sewerage)","BESCOM (Electricity Supply & Streetlights)","Bengaluru Traffic Police & Road Safety","BBMP Horticulture & Parks","BBMP Forest Cell & Tree Maintenance"]'::jsonb, 'Bengaluru Civic & Infrastructure Departments'),
  ('sample_preset_images', '[{"label":"Pothole / Road Damage","category":"Infrastructure","url":"https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80"},{"label":"Water Main Leak","category":"Water & Drainage","url":"https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=800&q=80"},{"label":"Overflowing Garbage","category":"Sanitation","url":"https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80"},{"label":"Damaged Streetlight","category":"Electrical","url":"https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80"},{"label":"Broken Park Equipment","category":"Parks & Recreation","url":"https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=800&q=80"}]'::jsonb, 'Sample preset camera captures for quick reporting')
ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();

-- B. Seed Wards
INSERT INTO public.wards (id, name, zone, neighborhood, sla_hours_avg, lead_engineer, ward_office) VALUES
  ('ward-151', 'Ward 151: Koramangala', 'South Zone', 'Koramangala', 18, 'AEE Suresh Gowda', '80 Feet Road, 5th Block'),
  ('ward-174', 'Ward 174: HSR Layout', 'Bommanahalli Zone', 'HSR Layout', 22, 'AEE Venkatesh Murthy', '27th Main Road, Sector 1'),
  ('ward-134', 'Ward 134: Jayanagar', 'South Zone', 'Jayanagar', 16, 'AEE Ramesh Kumar', '10th Main, 3rd Block'),
  ('ward-85', 'Ward 85: Indiranagar', 'East Zone', 'Indiranagar', 26, 'AEE Radhakrishna', '100 Feet Road, HAL 2nd Stage'),
  ('ward-45', 'Ward 45: Malleshwaram', 'West Zone', 'Malleshwaram', 20, 'AEE S. Narayana', 'Sampige Road, 8th Cross'),
  ('ward-83', 'Ward 83: Whitefield / ITPL', 'Mahadevapura Zone', 'Whitefield', 34, 'AEE Manjunath B.', 'ITPL Main Road, Hope Farm'),
  ('ward-160', 'Ward 160: Outer Ring Road', 'Mahadevapura Zone', 'Outer Ring Road', 30, 'AEE Anand Rao', 'Bellandur EcoSpace Junction')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  zone = EXCLUDED.zone,
  neighborhood = EXCLUDED.neighborhood,
  sla_hours_avg = EXCLUDED.sla_hours_avg,
  lead_engineer = EXCLUDED.lead_engineer,
  ward_office = EXCLUDED.ward_office;

-- C. Seed Dispatch Teams
INSERT INTO public.dispatch_teams (id, name, lead, phone, dept) VALUES
  ('team-bbmp-151', 'BBMP Ward 151 Road Repair Crew', 'AEE Suresh Gowda', '+91 98450 49921', 'BBMP Road Infrastructure'),
  ('team-bbmp-swm', 'BBMP SWM Auto Tipper & Sanitation Squad', 'Inspector Ravi Shankar', '+91 94480 71200', 'BBMP Solid Waste Management (SWM)'),
  ('team-bwssb-pipe', 'BWSSB Cauvery Pipe & Jetting Unit', 'Engineer Ramesh Kumar', '+91 99001 38819', 'BWSSB (Water Supply & Sewerage)'),
  ('team-bescom-qrv', 'BESCOM Quick Response Vehicle (QRV)', 'Lineman Manjunath B.', '+91 98860 94432', 'BESCOM (Electricity Supply & Streetlights)')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  lead = EXCLUDED.lead,
  phone = EXCLUDED.phone,
  dept = EXCLUDED.dept;

-- D. Seed Notifications
INSERT INTO public.notifications (id, title, message, timestamp, type, read, ticket_id) VALUES
  ('notif-1', 'Emergency Alert Dispatched', 'Live wire reported on ITPL Main Road near Hope Farm, Whitefield (#CIVIC-8519). BESCOM emergency lineman dispatched.', '10 mins ago', 'high_priority', false, '#CIVIC-8519'),
  ('notif-2', 'Road Repair In Progress', 'BBMP Ward 151 Road Repair Crew has started patch work on 80 Feet Road, Koramangala (#CIVIC-8492).', '45 mins ago', 'status_update', false, '#CIVIC-8492'),
  ('notif-3', 'Resolution Confirmed', 'Garbage blackspot on 27th Main, HSR Layout (#CIVIC-8340) verified cleared by resident Priya Patel.', 'Yesterday', 'community', true, '#CIVIC-8340')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  message = EXCLUDED.message,
  timestamp = EXCLUDED.timestamp,
  type = EXCLUDED.type,
  read = EXCLUDED.read;

-- E. Seed Initial Bengaluru Grievance Issues
INSERT INTO public.issues (
  id, ticket_id, title, description, category, urgency, status,
  location, media_url, before_photo_url, after_photo_url,
  department, assigned_team, eta, upvotes, reporter,
  timeline, comments, triage_metadata, reported_at, updated_at
) VALUES
  (
    'issue-1',
    '#CIVIC-8492',
    'Deep Crater Pothole Damaging Car Suspensions & Two-Wheelers',
    'Substantial pothole near Sony World signal on 80 Feet Road. Multiple two-wheeler riders and auto rickshaws have suffered wheel rim damage and near-falls. Exposed gravel and broken asphalt aggregate.',
    'Infrastructure',
    'High',
    'In Progress',
    '{"lat":12.9352,"lng":77.6245,"address":"80 Feet Road, 5th Block, Koramangala","neighborhood":"Koramangala","landmark":"Near Sony World Signal Junction"}'::jsonb,
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=900&q=80',
    '',
    'BBMP Road Infrastructure',
    '{"name":"BBMP Ward 151 Road Repair Crew","leadWorker":"AEE Suresh Gowda","contactNumber":"+91 98450 49921"}'::jsonb,
    'Today by 4:00 PM',
    47,
    '{"name":"Rahul Sharma","contact":"rahul.sharma@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t1-1","status":"Submitted","timestamp":"2026-10-01T09:30:00Z","title":"Issue Reported by Citizen","description":"Citizen logged pothole report with photos and GPS pin in Koramangala.","actor":"Rahul Sharma","role":"Citizen"},{"id":"t1-2","status":"Under Review","timestamp":"2026-10-01T11:00:00Z","title":"BBMP Triage Inspection","description":"Ward engineer verified heavy traffic volume on 80 Feet Road. Work order sanctioned.","actor":"BBMP Control Room","role":"Municipal System"},{"id":"t1-3","status":"Assigned","timestamp":"2026-10-02T08:30:00Z","title":"Work Order Dispatched","description":"Assigned to BBMP Ward 151 Asphalt Rapid Crew with hot-mix supply.","actor":"AEE South Zone","role":"Department Head"},{"id":"t1-4","status":"In Progress","timestamp":"2026-10-02T14:15:00Z","title":"Road Patchwork Commenced","description":"Traffic barricades placed, surface milling underway.","actor":"AEE Suresh Gowda","role":"Field Team"}]'::jsonb,
    '[{"id":"c1-1","author":"Kavitha R.","avatar":"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80","timestamp":"2026-10-01T12:45:00Z","content":"Nearly took a fall on my scooter here yesterday! Thanks for reporting, Rahul."},{"id":"c1-2","author":"BBMP Works Desk","avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80","timestamp":"2026-10-02T08:35:00Z","content":"Asphalt patch truck dispatched. One lane diverted temporarily until 4 PM."}]'::jsonb,
    '{"confidence":96,"detectedKeywords":["pothole","punctured tires","suspensions","broken asphalt","crater"],"reasoning":"High traffic street hazard detected on Koramangala arterial road."}'::jsonb,
    '2026-10-01T09:30:00Z',
    '2026-10-02T14:15:00Z'
  ),
  (
    'issue-2',
    '#CIVIC-8501',
    'Burst BWSSB Water Pipe Flooding Road & Pedestrian Footpath',
    'High-pressure clean water supply pipeline ruptured beneath pavement slabs. Water has flooded the crosswalk and is leaking toward shop basements near Indiranagar metro.',
    'Water & Drainage',
    'Emergency',
    'Assigned',
    '{"lat":12.9719,"lng":77.6412,"address":"100 Feet Road, near 12th Main Junction","neighborhood":"Indiranagar","landmark":"Near Indiranagar Metro Station"}'::jsonb,
    'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=900&q=80',
    '',
    'BWSSB (Water Supply & Sewerage)',
    '{"name":"BWSSB East Division Hydraulics Unit","leadWorker":"Executive Engineer Ramesh Kumar","contactNumber":"+91 99001 38819"}'::jsonb,
    'Emergency Team ETA: 25 mins',
    68,
    '{"name":"Ananya Rao","contact":"ananya.rao@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t2-1","status":"Submitted","timestamp":"2026-10-02T06:10:00Z","title":"Emergency Water Leak Logged","description":"Reported flooding near Indiranagar commercial shops.","actor":"Ananya Rao","role":"Citizen"},{"id":"t2-2","status":"Under Review","timestamp":"2026-10-02T06:18:00Z","title":"BWSSB Control Room Escalation","description":"Triggered emergency alert for main line shut-off valve.","actor":"BWSSB Hotline","role":"Municipal System"},{"id":"t2-3","status":"Assigned","timestamp":"2026-10-02T07:05:00Z","title":"Line Shut-Off Crew Dispatched","description":"Hydraulics Unit dispatched with isolation valve keys.","actor":"BWSSB Central Control","role":"Department Head"}]'::jsonb,
    '[{"id":"c2-1","author":"Karthik V.","avatar":"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80","timestamp":"2026-10-02T06:30:00Z","content":"Water pressure in 12th Main buildings has dropped completely. Please fix urgently!"}]'::jsonb,
    '{"confidence":99,"detectedKeywords":["burst water main","geyser","flooding","basement","high-pressure"],"reasoning":"Potable water loss and flooding hazard in high density commercial zone."}'::jsonb,
    '2026-10-02T06:10:00Z',
    '2026-10-02T07:05:00Z'
  ),
  (
    'issue-3',
    '#CIVIC-8340',
    'Overflowing Garbage Blackspot Attracting Stray Animals',
    'Public roadside waste collection point in Sector 1 has not been cleared for 4 days. Wet waste spilling onto sidewalk, attracting strays and creating severe odor for nearby residents.',
    'Sanitation',
    'Medium',
    'Resolved',
    '{"lat":12.9116,"lng":77.6389,"address":"27th Main Road, Sector 1, HSR Layout","neighborhood":"HSR Layout","landmark":"Behind BDA Complex HSR Layout"}'::jsonb,
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1528323273322-d81458248d40?auto=format&fit=crop&w=900&q=80',
    'BBMP Solid Waste Management (SWM)',
    '{"name":"HSR Sector 1 Auto Tipper & Sanitation Squad","leadWorker":"Health Inspector Ravi Shankar","contactNumber":"+91 94480 71200"}'::jsonb,
    'Completed',
    34,
    '{"name":"Priya Patel","contact":"priya.p@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t3-1","status":"Submitted","timestamp":"2026-09-28T14:00:00Z","title":"Report Submitted","description":"Citizen reported garbage accumulation and health hazard.","actor":"Priya Patel","role":"Citizen"},{"id":"t3-2","status":"Assigned","timestamp":"2026-09-29T08:00:00Z","title":"Compactor Route Scheduled","description":"Scheduled for morning priority compactor truck clearance.","actor":"BBMP SWM Logistics","role":"Department Head"},{"id":"t3-3","status":"In Progress","timestamp":"2026-09-29T14:15:00Z","title":"Waste Cleared and Area Bleached","description":"Compactor truck on site. Lime powder sprayed.","actor":"Inspector Ravi Shankar","role":"Field Team"},{"id":"t3-4","status":"Resolved","timestamp":"2026-09-29T16:30:00Z","title":"Site Cleared and Sanitized","description":"Blackspot cleared, waste hauled to processing plant, dustbins repositioned.","actor":"Inspector Ravi Shankar","role":"Field Team"}]'::jsonb,
    '[{"id":"c3-1","author":"Ravi Shankar (BBMP SWM)","avatar":"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80","timestamp":"2026-09-29T16:35:00Z","content":"Spot completely cleared and disinfected with bleaching powder. Residents requested not to dump after 10 AM.","isOfficial":true}]'::jsonb,
    '{"confidence":94,"detectedKeywords":["trash bins","overflowing","garbage bags","rodents","spilling"],"reasoning":"Classified as BBMP SWM sanitation request. Medium urgency."}'::jsonb,
    '2026-09-28T14:00:00Z',
    '2026-09-29T16:30:00Z'
  ),
  (
    'issue-4',
    '#CIVIC-8519',
    'BESCOM Electric Pole Knocked Down With Dangling Live Wires',
    'Streetlight electric pole knocked by delivery truck near Hope Farm junction. Base cover missing, revealing exposed live wires at eye-level. Total darkness at night along pedestrian crossing near school.',
    'Electrical',
    'Emergency',
    'Under Review',
    '{"lat":12.986,"lng":77.734,"address":"ITPL Main Road, Hope Farm Junction","neighborhood":"Whitefield","landmark":"Near Whitefield Post Office & School"}'::jsonb,
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=900&q=80',
    '',
    'BESCOM (Electricity Supply & Streetlights)',
    '{"name":"BESCOM Whitefield Substation Emergency Crew","leadWorker":"Lineman Manjunath B.","contactNumber":"+91 98860 94432"}'::jsonb,
    'Under Immediate Dispatch',
    82,
    '{"name":"Karthik Venkatesh","contact":"karthik.v@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t4-1","status":"Submitted","timestamp":"2026-10-02T19:40:00Z","title":"Emergency Hazard Reported","description":"Citizen reported exposed live electric wires near school crossing.","actor":"Karthik Venkatesh","role":"Citizen"},{"id":"t4-2","status":"Under Review","timestamp":"2026-10-02T20:10:00Z","title":"BESCOM 1912 Emergency Alert Dispatched","description":"Priority escalated to Emergency. Lineman dispatched for power isolation.","actor":"BESCOM Helpline 1912","role":"Municipal System"}]'::jsonb,
    '[{"id":"c4-1","author":"Prasad K.","avatar":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80","timestamp":"2026-10-02T20:25:00Z","content":"We placed caution tape around the pole. School starts at 8 AM, please isolate power immediately!"}]'::jsonb,
    '{"confidence":98,"detectedKeywords":["broken streetlight","exposed wiring","live wires","elementary school","darkness"],"reasoning":"Critical electrocution hazard adjacent to school zone. Automatically flagged Emergency."}'::jsonb,
    '2026-10-02T19:40:00Z',
    '2026-10-02T20:10:00Z'
  ),
  (
    'issue-5',
    '#CIVIC-8450',
    'Stormwater Drain Clogged With Silt & Plastic Causing Waterlogging',
    'Side drain grate on 16th Main Road is completely choked with construction debris and single-use plastic. Even 15 minutes of rain causes knee-deep waterlogging across bus stop.',
    'Water & Drainage',
    'Medium',
    'In Progress',
    '{"lat":12.9166,"lng":77.6101,"address":"16th Main Road, near Udupi Garden Signal","neighborhood":"BTM Layout 2nd Stage","landmark":"Near BTM Lake Outer Perimeter"}'::jsonb,
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=80',
    '',
    'BWSSB (Water Supply & Sewerage)',
    '{"name":"BWSSB Jetting Machine & De-silting Squad","leadWorker":"Tech Raghavendra","contactNumber":"+91 97410 63118"}'::jsonb,
    'Tomorrow by 11:00 AM',
    29,
    '{"name":"Deepa Nair","contact":"deepa.nair@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t5-1","status":"Submitted","timestamp":"2026-10-01T15:20:00Z","title":"Clogged Drain Logged","description":"Submitted with photos of street pooling at BTM Layout bus stop.","actor":"Deepa Nair","role":"Citizen"},{"id":"t5-2","status":"Under Review","timestamp":"2026-10-01T18:00:00Z","title":"Sanctioned for High Pressure Jetting","description":"Scheduled for suction machine deployment.","actor":"BBMP Stormwater Cell","role":"Department Head"},{"id":"t5-3","status":"In Progress","timestamp":"2026-10-02T11:00:00Z","title":"Suction Vehicle on Site","description":"Desilting crew clearing clogged culvert.","actor":"Tech Raghavendra","role":"Field Team"}]'::jsonb,
    '[]'::jsonb,
    '{"confidence":93,"detectedKeywords":["storm drain","clogged","tree debris","pooling","wheelchair ramp"],"reasoning":"Accessibility blockage and water retention risk in BTM Layout."}'::jsonb,
    '2026-10-01T15:20:00Z',
    '2026-10-02T11:00:00Z'
  ),
  (
    'issue-6',
    '#CIVIC-8290',
    'Broken Children''s Swing Chain & Damaged Slide in BBMP Park',
    'Central swing set chain is severed and dangling with sharp jagged links in Madhavan Park. Toddler slide has a cracked fiberglass edge. Children attempting to climb damaged structure.',
    'Parks & Recreation',
    'High',
    'Resolved',
    '{"lat":12.9299,"lng":77.5826,"address":"Madhavan Park, 10th Main, Jayanagar 3rd Block","neighborhood":"Jayanagar","landmark":"Children''s Play Section near East Gate"}'::jsonb,
    'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1575783970733-1aaedde1db74?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=900&q=80',
    'BBMP Horticulture & Parks',
    '{"name":"Jayanagar Ward Parks Maintenance Crew","leadWorker":"Officer Srinivas K.","contactNumber":"+91 98455 42390"}'::jsonb,
    'Completed',
    53,
    '{"name":"Sneha Murthy","contact":"sneha.m@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t6-1","status":"Submitted","timestamp":"2026-09-25T11:15:00Z","title":"Playground Hazard Logged","description":"Severed swing chain reported in Madhavan Park.","actor":"Sneha Murthy","role":"Citizen"},{"id":"t6-2","status":"Assigned","timestamp":"2026-09-26T09:00:00Z","title":"Replacement Hardware Ordered","description":"Heavy duty zinc-plated chains and rubber seats requisitioned.","actor":"BBMP Horticulture South","role":"Department Head"},{"id":"t6-3","status":"In Progress","timestamp":"2026-09-27T10:00:00Z","title":"Welding & Installation Underway","description":"Chains replaced and load-tested.","actor":"Officer Srinivas K.","role":"Field Team"},{"id":"t6-4","status":"Resolved","timestamp":"2026-09-27T17:00:00Z","title":"Certified Safe for Kids","description":"New safety coated chains and smooth slide patch installed.","actor":"Officer Srinivas K.","role":"Field Team"}]'::jsonb,
    '[{"id":"c6-1","author":"Officer Srinivas K. (BBMP)","avatar":"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=80","timestamp":"2026-09-27T17:05:00Z","content":"Swings and slides have been repaired and inspected. Safe for children to play.","isOfficial":true}]'::jsonb,
    '{"confidence":95,"detectedKeywords":["playground","swing","broken chain","jagged metal","children"],"reasoning":"Injury risk for children in public municipal park."}'::jsonb,
    '2026-09-25T11:15:00Z',
    '2026-09-27T17:00:00Z'
  ),
  (
    'issue-7',
    '#CIVIC-8534',
    'Crash Guardrail Bent Into Fast Lane On Outer Ring Road Flyover',
    'Central median steel crash barrier crumpled into lane after midnight tempo accident near Bellandur flyover. Missing reflector studs create severe hazard during night hours.',
    'Public Safety',
    'High',
    'Submitted',
    '{"lat":12.9293,"lng":77.6748,"address":"Outer Ring Road (ORR) Flyover, Bellandur Junction","neighborhood":"Bellandur","landmark":"Near Ecospace Tech Park Flyover Descent"}'::jsonb,
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=900&q=80',
    '',
    'Bengaluru Traffic Police & Road Safety',
    'null'::jsonb,
    'Pending review',
    19,
    '{"name":"Anonymous Citizen","isAnonymous":true}'::jsonb,
    '[{"id":"t7-1","status":"Submitted","timestamp":"2026-10-03T02:45:00Z","title":"Report Submitted via Mobile App","description":"Report filed anonymously with photo capture on ORR Bellandur.","actor":"Anonymous Citizen","role":"Citizen"}]'::jsonb,
    '[]'::jsonb,
    '{"confidence":92,"detectedKeywords":["guardrail","accident","blind spot","night driving","buckling"],"reasoning":"Flyover vehicular speed corridor with damaged median barrier."}'::jsonb,
    '2026-10-03T02:45:00Z',
    '2026-10-03T02:45:00Z'
  ),
  (
    'issue-8',
    '#CIVIC-8540',
    'Gulmohar Tree Branch Resting on BESCOM Transformer Lines',
    'Large dry gulmohar branch leaning directly on 11kV distribution line opposite Malleshwaram market. With gusty pre-monsoon winds, there is immediate risk of sparking or power outage.',
    'Infrastructure',
    'Medium',
    'Under Review',
    '{"lat":12.9996,"lng":77.5709,"address":"8th Cross Road, Sampige Road","neighborhood":"Malleshwaram","landmark":"Opposite Malleshwaram Market"}'::jsonb,
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=80',
    '',
    'BBMP Forest Cell & Tree Maintenance',
    'null'::jsonb,
    'Awaiting tree pruning crew schedule',
    14,
    '{"name":"Arvind Swamy","contact":"arvind.swamy@example.com","isAnonymous":false}'::jsonb,
    '[{"id":"t8-1","status":"Submitted","timestamp":"2026-10-03T05:15:00Z","title":"Tree Hazard Reported","description":"Citizen reported branch strain on power lines in Malleshwaram.","actor":"Arvind Swamy","role":"Citizen"},{"id":"t8-2","status":"Under Review","timestamp":"2026-10-03T06:00:00Z","title":"Referred to BBMP Forest Cell & BESCOM","description":"Joint inspection scheduled for tree branch trimming with hydraulic bucket truck.","actor":"BESCOM Malleshwaram","role":"Municipal System"}]'::jsonb,
    '[]'::jsonb,
    '{"confidence":89,"detectedKeywords":["tree limbs","power cables","overhead","sparking","windy weather"],"reasoning":"Electrical line interference by heavy vegetation."}'::jsonb,
    '2026-10-03T05:15:00Z',
    '2026-10-03T06:00:00Z'
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  category = EXCLUDED.category,
  urgency = EXCLUDED.urgency,
  status = EXCLUDED.status,
  location = EXCLUDED.location,
  media_url = EXCLUDED.media_url,
  before_photo_url = EXCLUDED.before_photo_url,
  after_photo_url = EXCLUDED.after_photo_url,
  department = EXCLUDED.department,
  assigned_team = EXCLUDED.assigned_team,
  eta = EXCLUDED.eta,
  upvotes = EXCLUDED.upvotes,
  timeline = EXCLUDED.timeline,
  comments = EXCLUDED.comments,
  updated_at = EXCLUDED.updated_at;
