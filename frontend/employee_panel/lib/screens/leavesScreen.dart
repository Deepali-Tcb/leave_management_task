import 'package:flutter/material.dart';
import '../widgets/appDrawer.dart';

class LeavesScreen extends StatelessWidget {
  const LeavesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text("Leaves"),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          "Leaves Screen",
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}