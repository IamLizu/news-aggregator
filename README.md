# News Aggregator

A Node.js program that fetches, processes, and stores news articles from RSS feeds. The program includes features like filtering articles, topic extraction, and named entity recognition, with support for scheduling periodic RSS feed processing.


## Table of Contents
- [Setup](#setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
- [Features](#features)
    - [Fetching Data](#fetching-data)
        - [Scheduling](#scheduling)
    - [Persisting Data](#persisting-data)
    - [Topic & Named Entity Extraction](#topic-and-named-entity-extraction)
    - [Filtering](#filtering)
    
- [Run Application](#run-application)
- [Lint Code](#lint-code)
- [Logging](#logging)
- [Architecture Overview](#architecture-overview)
- [Storage](#storage)
- [Approach and Data Structures](#approach-and-data-structures)
- [Fetching Data](#fetching-data-1)
- [Topic Extraction Method](#topic-extraction-method)
- [Named Entity Extraction Method](#named-entity-extraction-method)
- [Visualization](#visualization)

## Setup

### Prerequisites
- Node.js (v20.10.0 or higher)
- MongoDB (installed and running locally or via a remote instance)
- Open API Key (for topic and named entity extraction)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd news-aggregator
   ```

2. Install dependencies:
   ```bash
   yarn install
   ```

3. Create configuration files:
   - Copy `default.json` in the `config` directory to `development.json` or `production.json`.
   - Update the `DATABASE_URL` and `OPENAI_KEY` fields in the config files as per your setup.

## Features

### Fetching Data
- The program supports fetching articles from multiple RSS feeds using URLs configured in a JSON file.
- Errors such as invalid URLs or network issues are handled gracefully and logged.

```bash
node index.js fetch --json feeds.json
```

```json
{
  "feeds": [
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "http://feeds.bbci.co.uk/news/world/rss.xml"
  ]
}
```

> [!NOTE] 
> The `--schedule` flag can be used to schedule periodic fetching and processing of articles.

#### Scheduling
- Periodic fetching and processing of articles can be scheduled using cron-like syntax.
- Example: Fetch every 10 minutes.

### Persisting Data
- Fetched articles are stored in a MongoDB database.
- Stored fields include:
  - Title
  - Description
  - Publication Date
  - Source URL
  - Extracted Topics
  - Named Entities (People, Locations, Organizations)  


### Topic And Named Entity Extraction
- Topics and named entities are extracted using OpenAI's GPT models with structured prompts during processing.
- Stored alongside the news articles in the database.

### Filtering
- Articles can be filtered by:
  - Keywords (matched against topics and named entities).
  - Publication date range (`fromDate` and `toDate`).
- Supports multiple keyword filtering.

```bash
node index.js view --keyword "putin" --keyword "trump" --fromDate "2024-11-01" --toDate "2024-11-20"
```


## Run Application

### Usage
You can run the application using the following commands:

1. Fetch articles:
   ```bash
   node index.js fetch --json feeds.json
   ```

2. Fetch and schedule periodic processing:
   ```bash
   node index.js fetch --json feeds.json --schedule true
   ```

3. Filter articles:
   ```bash
   node index.js view --keyword "putin" --fromDate "2024-11-01" --toDate "2024-11-20"
   ```

### Lint Code

#### Run Linter
```bash
yarn lint
```

#### Auto-fix Issues
```bash
yarn lint:fix
```

## Logging

- **Logger**: Winston with daily rotation.
- Logs are stored in the `logs/` directory:
  - `application-YYYY-MM-DD.log`: General logs.
  - `error-YYYY-MM-DD.log`: Error logs.
- Format: JSON for structured logging.


## Architecture Overview

The application follows Domain Driven Design (DDD), organized into the following layers:
- **Domain**: Core business logic (e.g., `Article`, `TopicExtractor`).
- **Application**: Orchestrates use cases (e.g., `FetchAndSaveArticles`, `GetArticles`).
- **Infrastructure**: Interacts with external services (e.g., RSS parser, database).
- **Interface**: Handles input/output (e.g., CLI commands).

> [!NOTE]  
DDD makes it easier to write clean code. Easy to scale and write testable codebase.

## Approach and Data Structures

### Article Data Structure
```json
{
  "title": "News Title",
  "description": "Brief description of the news.",
  "publicationDate": "2024-11-22T12:00:00Z",
  "source": "https://example.com/news",
  "topics": ["topic1", "topic2"],
  "entities": {
    "people": ["Person A"],
    "locations": ["Location A"],
    "organizations": ["Organization A"]
  }
}
```

### Storage
- MongoDB is used to store the articles.
- Indexed fields include `publicationDate`, `topics`, and `entities` for efficient querying.

### Fetching data

- Take a json file and use [`rss-parser`](https://www.npmjs.com/package/rss-parser) to parse the feed URL(s).
- Normalize the data using Article domain and create article object.


### Topic Extraction Method

#### Approach
- **Service**: OpenAI's GPT model gpt-3.5-turbo-instruct with max token 100 and temperature 0.7.

A combination of news title and content is sent to Chat Completion API.

Using the completion API of OpenAI, the model generates a list of key topics from the article. Then those topics are trimmed and returned to caller for further processing (modifying the article and saving in database).

#### Example Prompt
```text
Extract 5 key topics from the following text. Provide the topics as a comma-separated list of concise keywords. Avoid long phrases or sentences:"President Putin met with global leaders to discuss climate change in Moscow."
```
#### Example Output
```text
Putin, global leaders, climate change, meeting, Moscow
```

### Named Entity Extraction Method
#### Approach
- **Service**: OpenAI's GPT model gpt-4 with max token 200 and temperature 0.

Same approach as the topic extraction method.

#### Example Prompt
```text
Extract named entities (people, locations, organizations) from the following text.
Return the result strictly as valid JSON with keys: "people", "locations", "organizations".

Text: "President Putin met with global leaders to discuss climate change in Moscow."
```

#### Example Output
```json
{
  "people": ["President Putin"],
  "locations": ["Moscow"],
  "organizations": []
}
```

### Filtering
- Query with passed `--keyword "putin"` value 
- Supports multiple keyword query
- Supports from and to-date filtering

### Visualization

- Use `yargs` to expose command `view` which without any query outputs stringified JSON. The string can be easily feed to different programs or API for further processing / handling if needed.