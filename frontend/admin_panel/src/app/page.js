export default function Home() {
  const employees = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      department: "IT",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@gmail.com",
      department: "HR",
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Kumar",
      email: "amit@gmail.com",
      department: "Finance",
      status: "Inactive",
    },
  ];

  const leaveRequests = [
    {
      id: 101,
      employee: "Rahul Sharma",
      type: "Casual Leave",
      from: "02 Aug 2026",
      to: "04 Aug 2026",
      reason: "Family Function",
      status: "Pending",
    },
    {
      id: 102,
      employee: "Priya Singh",
      type: "Sick Leave",
      from: "05 Aug 2026",
      to: "06 Aug 2026",
      reason: "Fever",
      status: "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Heading */}
      <h1 className="text-4xl font-bold text-slate-800 text-center mb-10">
        Leave Management Admin Panel
      </h1>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-600">
            Total Employees
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-3">
            {employees.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-600">
            Pending Requests
          </h2>
          <p className="text-4xl font-bold text-yellow-600 mt-3">
            {leaveRequests.length}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-slate-600">
            Approved Today
          </h2>
          <p className="text-4xl font-bold text-green-600 mt-3">5</p>
        </div>
      </div>

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-10">
        <h2 className="text-2xl font-bold text-slate-800 p-6 border-b">
          Employees
        </h2>

        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Department</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="text-center border-b hover:bg-slate-50 text-black"
              >
                <td className="p-4">{emp.id}</td>
                <td className="p-4">{emp.name}</td>
                <td className="p-4">{emp.email}</td>
                <td className="p-4">{emp.department}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      emp.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Requests */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold text-slate-800 p-6 border-b">
          Leave Requests
        </h2>

        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-4">Employee</th>
              <th className="p-4">Leave Type</th>
              <th className="p-4">From</th>
              <th className="p-4">To</th>
              <th className="p-4">Reason</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>

          <tbody>
            {leaveRequests.map((leave) => (
              <tr
                key={leave.id}
                className="text-center border-b hover:bg-slate-50 text-black"
              >
                <td className="p-4">{leave.employee}</td>
                <td className="p-4">{leave.type}</td>
                <td className="p-4">{leave.from}</td>
                <td className="p-4">{leave.to}</td>
                <td className="p-4">{leave.reason}</td>

                <td className="p-4">
                  <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                    {leave.status}
                  </span>
                </td>

                <td className="p-4 space-x-2">
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition">
                    Accept
                  </button>

                  <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}