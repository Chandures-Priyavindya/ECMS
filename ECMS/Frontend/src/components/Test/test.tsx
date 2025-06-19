function Test() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-200">
      <div className="p-8 rounded-lg bg-white shadow-md w-full max-w-sm">
        <h1 className="text-center text-2xl font-bold mb-6">Login</h1>
        <form>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Username:</label>
            <input
              type="text"
              name="username"
              placeholder="Enter username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Password:</label>
            <input
              type="password"
              name="password"
              placeholder="Enter password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Test;
