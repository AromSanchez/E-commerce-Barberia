<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::all();
        return Inertia::render('DashAdmin/DashCoupon', ['coupons' => $coupons]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code|max:255',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'min_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
        ]);

        Coupon::create($request->all());

        return redirect()->route('dashboard.coupon')->with('success', 'Cupón creado exitosamente.');
    }

    public function update(Request $request, Coupon $coupon)
    {
        $request->validate([
            'code' => 'required|string|unique:coupons,code,' . $coupon->id . '|max:255',
            'type' => 'required|in:fixed,percentage',
            'value' => 'required|numeric|min:0',
            'min_amount' => 'nullable|numeric|min:0',
            'usage_limit' => 'nullable|integer|min:1',
            'expires_at' => 'nullable|date|after_or_equal:today',
            'is_active' => 'boolean',
        ]);

        $coupon->update($request->all());

        return redirect()->route('dashboard.coupon')->with('success', 'Cupón actualizado exitosamente.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('dashboard.coupon')->with('success', 'Cupón eliminado exitosamente.');
    }
}