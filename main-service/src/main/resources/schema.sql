CREATE TABLE IF NOT EXISTS HISTORY_ITEM (
                              id SERIAL PRIMARY KEY,
                              key INTEGER NOT NULL,
                              value INTEGER NOT NULL,
                              creation_date_time TIMESTAMP NOT NULL
);
