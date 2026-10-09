Prueba del codigo json en lambda

```
Para POST
{
  "requestContext": { 
    "http": { "method": "POST" } 
  },
  "isBase64Encoded": true,
  "body": "eyAiSXRlbUlEIjogIjEyMyIsICJub21icmUiOiAiTWkgcHJvZHVjdG8iLCAicHJlY2lvIjogNTAgfQ=="
}
```

Para GET
```
{
  "requestContext": {
    "http": {
      "method": "GET"
    }
  },
  "queryStringParameters": {
    "id": "123"
  }
}
```

Para DELETE
```
{
  "requestContext": {
    "http": {
      "method": "DELETE"
    }
  },
  "queryStringParameters": {
    "id": "123"
  }
}
```




POST curl
```
curl -X POST "https://j9g088j5j2.execute-api.us-east-1.amazonaws.com/items" \
     -H "Content-Type: application/json" \
     -d '{
       "ItemID": "789",
       "nombre": "Producto desde Terminal",
       "precio": 150
     }'
```
```
 curl -X GET "https://j9g088j5j2.execute-api.us-east-1.amazonaws.com/items?id=789"
```
Resultado probable
{"nombre":"Producto desde Terminal","ItemID":"789","precio":150}%

```
 curl -X DELETE "https://j9g088j5j2.execute-api.us-east-1.amazonaws.com/items?id=789"
 ```
