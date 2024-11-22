# News Aggregator

A Node.js program that fetches, processes, and stores news articles from RSS feeds. The program includes features like filtering articles, topic extraction, and named entity recognition, with support for scheduling periodic RSS feed processing.

> **Note**  
> Built with [Domain Driven Design (DDD)](https://en.wikipedia.org/wiki/Domain-driven_design) principles.  
> Dependencies are injected using [awilix](https://www.npmjs.com/package/awilix).

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
- [Approach and Data Structures](#approach-and-data-structures)
- [Topic Extraction Method](#topic-extraction-method)

## Setup

### Prerequisites
- Node.js (v20.10.0 or higher)
- MongoDB (installed and running locally or via a remote instance)

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
node index.js filter --keyword "putin" --keyword "trump" --fromDate "2024-11-01" --toDate "2024-11-20"
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
   node index.js filter --keyword "putin" --fromDate "2024-11-01" --toDate "2024-11-20"
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


## Topic Extraction Method

### Approach
- **Service**: OpenAI's GPT models.
- **Method**: Articles are sent to the model with structured prompts for extracting:
  - Key topics
  - Named entities (People, Locations, Organizations)

### Example Prompt
```text
Extract key topics and named entities (people, locations, organizations) from the following text. Return the result strictly as valid JSON:

Text: "President Putin met with global leaders to discuss climate change in Moscow."
```

### Example Output
```console
$ node index.js filter --keyword "putin"
2024-11-22T15:25:47.145Z [info]: Connected to MongoDB {}
2024-11-22T15:25:47.148Z [info]: Fetching and filtering articles with query {"query":{"keywords":["putin"]}}
2024-11-22T15:25:47.177Z [info]: Filtered articles fetched successfully. {"count":6}
2024-11-22T15:25:47.178Z [info]: Filtered Articles: {"0":{"entities":{"people":[],"locations":[],"organizations":[]},"_id":"67409d4423be104d7ec10c54","title":"As Ukraine Fires U.S. Missiles, Putin Sends a Chilling Message","link":"https://www.nytimes.com/2024/11/22/wor
ld/europe/ukraine-russia-us-trump-putin.html","publicationDate":"2024-11-25T14:58:57.000Z","description":"The Russian leader ominously declares that America risks nuclear war as it expands its aid.","content":"The Russian leader ominously declares that America risks nu
clear war as it expands its aid.","topics":["Ukraine","U.S. Missiles","Putin","Chilling Message","Nuclear War"],"source":"https://rss.nytimes.com/services/xml/rss/nyt/World.xml","createdAt":"2024-11-22T15:03:32.647Z","__v":0,"updatedAt":"2024-11-22T15:03:32.664Z"},"1":
{"entities":{"people":["Merkel","Trump","Putin","Angela Merkel"],"locations":["Germany","Europe"],"organizations":[]},"_id":"67409d4423be104d7ec10c57","title":"Merkel Memoir Recalls What It Was Like Dealing With Trump and Putin","link":"https://www.nytimes.com/2024/11/
22/world/europe/merkel-memoir-trump-putin.html","publicationDate":"2024-11-22T12:28:54.000Z","description":"The new book by former Chancellor Angela Merkel of Germany also aims to justify decisions she made that are still affecting her country and the rest of Europe.",
"content":"The new book by former Chancellor Angela Merkel of Germany also aims to justify decisions she made that are still affecting her country and the rest of Europe.","topics":["Merkel","Memoir","Dealing","Trump","Putin"],"source":"https://rss.nytimes.com/services
/xml/rss/nyt/World.xml","createdAt":"2024-11-22T15:03:32.649Z","__v":0,"updatedAt":"2024-11-22T15:03:32.664Z"},"2":{"entities":{"people":["Omar Hassan al-Bashir","Vladimir V. Putin"],"locations":["Sudan","Russia"],"organizations":["ICC"]},"_id":"67409d4423be104d7ec10c7
0","title":"Who Has the ICC Charged With War Crimes?","link":"https://www.nytimes.com/2024/11/21/world/middleeast/icc-war-crime-arrest-warrants-putin.html","publicationDate":"2024-11-21T14:25:48.000Z","description":"The short list includes Omar Hassan al-Bashir, the de
posed president of Sudan, and President Vladimir V. Putin of Russia.","content":"The short list includes Omar Hassan al-Bashir, the deposed president of Sudan, and President Vladimir V. Putin of Russia.","topics":["ICC","charged","war crimes","Omar Hassan al-Bashir","V
ladimir V. Putin"],"source":"https://rss.nytimes.com/services/xml/rss/nyt/World.xml","createdAt":"2024-11-22T15:03:32.654Z","__v":0,"updatedAt":"2024-11-22T15:03:32.665Z"},"3":{"entities":{"people":[],"locations":[],"organizations":[]},"_id":"67409d4423be104d7ec10c72",
"title":"Putin Escalates Threats to the West With New Ballistic Missile Launch","link":"https://www.nytimes.com/2024/11/21/world/europe/russia-ballistic-missile-ukraine-war.html","publicationDate":"2024-11-22T03:22:47.000Z","description":"The intermediate-range missile
 did not carry nuclear weapons, but it is part of a strategic arsenal that is capable of delivering them.","content":"The intermediate-range missile did not carry nuclear weapons, but it is part of a strategic arsenal that is capable of delivering them.","topics":["Put
in","Threats","West","Ballistic Missile","Nuclear Weapons"],"source":"https://rss.nytimes.com/services/xml/rss/nyt/World.xml","createdAt":"2024-11-22T15:03:32.654Z","__v":0,"updatedAt":"2024-11-22T15:03:32.665Z"},"4":{"entities":{"people":[],"locations":[],"organizatio
ns":[]},"_id":"67409d4c23be104d7ec10c8f","title":"Steve Rosenberg: After days of escalation, what will Putin do next?","link":"https://www.bbc.com/news/articles/c62j1g8g45vo","publicationDate":"2024-11-22T08:04:39.000Z","description":"BBC Russia editor Steve Rosenberg
assesses the Russian leader's next move.","content":"BBC Russia editor Steve Rosenberg assesses the Russian leader's next move.","topics":["Steve Rosenberg","days","escalation","Putin","next move"],"source":"http://feeds.bbci.co.uk/news/world/rss.xml","createdAt":"2024
-11-22T15:03:40.237Z","__v":0,"updatedAt":"2024-11-22T15:03:40.251Z"},"5":{"entities":{"people":[],"locations":[],"organizations":[]},"_id":"67409d4c23be104d7ec10ca3","title":"Putin gifts lion and brown bears to North Korea zoo","link":"https://www.bbc.com/news/article
s/cx24175015jo","publicationDate":"2024-11-21T04:46:28.000Z","description":"The two countries have grown very close recently, with N Korea supporting Putin's war in Ukraine.","content":"The two countries have grown very close recently, with N Korea supporting Putin's w
ar in Ukraine.","topics":["Putin","gifts","lion","brown bears","North Korea zoo"],"source":"http://feeds.bbci.co.uk/news/world/rss.xml","createdAt":"2024-11-22T15:03:40.243Z","__v":0,"updatedAt":"2024-11-22T15:03:40.252Z"}}
2024-11-22T15:25:47.183Z [info]: Disconnected from MongoDB {}
```