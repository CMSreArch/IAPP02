import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: "us-east-1" });
const bucketName = "servando"; // <-- cámbialo por el nombre exacto de tu bucket
const json = (statusCode, data) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

export const handler = async (event) => {
  try {
    const method = event.requestContext?.http?.method;
    const fileName = event.queryStringParameters?.fileName;


    if (method === "POST") {
      if (!fileName) return json(400, { message: "Falta el parámetro fileName" });
      const fileContent = event.isBase64Encoded
        ? Buffer.from(event.body ?? "", "base64")
        : Buffer.from(event.body ?? "", "utf-8");
      await s3.send(new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileContent
      }));
      return json(200, { message: `Archivo ${fileName} subido exitosamente` });
    }
    else if (method === "GET") {
      const response = await s3.send(new ListObjectsV2Command({ Bucket: bucketName }));
      const files = (response.Contents ?? []).map(item => item.Key);
      return json(200, { files });
    }

    else if (method === "DELETE") {
      if (!fileName) return json(400, { message: "Falta el parámetro fileName" });
      await s3.send(new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileName
      }));
      return json(200, { message: `Archivo ${fileName} eliminado exitosamente` });
    }

    return json(405, { message: `Método ${method} no permitido` });
  } catch (error) {
    console.error("Error en la ejecución:", error);
    return json(500, { message: "Error interno del servidor", error: error.message });
  }

};
