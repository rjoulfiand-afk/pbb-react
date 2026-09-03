import 'dart:ui';
import 'package:flutter/material.dart';

void main() {
  runApp(const HioStatsApp());
}

class HioStatsApp extends StatelessWidget {
  const HioStatsApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'HIO STATSDAY - VIP',
      theme: ThemeData(
        scaffoldBackgroundColor: Colors.transparent,
        fontFamily: 'Roboto', 
      ),
      home: const ExecutivePortalScreen(),
    );
  }
}

class ExecutivePortalScreen extends StatelessWidget {
  const ExecutivePortalScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // Gradient Background utama
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFf5f7fa),
              Color(0xFFc3cfe2),
              Color(0xFFe0c3fc),
              Color(0xFF8ec5fc),
            ],
          ),
        ),
        child: Stack(
          children: [
            // Blob 1 (Kanan Bawah)
            Positioned(
              bottom: -50,
              right: -50,
              child: Container(
                width: 300,
                height: 300,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0x998ec5fc),
                ),
              ).blurred(sigma: 80),
            ),
            Positioned(
              top: -50,
              left: -50,
              child: Container(
                width: 250,
                height: 250,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  color: Color(0x99e0c3fc),
                ),
              ).blurred(sigma: 80),
            ),
            Center(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 40),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(40),
                  child: BackdropFilter(
                    filter: ImageFilter.blur(sigmaX: 35, sigmaY: 35),
                    child: Container(
                      width: double.infinity,
                      maxWidth: 440,
                      padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 45),
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.45),
                        borderRadius: BorderRadius.circular(40),
                        border: Border.all(color: Colors.white.withOpacity(0.8), width: 1.5),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFFa2abbd).withOpacity(0.3),
                            blurRadius: 60,
                            offset: const Offset(0, 30),
                          ),
                        ],
                      ),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          // Avatar Profile
                          Container(
                            width: 115,
                            height: 115,
                            padding: const EdgeInsets.all(5),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              gradient: const LinearGradient(
                                colors: [Colors.white, Color(0xFFf1f5f9)],
                              ),
                              boxShadow: [
                                BoxShadow(
                                  color: const Color(0xFFa1c4fd).withOpacity(0.5),
                                  blurRadius: 35,
                                  offset: const Offset(0, 15),
                                ),
                              ],
                            ),
                            child: const CircleAvatar(
                              backgroundImage: AssetImage('assets/hio.jpg'), // Path gambar lo
                              backgroundColor: Colors.white,
                            ),
                          ),
                          const SizedBox(height: 15),
                          
                          // Typography
                          const Text(
                            'HIO STATSDAY',
                            style: TextStyle(
                              fontFamily: 'serif', // Pengganti Playfair Display sementara
                              fontSize: 28,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFF1e293b),
                              letterSpacing: 0.5,
                            ),
                          ),
                          const SizedBox(height: 5),
                          const Text(
                            'EXECUTIVE PORTAL',
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: Color(0xFF64748b),
                              letterSpacing: 2.0,
                            ),
                          ),
                          const SizedBox(height: 40),

                          // Menu Cards
                          _buildMenuCard(context, 'Top Management', 'Struktur organisasi utama', Icons.account_tree, false),
                          const SizedBox(height: 16),
                          _buildMenuCard(context, 'Daftar', 'Registrasi dan pendaftaran', Icons.assignment, true),
                          const SizedBox(height: 16),
                          _buildMenuCard(context, 'Pemasukan', 'Data keuangan Tiap Devisi', Icons.account_balance_wallet, false),
                          const SizedBox(height: 16),
                          _buildMenuCard(context, 'Laporan', 'Rekapitulasi data & statistik', Icons.insert_drive_file, false),
                          const SizedBox(height: 16),
                          _buildMenuCard(context, 'Cuti & Izin', 'Boarding pass istirahat', Icons.flight_takeoff, false),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Fungsi pembuat Kartu Menu Estetik
  Widget _buildMenuCard(BuildContext context, String title, String desc, IconData icon, bool isVvip) {
    return InkWell(
      onTap: () {
        // Logika klik nanti taruh sini bro
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Menuju ke $title...')));
      },
      borderRadius: BorderRadius.circular(22),
      child: Stack(
        clipBehavior: Clip.none,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 18),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.65),
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: Colors.white.withOpacity(0.9)),
              boxShadow: [
                BoxShadow(color: Colors.black.withOpacity(0.03), blurRadius: 20, offset: const Offset(0, 8)),
              ],
            ),
            child: Row(
              children: [
                // Icon Box
                Container(
                  width: 50,
                  height: 50,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(16),
                    gradient: const LinearGradient(
                      colors: [Color(0xFFa1c4fd), Color(0xFFc2e9fb)],
                    ),
                    boxShadow: [
                      BoxShadow(color: const Color(0xFFa1c4fd).withOpacity(0.4), blurRadius: 15, offset: const Offset(0, 8)),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 18),
                
                // Text Box
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1e293b))),
                      const SizedBox(height: 3),
                      Text(desc, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF64748b))),
                    ],
                  ),
                ),
                
                // Arrow
                const Icon(Icons.chevron_right, color: Color(0xFFcbd5e0)),
              ],
            ),
          ),

          // Label VVIP
          if (isVvip)
            Positioned(
              top: -8,
              right: 15,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFFff9a9e), Color(0xFFfecfef)]),
                  borderRadius: BorderRadius.circular(20),
                  boxShadow: [
                    BoxShadow(color: const Color(0xFFff9a9e).withOpacity(0.5), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: const Text('VVIP', style: TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 0.8)),
              ),
            ),
        ],
      ),
    );
  }
}

// Extension biar gampang bikin efek blur kayak di CSS
extension BlurExtension on Widget {
  Widget blurred({double sigma = 10.0}) {
    return ImageFilterWidget(sigma: sigma, child: this);
  }
}

class ImageFilterWidget extends StatelessWidget {
  final double sigma;
  final Widget child;
  const ImageFilterWidget({super.key, required this.sigma, required this.child});

  @override
  Widget build(BuildContext context) {
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: sigma, sigmaY: sigma),
      child: child,
    );
  }
}