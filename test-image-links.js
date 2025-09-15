// Test script for Image Link functionality in Edit Requests
// Run this in the browser console on any gallery page

function testImageLinks() {
  console.log('🧪 Testing Image Link Functionality...');
  
  // Check if Edit buttons are present
  const editButtons = document.querySelectorAll('button[title="Request Edit for this image"]');
  console.log(`✅ Found ${editButtons.length} Edit buttons on images`);
  
  if (editButtons.length === 0) {
    console.log('❌ No Edit buttons found - cannot test image links');
    return;
  }
  
  // Get the first image and its data
  const firstImage = document.querySelector('.group.relative img');
  if (!firstImage) {
    console.log('❌ No images found to test');
    return;
  }
  
  const imageSrc = firstImage.src;
  const imageAlt = firstImage.alt;
  
  console.log('🔍 First image details:');
  console.log(`   - Source: ${imageSrc}`);
  console.log(`   - Alt text: ${imageAlt}`);
  
  // Test 1: Check if image source is accessible
  console.log('\n📋 Test 1: Image Source Accessibility');
  if (imageSrc && imageSrc !== '') {
    console.log('✅ Image source is present and accessible');
    
    // Test if it's a valid URL or API endpoint
    if (imageSrc.startsWith('http') || imageSrc.startsWith('/api/')) {
      console.log('✅ Image source is a valid URL/API endpoint');
    } else {
      console.log('⚠️ Image source format may need attention');
    }
  } else {
    console.log('❌ Image source is missing or empty');
  }
  
  // Test 2: Simulate edit request submission with image data
  console.log('\n📋 Test 2: Simulating Edit Request with Image Data');
  
  const testEditRequest = {
    id: Date.now().toString(),
    galleryId: 'test-gallery-image-links',
    clientName: 'Test Image Link Client',
    clientEmail: 'test-image@example.com',
    requestType: 'edit',
    priority: 'high',
    status: 'pending',
    title: 'Test Image Link Request',
    description: 'Testing image link functionality in edit requests',
    comments: 'This request is testing the image link feature',
    tasks: ['Test image link', 'Verify admin access', 'Check button functionality'],
    dueDate: '2025-01-20',
    selectedImageId: 'test-image-001',
    selectedImageAlt: imageAlt || 'Test Image',
    selectedImageSrc: imageSrc,
    submittedAt: new Date(),
    updatedAt: new Date()
  };
  
  // Save to editRequests localStorage
  try {
    const existingEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
    localStorage.setItem('editRequests', JSON.stringify([...existingEditRequests, testEditRequest]));
    console.log('✅ Test edit request saved to editRequests');
  } catch (error) {
    console.error('❌ Error saving to editRequests:', error);
  }
  
  // Create admin request
  const adminRequest = {
    id: testEditRequest.id,
    client: testEditRequest.clientName,
    type: 'Edit Request',
    status: 'Pending',
    priority: 'High',
    submitted: new Date().toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }),
    dueDate: testEditRequest.dueDate ? new Date(testEditRequest.dueDate).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }) : 'Not specified',
    description: testEditRequest.description,
    galleryId: testEditRequest.galleryId,
    galleryTitle: 'Test Gallery for Image Links',
    requestType: testEditRequest.requestType,
    comments: testEditRequest.comments,
    tasks: testEditRequest.tasks,
    selectedImageId: testEditRequest.selectedImageId,
    selectedImageAlt: testEditRequest.selectedImageAlt,
    selectedImageSrc: testEditRequest.selectedImageSrc,
    clientEmail: testEditRequest.clientEmail
  };
  
  // Save to requests localStorage (admin panel)
  try {
    const existingAdminRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    localStorage.setItem('requests', JSON.stringify([...existingAdminRequests, adminRequest]));
    console.log('✅ Test admin request saved to requests');
  } catch (error) {
    console.error('❌ Error saving to requests:', error);
  }
  
  // Test 3: Verify data in localStorage
  console.log('\n📋 Test 3: Verifying Data in localStorage');
  const savedEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
  const savedAdminRequests = JSON.parse(localStorage.getItem('requests') || '[]');
  
  const savedEditRequest = savedEditRequests.find(r => r.id === testEditRequest.id);
  const savedAdminRequest = savedAdminRequests.find(r => r.id === testEditRequest.id);
  
  if (savedEditRequest) {
    console.log('✅ Edit request found in localStorage with image data:');
    console.log(`   - Image Source: ${savedEditRequest.selectedImageSrc ? '✅ Present' : '❌ Missing'}`);
    console.log(`   - Image Alt: ${savedEditRequest.selectedImageAlt ? '✅ Present' : '❌ Missing'}`);
    console.log(`   - Image ID: ${savedEditRequest.selectedImageId ? '✅ Present' : '❌ Missing'}`);
  }
  
  if (savedAdminRequest) {
    console.log('✅ Admin request found in localStorage with image data:');
    console.log(`   - Image Source: ${savedAdminRequest.selectedImageSrc ? '✅ Present' : '❌ Missing'}`);
    console.log(`   - Image Alt: ${savedAdminRequest.selectedImageAlt ? '✅ Present' : '❌ Missing'}`);
    console.log(`   - Image ID: ${savedAdminRequest.selectedImageId ? '✅ Present' : '❌ Missing'}`);
  }
  
  // Test 4: Instructions for admin panel testing
  console.log('\n📋 Test 4: Admin Panel Testing Instructions');
  console.log('🎯 To test the image link functionality:');
  console.log('   1. Navigate to the Admin panel (/requests)');
  console.log('   2. Look for the test request: "Test Image Link Request"');
  console.log('   3. Check the Actions column for a green eye icon (View Image button)');
  console.log('   4. Click the View Image button to open the image in a new tab');
  console.log('   5. Click on the request row to open the detail panel');
  console.log('   6. Look for the "Image Details" section with View Image button');
  console.log('   7. Click the View Image button in the detail panel');
  
  // Test 5: Verify image link functionality
  console.log('\n📋 Test 5: Image Link Functionality Verification');
  console.log('🔍 Test request details:');
  console.log(`   - Request ID: ${testEditRequest.id}`);
  console.log(`   - Client: ${testEditRequest.clientName}`);
  console.log(`   - Image Source: ${testEditRequest.selectedImageSrc}`);
  console.log(`   - Image Alt: ${testEditRequest.selectedImageAlt}`);
  
  if (testEditRequest.selectedImageSrc) {
    console.log('✅ Image source is properly captured');
    console.log('💡 The admin should now be able to:');
    console.log('   - See a green eye icon in the Actions column');
    console.log('   - Click the icon to view the image in a new tab');
    console.log('   - Access the image from the detail panel');
  } else {
    console.log('❌ Image source is missing - check the implementation');
  }
  
  console.log('\n🎯 Image Link Test Complete!');
  console.log('📊 Summary:');
  console.log(`   - Edit request created: ${savedEditRequest ? '✅' : '❌'}`);
  console.log(`   - Admin request created: ${savedAdminRequest ? '✅' : '❌'}`);
  console.log(`   - Image data captured: ${testEditRequest.selectedImageSrc ? '✅' : '❌'}`);
  console.log('   - Next step: Test in admin panel (/requests)');
}

// Run the image link test
testImageLinks();










