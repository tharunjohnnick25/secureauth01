import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class GoogleAuthService {
  final FirebaseAuth _auth = FirebaseAuth.instance;
  final GoogleSignIn _googleSignIn = GoogleSignIn(
    scopes: ['email', 'profile'],
  );
  final _secureStorage = const FlutterSecureStorage();

  // The base address of your Express.js API
  final String backendUrl = "https://api.secureauth.com/api/auth/google";

  // Check if session token exists in Secure Storage for Auto-Login
  Future<bool> checkAutoLogin() async {
    String? token = await _secureStorage.read(key: "auth_token");
    return token != null;
  }

  // Native Google Sign-In trigger for Android
  Future<UserCredential?> signInWithGoogle(BuildContext context) async {
    try {
      // 1. Trigger the native Google Account Picker popup
      final GoogleSignInAccount? googleUser = await _googleSignIn.signIn();
      if (googleUser == null) return null; // Flow cancelled by user

      // 2. Obtain OAuth authentication details from the selected Google account
      final GoogleSignInAuthentication googleAuth = await googleUser.authentication;

      // 3. Create a credential object mapping to Firebase Auth credentials
      final AuthCredential credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      // 4. Authenticate the user against Firebase Auth
      final UserCredential userCredential = await _auth.signInWithCredential(credential);
      final User? firebaseUser = userCredential.user;

      if (firebaseUser != null) {
        // 5. Retrieve Firebase's secure ID token (JWT)
        final String? idToken = await firebaseUser.getIdToken();

        if (idToken != null) {
          // 6. Call the Express backend to verify the token and get a session token
          final response = await http.post(
            Uri.parse(backendUrl),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({'token': idToken}),
          );

          if (response.statusCode == 200) {
            final Map<String, dynamic> data = jsonDecode(response.body);
            
            // 7. Store the verified JWT session key in KeyStore (Android) / Keychain (iOS)
            await _secureStorage.write(key: "auth_token", value: data['jwtToken']);
            await _secureStorage.write(key: "user_name", value: firebaseUser.displayName ?? "");
            await _secureStorage.write(key: "user_avatar", value: firebaseUser.photoURL ?? "");

            return userCredential;
          } else {
            throw Exception("Backend token validation failed.");
          }
        }
      }
    } catch (e) {
      debugPrint("Flutter Google Sign-In Error: $e");
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text("Authentication Failed: ${e.toString()}"),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
    return null;
  }

  // Logout method revoking Google & Firebase sessions
  Future<void> signOut() async {
    await _googleSignIn.signOut();
    await _auth.signOut();
    await _secureStorage.delete(key: "auth_token");
    await _secureStorage.delete(key: "user_name");
    await _secureStorage.delete(key: "user_avatar");
  }
}

// Google Sign-In Button widget styled with SecureAuth's neon aesthetic
class GoogleSignInButton extends StatefulWidget {
  const GoogleSignInButton({Key? key}) : super(key: key);

  @override
  State<GoogleSignInButton> createState() => _GoogleSignInButtonState();
}

class _GoogleSignInButtonState extends State<GoogleSignInButton> {
  bool _isLoading = false;
  final GoogleAuthService _authService = GoogleAuthService();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        boxShadow: [
          BoxShadow(
            color: Colors.blueAccent.withOpacity(0.15),
            blurRadius: 20,
            spreadRadius: 2,
          )
        ],
      ),
      child: OutlinedButton(
        onPressed: _isLoading ? null : () async {
          setState(() {
            _isLoading = true;
          });
          UserCredential? creds = await _authService.signInWithGoogle(context);
          setState(() {
            _isLoading = false;
          });
          if (creds != null) {
            // Navigate to main application page / Dashboard
            Navigator.pushReplacementNamed(context, '/dashboard');
          }
        },
        style: OutlinedButton.styleFrom(
          backgroundColor: const Color(0xFF0F172A),
          side: const BorderSide(color: Color(0xFF1E293B), width: 1.5),
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (_isLoading)
              const SizedBox(
                width: 20,
                height: 20,
                child: CircularProgressIndicator(
                  strokeWidth: 2,
                  valueColor: AlwaysStoppedAnimation<Color>(Colors.blueAccent),
                ),
              )
            else
              Image.network(
                "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_logo.svg",
                width: 20,
                height: 20,
                errorBuilder: (context, error, stackTrace) => const Icon(
                  Icons.g_mobiledata,
                  color: Colors.white,
                  size: 20,
                ),
              ),
            const SizedBox(width: 12),
            Text(
              _isLoading ? "Verifying..." : "Continue with Google",
              style: const TextStyle(
                color: Colors.white,
                fontSize: 16,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
