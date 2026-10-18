INSERT OR IGNORE INTO user (id, name, email, email_verified, image, created_at, updated_at, bio, onboarded)
VALUES ('demo-user', 'Demo User', 'demo@example.com', 1, NULL, 1767225600000, 1767225600000, '', 1);

INSERT OR IGNORE INTO account (id, account_id, provider_id, user_id, password, created_at, updated_at)
VALUES (
  'demo-user-credential',
  'demo-user',
  'credential',
  'demo-user',
  'ea252364d7e5013702a6c0d7431e7190:bdf1435a706d84694e5925dd383ba4373a81655be48411a46a9610ec1078197eeba999c16f597192048a99c2b917b34f72148b3118b83782984c9b28c5c95873',
  1767225600000,
  1767225600000
);

DELETE FROM item WHERE owner_id = 'demo-user';

WITH RECURSIVE seq(i) AS (
  SELECT 0
  UNION ALL
  SELECT i + 1 FROM seq WHERE i < 63
)
INSERT INTO item (id, owner_id, name, description, status, quantity, updated_at)
SELECT
  lower(hex(randomblob(4))) || '-' ||
  lower(hex(randomblob(2))) || '-4' ||
  substr(lower(hex(randomblob(2))), 2) || '-' ||
  substr('89ab', 1 + (abs(random()) % 4), 1) ||
  substr(lower(hex(randomblob(2))), 2) || '-' ||
  lower(hex(randomblob(6))),
  'demo-user',
  'Item ' || printf('%02d', i + 1),
  '',
  CASE i % 3 WHEN 0 THEN 'draft' WHEN 1 THEN 'active' ELSE 'archived' END,
  (i * 7) % 50,
  1767225600000 + i * 13 * 3600000
FROM seq;
