-- Force alter the table schema to include parent nesting and company tracking keys
ALTER TABLE ledger_groups 
ADD COLUMN IF NOT EXISTS parent_id INTEGER REFERENCES ledger_groups(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE;