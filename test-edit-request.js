// Test script for the Edit Request functionality
// Run this in the browser console on any gallery page

function testEditRequestFunctionality() {
  console.log('🧪 Testing Edit Request Functionality...');
  
  // Check if Edit icons are present on images
  const editButtons = document.querySelectorAll('button[title="Request Edit for this image"]');
  console.log(`✅ Found ${editButtons.length} Edit buttons on images`);
  
  if (editButtons.length === 0) {
    console.log('❌ No Edit buttons found - check if images are loaded');
    return;
  }
  
  // Check if heart icons are present
  const heartButtons = document.querySelectorAll('button svg[stroke="currentColor"]');
  console.log(`✅ Found ${heartButtons.length} heart/favorite buttons`);
  
  // Check if EditRequestModal component is imported
  const modalElements = document.querySelectorAll('[class*="EditRequestModal"]');
  if (modalElements.length > 0) {
    console.log('✅ EditRequestModal component found');
  } else {
    console.log('ℹ️ EditRequestModal component not yet rendered (will appear when Edit button is clicked)');
  }
  
  // Test clicking an Edit button
  console.log('🔄 Testing Edit button click...');
  const firstEditButton = editButtons[0];
  if (firstEditButton) {
    console.log('✅ First Edit button found, testing click...');
    
    // Store current localStorage state
    const beforeRequests = JSON.parse(localStorage.getItem('requests') || '[]');
    const beforeEditRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
    
    console.log(`📊 Before click - Requests: ${beforeRequests.length}, Edit Requests: ${beforeEditRequests.length}`);
    
    // Click the button
    firstEditButton.click();
    
    // Wait a moment for the modal to appear
    setTimeout(() => {
      console.log('⏳ Checking if modal appeared...');
      
      // Check if modal is visible
      const modal = document.querySelector('.fixed.inset-y-0.right-0');
      if (modal) {
        console.log('✅ Edit Request Modal appeared successfully!');
        
        // Check modal content
        const modalTitle = modal.querySelector('h2');
        if (modalTitle && modalTitle.textContent?.includes('New Edit Request')) {
          console.log('✅ Modal title is correct: "New Edit Request"');
        }
        
        // Check form fields
        const formFields = modal.querySelectorAll('input, select, textarea');
        console.log(`✅ Modal has ${formFields.length} form fields`);
        
        // Check if gallery info is displayed
        const galleryInfo = modal.querySelector('.bg-blue-50');
        if (galleryInfo) {
          console.log('✅ Gallery information section found');
        }
        
        // Test form submission (optional - user can do this manually)
        console.log('💡 Modal is ready for testing!');
        console.log('   - Fill out the form with test data');
        console.log('   - Submit the form to test the complete flow');
        console.log('   - Check localStorage for saved requests');
        
        // Close modal for testing
        const closeButton = modal.querySelector('button[onclick*="onClose"]') || 
                           modal.querySelector('svg[stroke="currentColor"]')?.closest('button');
        if (closeButton) {
          closeButton.click();
          console.log('✅ Modal closed successfully');
        }
        
      } else {
        console.log('❌ Modal did not appear after clicking Edit button');
      }
    }, 500);
    
  } else {
    console.log('❌ Could not find Edit button to test');
  }
  
  // Check localStorage for existing requests
  const requests = JSON.parse(localStorage.getItem('requests') || '[]');
  const editRequests = JSON.parse(localStorage.getItem('editRequests') || '[]');
  
  console.log('📊 Current localStorage state:');
  console.log(`   - Admin Requests: ${requests.length}`);
  console.log(`   - Edit Requests: ${editRequests.length}`);
  
  if (requests.length > 0) {
    console.log('📋 Sample Admin Request:');
    console.log(requests[0]);
  }
  
  if (editRequests.length > 0) {
    console.log('📋 Sample Edit Request:');
    console.log(editRequests[0]);
  }
  
  console.log('🎯 Edit Request functionality test complete!');
}

// Test the image overlay functionality
function testImageOverlays() {
  console.log('🖼️ Testing Image Overlay Functionality...');
  
  // Check if images have hover effects
  const imageContainers = document.querySelectorAll('.group.relative.overflow-hidden');
  console.log(`✅ Found ${imageContainers.length} image containers with hover effects`);
  
  // Check if heart and edit buttons are positioned correctly
  imageContainers.forEach((container, index) => {
    const heartButton = container.querySelector('button svg[stroke="currentColor"]');
    const editButton = container.querySelector('button[title="Request Edit for this image"]');
    
    if (heartButton && editButton) {
      console.log(`✅ Image ${index + 1}: Both heart and edit buttons found`);
      
      // Check positioning
      const topRight = container.querySelector('.absolute.top-3.right-3');
      if (topRight) {
        console.log(`✅ Image ${index + 1}: Buttons positioned in top-right corner`);
      }
    } else {
      console.log(`❌ Image ${index + 1}: Missing buttons - Heart: ${!!heartButton}, Edit: ${!!editButton}`);
    }
  });
  
  // Check if buttons are hidden by default and show on hover
  const firstContainer = imageContainers[0];
  if (firstContainer) {
    const overlay = firstContainer.querySelector('.absolute.inset-0');
    if (overlay) {
      const opacity = window.getComputedStyle(overlay).opacity;
      console.log(`✅ First image overlay opacity: ${opacity} (should be 0 by default)`);
      
      if (opacity === '0') {
        console.log('✅ Overlay is hidden by default (correct behavior)');
      } else {
        console.log('⚠️ Overlay is visible by default (may need CSS adjustment)');
      }
    }
  }
  
  console.log('🎯 Image overlay test complete!');
}

// Run the tests
testEditRequestFunctionality();
testImageOverlays();










