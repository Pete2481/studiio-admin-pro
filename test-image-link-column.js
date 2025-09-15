// Test script for Image Link Column in Requests Table
// Run this in the browser console on the /requests admin page

function testImageLinkColumn() {
  console.log('🧪 Testing Image Link Column Functionality...');
  
  // Check if we're on the requests page
  if (!window.location.pathname.includes('/requests')) {
    console.log('❌ This test must be run on the /requests admin page');
    return;
  }
  
  // Check if the Image Link column header exists
  const imageLinkHeader = Array.from(document.querySelectorAll('th')).find(th => 
    th.textContent.trim() === 'IMAGE LINK'
  );
  
  if (imageLinkHeader) {
    console.log('✅ Image Link column header found');
  } else {
    console.log('❌ Image Link column header not found');
    return;
  }
  
  // Check if there are any requests with image links
  const requestsWithImages = document.querySelectorAll('td:nth-child(6) button'); // 6th column (Image Link)
  console.log(`📊 Found ${requestsWithImages.length} requests with image links`);
  
  if (requestsWithImages.length === 0) {
    console.log('⚠️ No requests with image links found');
    console.log('💡 This could mean:');
    console.log('   - No edit requests have been submitted yet');
    console.log('   - The requests don\'t have selectedImageSrc data');
    console.log('   - The data structure needs to be checked');
    
    // Check localStorage for requests data
    const requests = JSON.parse(localStorage.getItem('requests') || '[]');
    const requestsWithImageData = requests.filter(r => r.selectedImageSrc);
    
    console.log(`\n🔍 localStorage analysis:`);
    console.log(`   - Total requests: ${requests.length}`);
    console.log(`   - Requests with image data: ${requestsWithImageData.length}`);
    
    if (requestsWithImageData.length > 0) {
      console.log('   - Sample image source:', requestsWithImageData[0].selectedImageSrc);
    }
    
    return;
  }
  
  // Test 1: Verify button styling and functionality
  console.log('\n📋 Test 1: Button Styling and Appearance');
  const firstImageButton = requestsWithImages[0];
  const buttonClasses = firstImageButton.className;
  
  if (buttonClasses.includes('bg-blue-100') && buttonClasses.includes('text-blue-700')) {
    console.log('✅ Button has correct blue styling');
  } else {
    console.log('⚠️ Button styling may need adjustment');
  }
  
  if (firstImageButton.textContent.includes('View Image')) {
    console.log('✅ Button text is correct');
  } else {
    console.log('❌ Button text is incorrect');
  }
  
  // Test 2: Check button click functionality
  console.log('\n📋 Test 2: Button Click Functionality');
  console.log('🔍 Checking if button has click handler...');
  
  const buttonOnClick = firstImageButton.getAttribute('onclick');
  if (buttonOnClick && buttonOnClick.includes('window.open')) {
    console.log('✅ Button has window.open click handler');
  } else {
    console.log('⚠️ Button click handler may need verification');
  }
  
  // Test 3: Verify image source data
  console.log('\n📋 Test 3: Image Source Data Verification');
  
  // Get the request row that contains this button
  const requestRow = firstImageButton.closest('tr');
  if (requestRow) {
    // Find the request title to identify which request this is
    const requestTitle = requestRow.querySelector('td:first-child p:first-child');
    if (requestTitle) {
      console.log(`📝 Request: ${requestTitle.textContent}`);
    }
    
    // Check if the button opens the correct image
    const buttonTitle = firstImageButton.getAttribute('title');
    if (buttonTitle === 'Click to open image') {
      console.log('✅ Button has correct tooltip');
    } else {
      console.log('⚠️ Button tooltip may need adjustment');
    }
  }
  
  // Test 4: Test actual button click (simulate)
  console.log('\n📋 Test 4: Simulating Button Click');
  console.log('🎯 To test the actual image opening:');
  console.log('   1. Click on any "View Image" button in the Image Link column');
  console.log('   2. The image should open in a new tab');
  console.log('   3. Verify the image loads correctly');
  
  // Test 5: Check for requests without images
  console.log('\n📋 Test 5: Requests Without Images');
  const noImageCells = document.querySelectorAll('td:nth-child(6) span.text-gray-400');
  console.log(`📊 Found ${noImageCells.length} requests without images`);
  
  if (noImageCells.length > 0) {
    const firstNoImage = noImageCells[0];
    if (firstNoImage.textContent === 'No image') {
      console.log('✅ "No image" text is displayed correctly');
    } else {
      console.log('⚠️ "No image" text may need adjustment');
    }
  }
  
  // Test 6: Column layout verification
  console.log('\n📋 Test 6: Column Layout Verification');
  const tableHeaders = Array.from(document.querySelectorAll('th'));
  const expectedHeaders = ['REQUEST', 'CLIENT', 'STATUS', 'PRIORITY', 'IMAGE LINK', 'SUBMITTED', 'DUE DATE', 'ACTIONS'];
  
  console.log('📋 Expected column headers:');
  expectedHeaders.forEach((header, index) => {
    const actualHeader = tableHeaders[index]?.textContent.trim();
    if (actualHeader === header) {
      console.log(`   ${index + 1}. ${header} ✅`);
    } else {
      console.log(`   ${index + 1}. ${header} ❌ (found: ${actualHeader})`);
    }
  });
  
  // Summary
  console.log('\n🎯 Image Link Column Test Complete!');
  console.log('📊 Summary:');
  console.log(`   - Image Link column: ${imageLinkHeader ? '✅ Present' : '❌ Missing'}`);
  console.log(`   - Requests with images: ${requestsWithImages.length}`);
  console.log(`   - Requests without images: ${noImageCells.length}`);
  console.log(`   - Total columns: ${tableHeaders.length}`);
  
  if (requestsWithImages.length > 0) {
    console.log('\n💡 Next Steps:');
    console.log('   1. Click a "View Image" button to test image opening');
    console.log('   2. Verify images open in new tabs correctly');
    console.log('   3. Check that the Image Link column is properly positioned');
  }
}

// Run the image link column test
testImageLinkColumn();










