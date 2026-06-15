-- Optional seed data. Passwords should be created through signup in real testing.
INSERT INTO users (name, email, password, role)
VALUES
  ('Demo Contributor', 'contributor@devpulse.com', '$2b$10$7kA3BA1MY.aa3tKB5Cg3oeRoSUP1m.7kY9CqPNUzzMd5xQ4Y9U3LW', 'contributor'),
  ('Demo Maintainer', 'maintainer@devpulse.com', '$2b$10$7kA3BA1MY.aa3tKB5Cg3oeRoSUP1m.7kY9CqPNUzzMd5xQ4Y9U3LW', 'maintainer')
ON CONFLICT (email) DO NOTHING;
