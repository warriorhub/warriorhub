-- Seed CategoryNew table (names only)
INSERT INTO "CategoryNew" (name) VALUES
  ('Recreation'),
  ('Food'),
  ('Career'),
  ('Free'),
  ('Cultural'),
  ('Academic'),
  ('Social'),
  ('Sports'),
  ('Workshop')
ON CONFLICT (name) DO NOTHING;

-- Migrate existing event categories from old enum to new CategoryNew table
-- Recreation
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Recreation' 
  AND 'Recreation' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Food
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Food' 
  AND 'Food' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Career
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Career' 
  AND 'Career' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Free
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Free' 
  AND 'Free' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Cultural
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Cultural' 
  AND 'Cultural' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Academic
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Academic' 
  AND 'Academic' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Social
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Social' 
  AND 'Social' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Sports
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Sports' 
  AND 'Sports' = ANY(e.categories)
ON CONFLICT DO NOTHING;

-- Workshop
INSERT INTO "_CategoryNewToEvent" ("A", "B")
SELECT c.id, e.id
FROM "CategoryNew" c, "Event" e
WHERE c.name = 'Workshop' 
  AND 'Workshop' = ANY(e.categories)
ON CONFLICT DO NOTHING;