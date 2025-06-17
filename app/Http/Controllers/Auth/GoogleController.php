<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite; // ✅ correcta
use App\Models\User;

class GoogleController extends Controller
{
    public function redirect()
    {
        return Socialite::driver('google')->redirect();
    }

    public function callback()
    {
        try {
            logger('Entró al callback');

            $googleUser = Socialite::driver('google')->stateless()->user();

            logger('Usuario de Google:', [
                'email' => $googleUser->getEmail(),
                'name' => $googleUser->getName(),
            ]);

            // Separar el nombre completo en nombre y apellido
            $fullName = $googleUser->getName();
            $nameParts = explode(' ', $fullName);
            $firstName = $nameParts[0];
            $lastName = count($nameParts) > 1 ? implode(' ', array_slice($nameParts, 1)) : null;

            $user = User::firstOrCreate(
                ['email' => $googleUser->getEmail()],
                [
                    'name' => $firstName,
                    'last_name' => $lastName,
                    'phone_number' => null,
                    'role' => 'user',
                    'password' => bcrypt(str()->random(24)),
                    'email_verified_at' => now(),
                ]
            );

            logger('Usuario guardado o encontrado:', ['id' => $user->id]);

            Auth::login($user);

            return redirect()->intended('/');
        } catch (\Exception $e) {
            logger('Error en callback de Google', ['error' => $e->getMessage()]);
            return redirect('/login')->withErrors('Error al autenticar con Google.');
        }
    }
}
