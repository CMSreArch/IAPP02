# Crear una EC2 por defecto para validar la ejecucion de esta funcion


## Paso 1: Crear el Tema en Amazon SNS 

Primero creamos el canal de comunicación que enviará las alertas por correo electrónico.
1. Abre la consola de AWS desde tu entorno de AWS Academy.
2. Ve a la barra de búsqueda superior, escribe SNS y selecciona Simple Notification Service.
3. En el panel izquierdo, haz clic en Temas (Topics) y luego en el botón Crear un tema.
4. Selecciona el tipo Estándar.
5. En el campo Nombre, escribe: Alerta-EC2-Detenida. Deja el resto por defecto y haz clic abajo en Crear el tema.
6. Crear Suscripción: Dentro de la pantalla del tema que acabas de crear, haz clic en el botón Crear suscripción.
    • ARN del tema: Seleccionar el recien creado tema (arn:aws:sns.....Alerta-EC2-Detenida)
	• Protocolo: Selecciona Correo electrónico.
	• Endpoint (Punto de enlace): Escribe el correo electrónico (puede ser el institucional o personal) donde deseas recibir las alertas.
	• Haz clic en Crear suscripción.

7. Copia y guarda el ARN del tema (un texto largo que empieza por arn:aws:sns:...).





## Paso 2: Crear la Función AWS Lambda (Usando LabRole) 

Aquí vive el código que procesará el evento. Conectaremos la Lambda directamente al rol del laboratorio.
1. En la barra de búsqueda de AWS, escribe Lambda y selecciónalo.
2. Haz clic en el botón Crear una función.
3. Selecciona la opción Crear desde cero.
4. Configura los siguientes campos:
	• Nombre de la función: NotificarEC2Detenida
	• Tiempo de ejecución (Runtime): Selecciona Python 3.14 (o la versión de Python 3 más reciente disponible).
5. Configuración del Rol (Crucial en AWS Academy):
	• Despliega la sección Cambiar el rol de ejecución predeterminado.
	• Selecciona la opción Utilizar un rol existente.
	• En el menú desplegable de Rol existente, busca y selecciona LabRole.

6. Haz clic en el botón Crear una función.



## Paso 3: Configurar y Desplegar el Código de Lambda 

1. Configurar la Variable de Entorno:
	• Dentro de tu nueva función Lambda, ve a la pestaña superior Configuración > menú izquierdo Variables de entorno y haz clic en Editar.
	• Haz clic en Añadir variable de entorno.
	• Clave (Key): SNS_TOPIC_ARN
	• Valor (Value): Pega el ARN del tema de SNS que copiaste en el Paso 1.
    arn:aws:sns:us-east-1:343067124289:Alerta-EC2-Detenida
	• Haz clic en Guardar.
2. Escribir el código:
	• Regresa a la pestaña superior Código.
	• En el editor integrado, haz doble clic en lambda_function.py, borra todo su contenido y pega este código:

   Usar codigo lambda02.py 

3. Haz clic en el botón Deploy (color naranja) para guardar y activar los cambios del código.

## Paso 4: Crear la Regla en Amazon EventBridge

Esta regla detectará de forma automática cuándo se apaga una EC2 y despertará a la Lambda.
1. En la barra de búsqueda de AWS, escribe EventBridge y selecciónalo.
2. En el panel izquierdo, ve a Buses de eventos 
3. Elegir bus de eventos "default"
4. Presionar en "Crear regla"
3. Paso 1 del asistente (Definir detalle de regla):
   Presionar en "Configurar" para arreglar el nombre de la regla
	• Nombre: Detectar-EC2-Detenida

    Volver a "Crear"
    • Seleccionar EC2 del listado y arrastrarlo a Eventos Desencadenantes (EC2 Instance State-change Notification)
    • En la Opcion "Destino" arrastrar "Funcion Lambda"
    • En los detalles de "Destino":
          Funcion : Seleccionar NotificarEC2Detenida
          Rol de Ejecucion: Seleccionar LabRole
    Presionar Crear

