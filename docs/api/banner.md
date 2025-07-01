````markdown
// filepath: c:\Users\BreannaAnderson\SwiftlyProjects\taxo\taxonomy-ui\docs\api\banner.md

# Banner API Documentation

## Banner Operations

### List Banners

```http
GET /api/banner/list
```

**Response**

```json
[
  {
    "banner_id": "a4c3da6a-9072-44a7-b83c-9d1227d08037",
    "banner_name": "Example Banner",
    "tenant_id": "exmp",
    "is_active": true,
    "inserted_datetime": "2024-01-03T14:34:46.620000",
    "updated_datetime": "2024-01-03T14:34:46.620000",
    "updated_by": "user@swiftly.com"
  }
]
```

### Get Banner

```http
GET /api/banner/get?banner_id={banner_id}
```

or

```http
GET /api/banner/get?tenant_id={tenant_id}
```

**Parameters**
| Name | Type | Description |
|----------|---------|-------------|
| banner_id | UUID | ID of banner |
| tenant_id | String | ID of tenant |

**Response**

```json
{
  "banner_id": "a4c3da6a-9072-44a7-b83c-9d1227d08037",
  "banner_name": "Example Banner",
  "tenant_id": "exmp",
  "is_active": true,
  "inserted_datetime": "2024-01-03T14:34:46.620000",
  "updated_datetime": "2024-01-03T14:34:46.620000",
  "updated_by": "user@swiftly.com"
}
```
````
