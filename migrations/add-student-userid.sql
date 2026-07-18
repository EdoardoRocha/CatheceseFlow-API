-- Production: add catequista responsável FK on Students.
-- Dev: restarting the API with conn.sync() also creates this column via Sequelize associations.
ALTER TABLE "Students"
  ADD COLUMN IF NOT EXISTS "UserId" INTEGER REFERENCES "Users"(id);
