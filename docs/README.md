# Swiftly Taxonomy Manager Documentation

## Overview

The Taxonomy Manager provides a UI for managing hierarchical taxonomies in the Swiftly ecosystem. It interfaces with the Swiftly Data API to manage taxonomy graphs, nodes, and relationships.

## Project Structure

```
taxonomy-ui/
├── docs/             # Documentation
│   ├── api/         # API documentation
│   └── README.md    # This file
├── src/             # Source code
│   ├── components/  # React components
│   ├── services/    # API services
│   └── types/       # TypeScript types
└── README.md        # Project README
```

## Getting Started

1. Clone the repository
2. Copy `.env.template` to `.env`
3. Add your API key
4. `npm install`
5. `npm run dev`

## Key Features

- View and manage taxonomy graphs
- Browse hierarchical relationships
- Edit taxonomy properties
- Manage banner/tenant relationships

## Architecture

- React + TypeScript frontend
- REST API integration
- Material UI components (planned)
- React-Arborist for tree management (planned)
