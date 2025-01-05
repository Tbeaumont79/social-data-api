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

## Usage

```bash
npm start
```

## Test

You will notice the test folder, these tests are not implemented yet.