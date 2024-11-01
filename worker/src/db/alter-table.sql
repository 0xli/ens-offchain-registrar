ALTER TABLE names ADD COLUMN id INTEGER;
ALTER TABLE names ADD COLUMN referee TEXT;
ALTER TABLE names ADD COLUMN nft TEXT;
ALTER TABLE names ADD COLUMN nftid INTEGER;

-- Update existing rows with sequential IDs using rowid
UPDATE names SET id = rowid;

-- Create an index on id
CREATE UNIQUE INDEX names_id_idx ON names(id);