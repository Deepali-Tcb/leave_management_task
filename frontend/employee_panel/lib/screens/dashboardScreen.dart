import 'package:flutter/material.dart';
import '../widgets/appDrawer.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer:AppDrawer(),
      appBar: AppBar(
        title: const Text("Employee Dashboard"),
      ),
      body: const Center(
        child: Text(
          "Dashboard Screen",
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}