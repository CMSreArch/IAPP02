import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({ region: "us-east-1" }); 
const dynamo = DynamoDBDocumentClient.from(client);
const tableName = 'ItemsTable';

export const handler = async (event) => {
    try {
        const method = event.requestContext?.http?.method;

        if (method === 'POST') {
            // SOLUCIÓN: Si viene codificado en Base64 lo decodifica, si no, usa el texto plano directamente
            const rawBody = event.isBase64Encoded 
                ? Buffer.from(event.body, 'base64').toString('utf-8')
                : event.body;

            const item = JSON.parse(rawBody);
            
            await dynamo.send(new PutCommand({ 
                TableName: tableName, 
                Item: item 
            }));
            
            return {
                statusCode: 201,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: 'Item creado exitosamente' })
            };
        } 
        
        else if (method === 'GET') {
            const itemId = event.queryStringParameters?.id;
            if (!itemId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Falta el parámetro id' })
                };
            }

            const result = await dynamo.send(new GetCommand({ 
                TableName: tableName, 
                Key: { ItemID: itemId } 
            }));
            
            if (result.Item) {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(result.Item)
                };
            } else {
                return {
                    statusCode: 404,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: 'Item no encontrado' })
                };
            }
        } 
        
        else if (method === 'DELETE') {
            const itemId = event.queryStringParameters?.id;
            if (!itemId) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ message: 'Falta el parámetro id' })
                };
            }

            await dynamo.send(new DeleteCommand({ 
                TableName: tableName, 
                Key: { ItemID: itemId } 
            }));
            
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: 'Item eliminado exitosamente' })
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ message: `Método ${method} no permitido` })
        };

    } catch (error) {
        console.error("Error en la ejecución:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: 'Error interno del servidor', error: error.message })
        };
    }
};
