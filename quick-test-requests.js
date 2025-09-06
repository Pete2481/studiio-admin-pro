// Quick test script to verify requests are showing in admin panel
// Run this in the browser console on the /requests page

function quickTestRequests() {
  console.log('🧪 Quick Test: Verifying Requests in Admin Panel...');
  
  // Check if we're on the requests page
  if (!window.location.pathname.includes('/requests')) {
    console.log('❌ Not on requests page. Navigate to /requests first.');
    return;
  }
  
  // Check localStorage for requests
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const editRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
  
  console.log(`📊 Found ${requests.length} requests in admin panel`);
  console.log(`📊 Found ${editRequests.length} edit requests`);
  
  if (requests.length === 0) {
    console.log('❌ No requests found in admin panel');
    return;
  }
  
  // Show sample requests
  console.log('\n📋 Sample Requests:');
  requests.slice(0, 3).forEach((req, index) => {
    console.log(`${index + 1}. ${req.type || 'Unknown Type'} - ${req.client || 'Unknown Client'}`);
    console.log(`   Status: ${req.status || 'Unknown'}`);
    console.log(`   Priority: ${req.priority || 'Unknown'}`);
    console.log(`   Gallery: ${req.galleryTitle || 'N/A'}`);
    console.log(`   Image: ${req.selectedImageAlt || 'N/A'}`);
    console.log(`   Tasks: ${req.tasks?.length || 0} tasks`);
    console.log('   ---');
  });
  
  // Check for pending requests
  const pendingRequests = requests.filter(r => r.status === 'Pending');
  console.log(`\n⏳ Pending Requests: ${pendingRequests.length}`);
  
  // Check for different request types
  const requestTypes = {};
  requests.forEach(req => {
    const type = req.type || 'Unknown';
    requestTypes[type] = (requestTypes[type] || 0) + 1;
  });
  
  console.log('\n📊 Request Types:');
  Object.entries(requestTypes).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`);
  });
  
  // Check if requests table is populated
  const tableRows = document.querySelectorAll('tbody tr');
  console.log(`\n📋 Table Rows: ${tableRows.length} (should match request count)`);
  
  if (tableRows.length > 0) {
    console.log('✅ Requests table is populated');
    
    // Check first row for data
    const firstRow = tableRows[0];
    const title = firstRow.querySelector('td:first-child p:first-child')?.textContent;
    const client = firstRow.querySelector('td:nth-child(2) p:first-child')?.textContent;
    const status = firstRow.querySelector('td:nth-child(3) span')?.textContent;
    
    console.log('🔍 First row data:');
    console.log(`   Title: ${title}`);
    console.log(`   Client: ${client}`);
    console.log(`   Status: ${status}`);
  } else {
    console.log('❌ Requests table is empty');
  }
  
  console.log('\n🎯 Quick Test Complete!');
}

// Run the quick test
quickTestRequests();


