import 'package:flutter/material.dart';
import '../widgets/appDrawer.dart';

class ApplyLeaveFormScreen extends StatelessWidget {
  const ApplyLeaveFormScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: const AppDrawer(),
      appBar: AppBar(
        title: const Text("Apply Leave"),
        centerTitle: true,
      ),
      body: const Center(
        child: Text(
          "Apply Leave Form Screen",
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}