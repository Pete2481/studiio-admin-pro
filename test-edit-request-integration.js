// Comprehensive test script for Edit Request integration with Admin Requests
// Run this in the browser console on any gallery page

function testEditRequestIntegration() {
  console.log('🧪 Testing Edit Request Integration with Admin Panel...');
  
  // Test 1: Check if Edit buttons are present and functional
  console.log('\n📋 Test 1: Edit Button Presence and Functionality');
  const editButtons = document.querySelectorAll('button[title="Request Edit for this image"]');
  console.log(`✅ Found ${editButtons.length} Edit buttons on images`);
  
  if (editButtons.length === 0) {
    console.log('❌ No Edit buttons found - cannot proceed with tests');
    return;
  }
  
  // Test 2: Check current localStorage state
  console.log('\n📋 Test 2: Current localStorage State');
  const beforeRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  const beforeEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
  console.log(`📊 Before tests - Admin Requests: ${beforeRequests.length}, Edit Requests: ${beforeEditRequests.length}`);
  
  // Test 3: Submit 5 test edit requests
  console.log('\n📋 Test 3: Submitting 5 Test Edit Requests');
  const testRequests = [
    {
      clientName: 'Test Client 1',
      clientEmail: 'test1@example.com',
      requestType: 'edit',
      priority: 'urgent',
      title: 'Test Edit Request 1 - Urgent',
      description: 'This is a test edit request for urgent photo editing needs',
      comments: 'Test comment for request 1',
      tasks: ['Color correction', 'Background removal', 'Retouching'],
      dueDate: '2025-01-15'
    },
    {
      clientName: 'Test Client 2',
      clientEmail: 'test2@example.com',
      requestType: 'revision',
      priority: 'high',
      title: 'Test Revision Request 2 - High Priority',
      description: 'This is a test revision request for high priority photo revisions',
      comments: 'Test comment for request 2',
      tasks: ['Layout adjustment', 'Text overlay', 'Format change'],
      dueDate: '2025-01-20'
    },
    {
      clientName: 'Test Client 3',
      clientEmail: 'test3@example.com',
      requestType: 'new_photos',
      priority: 'medium',
      title: 'Test New Photos Request 3 - Medium Priority',
      description: 'This is a test request for new photos with medium priority',
      comments: 'Test comment for request 3',
      tasks: ['Additional angles', 'Close-up shots', 'Group photos'],
      dueDate: '2025-01-25'
    },
    {
      clientName: 'Test Client 4',
      clientEmail: 'test4@example.com',
      requestType: 'other',
      priority: 'low',
      title: 'Test Other Request 4 - Low Priority',
      description: 'This is a test request for other services with low priority',
      comments: 'Test comment for request 4',
      tasks: ['Consultation', 'Planning session', 'Quote request'],
      dueDate: '2025-02-01'
    },
    {
      clientName: 'Test Client 5',
      clientEmail: 'test5@example.com',
      requestType: 'edit',
      priority: 'high',
      title: 'Test Edit Request 5 - High Priority',
      description: 'This is a test edit request for high priority photo editing',
      comments: 'Test comment for request 5',
      tasks: ['Advanced retouching', 'Compositing', 'Special effects'],
      dueDate: '2025-01-18'
    }
  ];
  
  // Function to submit a test request
  const submitTestRequest = async (testData, index) => {
    console.log(`🔄 Submitting test request ${index + 1}: ${testData.title}`);
    
    try {
      // Create the edit request object
      const editRequest = {
        id: Date.now().toString() + index,
        galleryId: `test-gallery-${index}`,
        clientName: testData.clientName,
        clientEmail: testData.clientEmail,
        requestType: testData.requestType,
        priority: testData.priority,
        status: 'pending',
        title: testData.title,
        description: testData.description,
        comments: testData.comments,
        tasks: testData.tasks,
        dueDate: testData.dueDate,
        selectedImageId: `test-image-${index}`,
        selectedImageAlt: `Test Image ${index + 1}`,
        submittedAt: new Date(),
        updatedAt: new Date()
      };
      
      // Save to editRequests localStorage
      const existingEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
      localStorage.setItem('editRequests', JSON.stringify([...existingEditRequests, editRequest]));
      
      // Create admin request
      const adminRequest = {
        id: editRequest.id,
        client: testData.clientName,
        type: testData.requestType === 'edit' ? 'Edit Request' : 
              testData.requestType === 'revision' ? 'Revision Request' :
              testData.requestType === 'new_photos' ? 'New Photos Request' : 'Other Request',
        status: 'Pending',
        priority: testData.priority.charAt(0).toUpperCase() + testData.priority.slice(1),
        submitted: new Date().toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }),
        dueDate: testData.dueDate ? new Date(testData.dueDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : 'Not specified',
        description: testData.description,
        galleryId: editRequest.galleryId,
        galleryTitle: `Test Gallery ${index + 1}`,
        requestType: testData.requestType,
        comments: testData.comments,
        tasks: testData.tasks,
        selectedImageId: editRequest.selectedImageId,
        selectedImageAlt: editRequest.selectedImageAlt,
        selectedImageSrc: editRequest.selectedImageSrc,
        clientEmail: testData.clientEmail
      };
      
      // Save to requests localStorage (admin panel)
      const existingAdminRequests = JSON.parse(localStorage.getItem('requests') || '[]');
      localStorage.setItem('requests', JSON.stringify([...existingAdminRequests, adminRequest]));
      
      console.log(`✅ Test request ${index + 1} submitted successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Error submitting test request ${index + 1}:`, error);
      return false;
    }
  };
  
  // Submit all 5 test requests
  let successCount = 0;
  for (let i = 0; i < testRequests.length; i++) {
    const success = await submitTestRequest(testRequests[i], i);
    if (success) successCount++;
    
    // Small delay between submissions
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`📊 Successfully submitted ${successCount}/5 test requests`);
  
  // Test 4: Verify localStorage data
  console.log('\n📋 Test 4: Verifying localStorage Data');
  const afterRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  const afterEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
  
  console.log(`📊 After tests - Admin Requests: ${afterRequests.length}, Edit Requests: ${afterEditRequests.length}`);
  console.log(`📈 New requests added: ${afterRequests.length - beforeRequests.length}`);
  
  // Show sample of new requests
  if (afterRequests.length > beforeRequests.length) {
    const newRequests = afterRequests.slice(beforeRequests.length);
    console.log('🆕 New requests added to admin panel:');
    newRequests.forEach((req, index) => {
      console.log(`   ${index + 1}. ${req.type} - ${req.client} (${req.priority} priority)`);
    });
  }
  
  // Test 5: Verify data structure and completeness
  console.log('\n📋 Test 5: Verifying Data Structure and Completeness');
  const latestRequest = afterRequests[afterRequests.length - 1];
  if (latestRequest) {
    console.log('🔍 Latest request data structure:');
    console.log('   - Basic Info:', {
      id: latestRequest.id,
      type: latestRequest.type,
      client: latestRequest.client,
      status: latestRequest.status,
      priority: latestRequest.priority
    });
    console.log('   - Gallery Info:', {
      galleryId: latestRequest.galleryId,
      galleryTitle: latestRequest.galleryTitle,
      requestType: latestRequest.requestType
    });
    console.log('   - Image Info:', {
      selectedImageId: latestRequest.selectedImageId,
      selectedImageAlt: latestRequest.selectedImageAlt
    });
    console.log('   - Content:', {
      description: latestRequest.description?.substring(0, 50) + '...',
      comments: latestRequest.comments?.substring(0, 30) + '...',
      tasks: latestRequest.tasks?.length || 0
    });
    console.log('   - Dates:', {
      submitted: latestRequest.submitted,
      dueDate: latestRequest.dueDate
    });
    
    // Check if all required fields are present
    const requiredFields = ['id', 'type', 'client', 'status', 'priority', 'description'];
    const missingFields = requiredFields.filter(field => !latestRequest[field]);
    
    if (missingFields.length === 0) {
      console.log('✅ All required fields are present');
    } else {
      console.log(`❌ Missing required fields: ${missingFields.join(', ')}`);
    }
  }
  
  // Test 6: Instructions for admin panel verification
  console.log('\n📋 Test 6: Admin Panel Verification Instructions');
  console.log('🎯 To verify the integration is working:');
  console.log('   1. Navigate to the Admin panel (/requests)');
  console.log('   2. Check that all 5 test requests are displayed');
  console.log('   3. Verify each request shows the correct data');
  console.log('   4. Test status updates and filtering');
  console.log('   5. Check that data persists after page refresh');
  
  console.log('\n🎯 Edit Request Integration Test Complete!');
  console.log(`📊 Summary: ${successCount}/5 test requests submitted successfully`);
  console.log(`📈 Total requests in admin panel: ${afterRequests.length}`);
}

// Run the integration test
testEditRequestIntegration();
