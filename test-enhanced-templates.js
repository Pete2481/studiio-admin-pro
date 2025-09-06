// Enhanced Gallery Templates Test Script
// Run this in the browser console on the settings page (Gallery Layouts tab)

console.log('🎨 Testing Enhanced Gallery Templates...');

// Function to test all layout previews
function testAllLayouts() {
  console.log('🧪 Testing all 7 gallery layouts...');
  
  // Get all layout options
  const layoutButtons = document.querySelectorAll('[class*="border-2 rounded-lg p-4 cursor-pointer"]');
  console.log(`Found ${layoutButtons.length} layout options`);
  
  // Test each layout
  layoutButtons.forEach((button, index) => {
    console.log(`\n📐 Testing Layout ${index + 1}...`);
    
    // Click the layout to select it
    button.click();
    
    // Wait a moment for the selection to update
    setTimeout(() => {
      // Check if layout is selected
      const isSelected = button.classList.contains('border-blue-500');
      console.log(`Layout ${index + 1} selected: ${isSelected ? '✅' : '❌'}`);
      
      // Click Preview Layout button
      const previewButton = document.querySelector('button:contains("Preview Layout")') || 
                           Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Preview Layout'));
      
      if (previewButton) {
        console.log('🔍 Clicking Preview Layout button...');
        previewButton.click();
        
        // Wait for modal to appear
        setTimeout(() => {
          // Check if preview modal is visible
          const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-75');
          if (modal) {
            console.log('✅ Preview modal opened successfully');
            
            // Check the preview content
            const previewContent = modal.querySelector('.max-w-4xl');
            if (previewContent) {
              console.log('✅ Preview content container found');
              
              // Count image placeholders
              const placeholders = previewContent.querySelectorAll('[class*="bg-gradient-to-br"]');
              console.log(`📊 Found ${placeholders.length} image placeholders`);
              
              // Check if we have at least 40 placeholders
              if (placeholders.length >= 40) {
                console.log('✅ SUCCESS: Layout has 40+ image placeholders');
              } else {
                console.log('⚠️ WARNING: Layout has fewer than 40 placeholders');
              }
            } else {
              console.log('❌ Preview content container not found');
            }
            
            // Close the modal
            const closeButton = modal.querySelector('button svg');
            if (closeButton) {
              closeButton.closest('button').click();
              console.log('🔒 Modal closed');
            }
          } else {
            console.log('❌ Preview modal not found');
          }
        }, 1000);
      } else {
        console.log('❌ Preview Layout button not found');
      }
    }, 500);
  });
}

// Function to test specific layout
function testSpecificLayout(layoutId) {
  console.log(`🎯 Testing specific layout: ${layoutId}`);
  
  // Find and click the layout
  const layoutButton = Array.from(document.querySelectorAll('[class*="border-2 rounded-lg p-4 cursor-pointer"]'))
    .find(btn => btn.textContent.includes(layoutId) || btn.querySelector('h3')?.textContent.includes(layoutId));
  
  if (layoutButton) {
    layoutButton.click();
    console.log(`✅ Selected ${layoutId}`);
    
    // Test preview
    setTimeout(() => {
      const previewButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Preview Layout'));
      if (previewButton) {
        previewButton.click();
        console.log('🔍 Opened preview...');
        
        setTimeout(() => {
          const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-75');
          if (modal) {
            const placeholders = modal.querySelectorAll('[class*="bg-gradient-to-br"]');
            console.log(`📊 ${layoutId} has ${placeholders.length} image placeholders`);
            
            // Close modal
            const closeButton = modal.querySelector('button svg');
            if (closeButton) {
              closeButton.closest('button').click();
            }
          }
        }, 1000);
      }
    }, 500);
  } else {
    console.log(`❌ Layout ${layoutId} not found`);
  }
}

// Function to verify all layouts are functional
function verifyAllLayoutsFunctional() {
  console.log('🔍 Verifying all layouts are functional...');
  
  const layouts = [
    'Grid Layout',
    'Centered Focus', 
    'Asymmetrical Grid',
    'Masonry Style',
    'Hero Gallery',
    'Video Center Layout',
    'Story Layout'
  ];
  
  layouts.forEach((layoutName, index) => {
    console.log(`\n📋 Layout ${index + 1}: ${layoutName}`);
    
    // Check if layout option exists
    const layoutOption = Array.from(document.querySelectorAll('h3')).find(h3 => h3.textContent === layoutName);
    if (layoutOption) {
      console.log('✅ Layout option found');
      
      // Check if it has a preview
      const layoutCard = layoutOption.closest('[class*="border-2 rounded-lg p-4"]');
      if (layoutCard) {
        const preview = layoutCard.querySelector('[class*="grid"], [class*="flex"], [class*="relative"]');
        if (preview) {
          console.log('✅ Layout preview found');
        } else {
          console.log('❌ Layout preview missing');
        }
      }
    } else {
      console.log('❌ Layout option missing');
    }
  });
}

// Function to test template selection and saving
function testTemplateSelection() {
  console.log('💾 Testing template selection and saving...');
  
  // Select a different layout
  const layoutButtons = document.querySelectorAll('[class*="border-2 rounded-lg p-4 cursor-pointer"]');
  if (layoutButtons.length > 1) {
    // Click the second layout
    layoutButtons[1].click();
    console.log('✅ Selected second layout');
    
    // Check if selection indicator appears
    setTimeout(() => {
      const selectionIndicator = layoutButtons[1].querySelector('.absolute.top-2.right-2.w-4.h-4.bg-blue-500');
      if (selectionIndicator) {
        console.log('✅ Selection indicator visible');
      } else {
        console.log('❌ Selection indicator missing');
      }
      
      // Test save functionality
      const saveButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('Save Layout'));
      if (saveButton) {
        saveButton.click();
        console.log('💾 Clicked Save Layout button');
        
        // Check for success message
        setTimeout(() => {
          const successMessage = document.querySelector('.fixed.top-4.right-4.bg-green-500');
          if (successMessage) {
            console.log('✅ Success message displayed');
          } else {
            console.log('❌ Success message not displayed');
          }
        }, 1000);
      }
    }, 500);
  }
}

// Main test execution
function runEnhancedTemplateTests() {
  console.log('🚀 Starting Enhanced Gallery Template Tests...');
  console.log('=============================================');
  
  // Wait for page to be fully loaded
  setTimeout(() => {
    // Test 1: Verify all layouts are functional
    verifyAllLayoutsFunctional();
    
    // Test 2: Test template selection
    testTemplateSelection();
    
    // Test 3: Test all layout previews
    setTimeout(() => {
      testAllLayouts();
    }, 2000);
    
  }, 1000);
}

// Auto-run the tests
runEnhancedTemplateTests();

console.log('📝 Test script loaded. Check console for results.');
console.log('💡 Use testSpecificLayout("layout-name") to test a specific layout.');
console.log('💡 Use testAllLayouts() to test all layouts.');
console.log('💡 Use verifyAllLayoutsFunctional() to verify all layouts exist.');
