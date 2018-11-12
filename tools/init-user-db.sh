#!/bin/bash
set -e
echo "================================== initialize postgres"
psql -v ON_ERROR_STOP=1 --username postgres --dbname postgres <<-EOSQL
    CREATE TABLE IF NOT EXISTS responses (
    id SERIAL PRIMARY KEY,
    key VARCHAR NOT NULL,
    data TEXT NOT NULL,
    time DECIMAL NOT NULL,
    mock_id VARCHAR NOT NULL
)
EOSQL

echo "================================== end postgres $0 $1::"
