<?php

namespace App\Services;

use App\Models\Order;
use Illuminate\Support\Facades\Storage;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Str;

class PDFService
{
    /**
     * Genera un PDF de la boleta de compra para la orden especificada
     * 
     * @param Order $order La orden para la que se generará la boleta
     * @return string La ruta relativa del archivo PDF generado (para storage)
     */
    public function generateReceiptPDF(Order $order): string
    {
        $pdf = PDF::loadView('pdf.boleta', ['order' => $order]);
        
        // Definir ruta relativa al disco "public"
        $relativePath = 'pdf/receipts';
        
        // Asegurar que el directorio existe
        Storage::disk('public')->makeDirectory($relativePath);
        
        // Generar un nombre único para el PDF
        $fileName = 'boleta_' . $order->id . '_' . Str::random(8) . '.pdf';
        $fullRelativePath = $relativePath . '/' . $fileName;
        
        // Guardar el PDF usando Storage
        Storage::disk('public')->put(
            $fullRelativePath, 
            $pdf->output()
        );
        
        // Devolver la ruta relativa para guardar en la base de datos
        return $fullRelativePath;
    }
}
