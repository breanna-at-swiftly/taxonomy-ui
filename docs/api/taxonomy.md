# Taxonomy API Documentation

## Graph Operations

### List Graphs

```http
GET /api/taxonomy/graph/list
```

**Response**

```json
[
  {
    "graph_id": 13,
    "topology_id": 1,
    "name": "example navigation",
    "notes": "Example notes",
    "root_node_id": "C69B2D7C-534C-45AE-90CC-B379E33C1D27",
    "inserted_datetime": "2023-12-19T20:16:15.777000",
    "updated_datetime": "2023-12-19T20:16:15.777000",
    "updated_by": "user@swiftly.com"
  }
]
```

### Get Graph

```http
GET /api/taxonomy/graph/get?graph_id={graph_id}
```

**Parameters**
| Name | Type | Description |
|----------|---------|-------------|
| graph_id | Integer | ID of graph |

**Response**

```json
{
  "graph_id": 28,
  "topology_id": 1,
  "name": "example_classification",
  "notes": "Example Classification",
  "root_node_id": "50C29661-9B26-4221-BC7D-867706FEAE25",
  "inserted_datetime": "2024-01-08T17:27:23.107000",
  "updated_datetime": "2024-01-08T17:27:23.107000",
  "updated_by": "user@swiftly.com"
}
```

### Create Graph

```http
POST /api/taxonomy/graph/create
```

**Request Body**

```json
{
  "name": "New Graph",
  "notes": "Description of the new graph",
  "topology_id": 1
}
```

### Update Graph

```http
PUT /api/taxonomy/graph/update
```

**Request Body**

```json
{
  "graph_id": 28,
  "name": "updated name",
  "notes": "updated notes"
}
```

### Delete Graph

```http
DELETE /api/taxonomy/graph/delete?graph_id={graph_id}
```

### Clone Graph

```http
POST /api/taxonomy/graph/clone
```

**Request Body**

```json
{
  "graph_id": 28,
  "new_name": "Cloned Graph",
  "notes": "A clone of the original graph"
}
```

### Import Graph

```http
POST /api/taxonomy/graph/import
```

**Request Body**

```json
{
  "name": "Imported Graph",
  "notes": "Imported from JSON",
  "nodes": [...],
  "links": [...]
}
```

### Export Graph

```http
GET /api/taxonomy/graph/export?graph_id={graph_id}
```

### Graph Diff

```http
POST /api/taxonomy/graph/diff
```

## Node Operations

### Create Node

```http
POST /api/taxonomy/node/create
```

**Request Body**

```json
{
  "graph_id": 28,
  "name": "New Node",
  "parent_id": "50C29661-9B26-4221-BC7D-867706FEAE25",
  "notes": "Optional node description",
  "properties": {
    "key1": "value1",
    "key2": "value2"
  }
}
```

**Response**

```json
{
  "node_id": "7B8E9F10-1234-5678-90AB-CDEF12345678",
  "graph_id": 28,
  "name": "New Node",
  "notes": "Optional node description",
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "inserted_datetime": "2024-01-08T17:27:23.107000",
  "updated_datetime": "2024-01-08T17:27:23.107000",
  "updated_by": "user@swiftly.com"
}
```

### Get Node

```http
GET /api/taxonomy/node/get?node_id={node_id}
```

or

```http
GET /api/taxonomy/node/get?tenant_id={tenant_id}
```

**Parameters**
| Name | Type | Description |
|----------|---------|-------------|
| node_id | UUID | ID of node |
| tenant_id | String | ID of tenant |

**Response**

```json
{
  "node_id": "7B8E9F10-1234-5678-90AB-CDEF12345678",
  "graph_id": 28,
  "name": "New Node",
  "notes": "Optional node description",
  "properties": {
    "key1": "value1",
    "key2": "value2"
  },
  "inserted_datetime": "2024-01-08T17:27:23.107000",
  "updated_datetime": "2024-01-08T17:27:23.107000",
  "updated_by": "user@swiftly.com"
}
```

### Update Node

```http
PUT /api/taxonomy/node/update
```

**Request Body**

```json
{
  "node_id": "7B8E9F10-1234-5678-90AB-CDEF12345678",
  "name": "Updated Node",
  "notes": "Updated description",
  "properties": {
    "key1": "new_value1",
    "key2": "new_value2"
  }
}
```

### Delete Node

```http
DELETE /api/taxonomy/node/delete
```

### Query Nodes

```http
GET /api/taxonomy/node/query?graph_id={graph_id}&query={query}
```

**Parameters**
| Name | Type | Description |
|----------|---------|-------------|
| graph_id | Integer | ID of graph |
| query | String | Query expression for filtering nodes |

### Get Orphans

```http
GET /api/taxonomy/node/get-orphans?graph_id={graph_id}
```

### Merge Nodes

```http
POST /api/taxonomy/node/merge
```

**Request Body**

```json
{
  "source_node_id": "7B8E9F10-1234-5678-90AB-CDEF12345678",
  "target_node_id": "8C9F0G11-2345-6789-01BC-DEFG23456789"
}
```

### Split Node

```http
POST /api/taxonomy/node/split
```

**Request Body**

```json
{
  "node_id": "7B8E9F10-1234-5678-90AB-CDEF12345678",
  "split_ratio": 0.5
}
```

## Product Operations

### Create Node Product

```http
POST /api/taxonomy/node-product/create
```

### Get Node Product

```http
GET /api/taxonomy/node-product/get
```

### Delete Node Product

```http
DELETE /api/taxonomy/node-product/delete
```

## Banner Graph Operations

### Create Banner Graph

```http
POST /api/taxonomy/banner-graph/create
```

**Request Body**

```json
{
  "banner_id": "a4c3da6a-9072-44a7-b83c-9d1227d08037",
  "graph_id": 28,
  "environment": "production"
}
```

### Get Banner Graph

```http
GET /api/taxonomy/banner-graph/get
```

### Update Banner Graph

```http
PUT /api/taxonomy/banner-graph/update
```

### Delete Banner Graph

```http
DELETE /api/taxonomy/banner-graph/delete
```

### Publish Graph

```http
POST /api/taxonomy/banner-graph/publish
```

**Request Body**

```json
{
  "banner_id": "a4c3da6a-9072-44a7-b83c-9d1227d08037",
  "graph_id": 28,
  "environment": "production",
  "notes": "Production deployment"
}
```

### List Publish Logs

```http
GET /api/taxonomy/banner-graph/publish-log-list
```

## Common Response Codes

| Code | Description  |
| ---- | ------------ |
| 200  | Success      |
| 400  | Bad Request  |
| 401  | Unauthorized |
| 404  | Not Found    |
| 500  | Server Error |

## Authentication

All requests require an API key passed in the header:

```http
api-key: your-api-key-here
```
