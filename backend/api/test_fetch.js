async function main() {
  const loginRes = await fetch("http://localhost:3000/api/v1/auth/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "admin@sne.vn", password: "Admin@123" })
  });
  const loginData = await loginRes.json();
  console.log("Login:", loginRes.status, loginData);

  if (!loginData.data?.accessToken) return;

  const classesRes = await fetch("http://localhost:3000/api/v1/admin/classes", {
    headers: { "Authorization": `Bearer ${loginData.data.accessToken}` }
  });
  console.log("Classes:", classesRes.status, await classesRes.json());
}
main();
