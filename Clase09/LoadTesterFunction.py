import json
import boto3
import time
from concurrent.futures import ThreadPoolExecutor

# Cliente para invocar funciones Lambda
lambda_client = boto3.client('lambda')

def invoke_lambda(payload):
    response = lambda_client.invoke(
        FunctionName='ScalableFunction',
        InvocationType='RequestResponse',  # Puedes usar 'Event' para invocaciones asin-crónicas
        Payload=json.dumps(payload)
    )
    return response

def lambda_handler(event, context):
    # Número de invocaciones paralelas
    num_invocations = event.get('num_invocations', 10)

    # Simular carga usando múltiples invocaciones en paralelo
    with ThreadPoolExecutor(max_workers=num_invocations) as executor:
        futures = [executor.submit(invoke_lambda, {}) for _ in range(num_invocations)]
        results = [future.result() for future in futures]

    return {
        'statusCode': 200,
        'body': json.dumps({
            'message': f'Invoked ScalableFunction {num_invocations} times',
            'results': [json.loads(res['Payload'].read()) for res in results]
        })
    }
