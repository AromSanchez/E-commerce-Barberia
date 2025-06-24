<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Boleta de Compra</title>
    <style>
        body {
            font-family: 'DejaVu Sans', sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f9f9f9;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #2c3e50;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }

        .header h2 {
            margin: 0;
            color: #2c3e50;
            font-size: 22px;
        }

        .header p {
            font-size: 14px;
            color: #555;
        }

        .info-cliente {
            margin-bottom: 25px;
        }

        .info-cliente p {
            margin: 5px 0;
            font-size: 14px;
            color: #444;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        th {
            background-color: #ecf0f1;
            color: #2c3e50;
            font-weight: bold;
            padding: 10px;
            text-align: left;
        }

        td {
            border: 1px solid #ccc;
            padding: 10px;
            text-align: right;
        }

        td:first-child {
            text-align: left;
        }

        .totales {
            text-align: right;
            font-size: 16px;
            font-weight: bold;
            margin-top: 20px;
            color: #2c3e50;
        }

        .footer {
            border-top: 1px solid #ccc;
            margin-top: 25px;
            padding-top: 15px;
            text-align: center;
            font-size: 12px;
            color: #777;
        }

        .footer p {
            margin: 5px 0;
        }

        .total {
            font-size: 18px;
            color: #e74c3c;
        }
    </style>
</head>
<body>

    <div class="header">
        <h2>Boleta de Compra</h2>
        <p><strong>N° de Orden:</strong> {{ $order->order_number }}</p>
    </div>

    <div class="info-cliente">
        <p><strong>Cliente:</strong> {{ $order->customer_name }}</p>
        <p><strong>Teléfono:</strong> {{ $order->customer_phone }}</p>
        <p><strong>Dirección:</strong> {{ $order->shipping_address }}</p>
        <p><strong>Fecha:</strong> {{ $order->created_at->format('d/m/Y H:i') }}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio Unitario</th>
                <th>Subtotal</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($order->items as $item)
                <tr>
                    <td>{{ $item->product->name }}</td>
                    <td>{{ $item->quantity }}</td>
                    <td>S/ {{ number_format($item->price, 2) }}</td>
                    <td>S/ {{ number_format($item->quantity * $item->price, 2) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="totales">
        <p><strong>Total a pagar: <span class="total">S/ {{ number_format($order->total_amount, 2) }}</span></strong></p>
    </div>

    <div class="footer">
        <p>Gracias por tu compra. Para cualquier consulta, comunícate con nosotros.</p>
        <p>¡Nos encantaría volver a verte pronto!</p>
    </div>

</body>
</html>