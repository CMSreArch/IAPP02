import json
import os
import boto3

# Inicializar el cliente de SNS
sns_client = boto3.client('sns')
SNS_TOPIC_ARN = os.environ['SNS_TOPIC_ARN']

def lambda_handler(event, context):
    # Extraer los datos del evento enviado por EventBridge
    detail = event.get('detail', {})
    instance_id = detail.get('instance-id', 'Desconocido')
    state = detail.get('state', 'Desconocido')
    
    # Crear el mensaje de correo personalizado
    mensaje = (
        f"🚨 ALERTA DE AWS ACADEMY 🚨\n\n"
        f"La instancia EC2 con ID '{instance_id}' "
        f"ha cambiado de estado a: [{state.upper()}].\n\n"
        f"Por favor, revisa tu consola de AWS."
    )
    
    # Enviar el correo por SNS
    response = sns_client.publish(
        TopicArn=SNS_TOPIC_ARN,
        Message=mensaje,
        Subject='⚠️ Alerta: Instancia EC2 Detenida'
    )
    
    print(f"Notificación enviada con éxito para la instancia {instance_id}")
    
    return {
        'statusCode': 200,
        'body': json.dumps('Notificación procesada con éxito')
    }
