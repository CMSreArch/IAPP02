import json
import time

def lambda_handler(event, context):
    # Simulando una operación que toma tiempo
    time.sleep(2)  # Simula un proceso que toma 2 segundos
    
    return {
        'statusCode': 200,
        'body': json.dumps('Function executed successfully!')
    }
