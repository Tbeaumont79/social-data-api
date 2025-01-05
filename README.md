# social-data-api

This is a social data API that allows you to fetch and store social data from various social media platforms.
Actually the project is a work in progress and will be updated in the future, it work with the bluesky Api and the github Api.

## Installation

First clone the repository then run the following command:

```bash
npm install
```

You have to create a `.env` file and add the following variables:

```bash
PORT=3000
SUPABASE_URL=YOUR_DATABASE_URL
SUPABASE_KEY=YOUR_DATABASE_KEY
GITHUB_TOKEN=YOUR_GITHUB_TOKEN
API_KEY=YOUR_API_KEY
API_SECRET=YOUR_API_SECRET
```

Also you need to create a supabase database and add the following tables:

```bash
CREATE TABLE IF NOT EXISTS bluesky_posts (
    id SERIAL PRIMARY KEY,
    url VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL,
    author VARCHAR(255) NOT NULL,
    text VARCHAR(255) NOT NULL,
    langs VARCHAR(255) ARRAY NOT NULL,
    embed_description VARCHAR(255) NOT NULL,
    embed_title VARCHAR(255) NOT NULL,
    embed_url VARCHAR(255) NOT NULL
);
```

## Usage

```bash
npm start
```

## Test

You will notice the test folder, these tests are not implemented yet.
