<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        .logo {
            max-width: 150px;
            margin-bottom: 10px;
        }
        h1 {
            color: #333;
            font-size: 24px;
            margin: 0;
        }
        .details {
            margin-bottom: 20px;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        .btn {
            display: inline-block;
            background-color: #000;
            color: #fff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>¡Gracias por tu compra!</h1>
    </div>

    <div class="content">
        <p>Hola <strong>{{ $order->customer_name }}</strong>,</p>
        
        <p>Hemos recibido tu pedido correctamente. Adjunto encontrarás la boleta de tu compra con todos los detalles.</p>
        
        <div class="details">
            <p><strong>Número de orden:</strong> {{ $order->id }}</p>
            <p><strong>Fecha:</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
            <p><strong>Total:</strong> S/ {{ number_format($order->total_amount, 2) }}</p>
        </div>
        
        <p>Si tienes alguna pregunta o necesitas asistencia, no dudes en contactarnos.</p>
        
        <p>¡Esperamos verte pronto!</p>
    </div>

    <div class="footer">
        <p>© {{ date('Y') }} Barber Shop | Todos los derechos reservados</p>
    </div>
</body>
</html>
