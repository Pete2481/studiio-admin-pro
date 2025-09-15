export default function BasicTestPage() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Basic Test Page</h1>
      <p>If you can see this, the page is working!</p>
      <p>Time: {new Date().toISOString()}</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
        <h3>System Status:</h3>
        <ul>
          <li>✅ Next.js Server: Running</li>
          <li>✅ React Components: Working</li>
          <li>✅ Page Rendering: Success</li>
        </ul>
      </div>
    </div>
  );
}

