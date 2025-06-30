<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RefundRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RefundRequestController extends Controller
{
    public function index()
    {
        $refundRequests = RefundRequest::with(['order.user'])
            ->latest('created_at')
            ->get();

        return Inertia::render('DashAdmin/DashRequests/DashRequest', [
            'refundRequests' => $refundRequests
        ]);
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'order_id' => 'required|exists:orders,id',
            'reason' => 'required|string|max:255',
            'user_comment' => 'nullable|string|max:1000',
        ]);

        RefundRequest::create([
            'order_id' => $validated['order_id'],
            'reason' => $validated['reason'],
            'user_comment' => $validated['user_comment'] ?? null,
            'status' => 'pendiente',
        ]);

        return redirect()->back()->with('success', 'Solicitud de reembolso enviada correctamente.');
    }

    public function updateStatus(Request $request, RefundRequest $refundRequest)
    {
        $request->validate([
            'action' => 'required|in:aprobar,rechazar',
            'admin_response' => 'nullable|string|max:1000',
        ]);

        $refundRequest->update([
            'status' => $request->action === 'aprobar' ? 'aprobado' : 'rechazado',
            'admin_response' => $request->admin_response,
            'processed_at' => now(),
        ]);
        // Si se aprueba, también cancela el pedido
        if ($request->action === 'aprobar') {
            $refundRequest->order->update([
                'order_status' => 'cancelado',
            ]);
        }

        return back()->with('success', 'Solicitud de reembolso actualizada.');
    }
}
