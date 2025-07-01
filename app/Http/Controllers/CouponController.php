<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index()
    {
        $coupons = Coupon::with(['brands', 'categories'])->get();
        $brands = Brand::select('id', 'name')->get();
        $categories = Category::select('id', 'name')->get();
        
        return Inertia::render('DashAdmin/DashCoupon', [
            'coupons' => $coupons,
            'brands' => $brands,
            'categories' => $categories,
        ]);
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
            'brand_ids' => 'nullable|array',
            'brand_ids.*' => 'exists:brands,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:category,id',
        ]);

        $coupon = Coupon::create($request->except(['brand_ids', 'category_ids']));
        
        // Sincronizar relaciones con marcas y categorías
        if ($request->has('brand_ids') && is_array($request->brand_ids)) {
            $coupon->brands()->sync($request->brand_ids);
        }
        
        if ($request->has('category_ids') && is_array($request->category_ids)) {
            $coupon->categories()->sync($request->category_ids);
        }

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
            'brand_ids' => 'nullable|array',
            'brand_ids.*' => 'exists:brands,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:category,id',
        ]);

        $coupon->update($request->except(['brand_ids', 'category_ids']));
        
        // Sincronizar relaciones con marcas y categorías
        if ($request->has('brand_ids')) {
            $coupon->brands()->sync($request->brand_ids ?? []);
        }
        
        if ($request->has('category_ids')) {
            $coupon->categories()->sync($request->category_ids ?? []);
        }

        return redirect()->route('dashboard.coupon')->with('success', 'Cupón actualizado exitosamente.');
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();

        return redirect()->route('dashboard.coupon')->with('success', 'Cupón eliminado exitosamente.');
    }
}