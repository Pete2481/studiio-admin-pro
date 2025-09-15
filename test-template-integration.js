// Gallery Template Integration Test Script
// Run this in the browser console on the galleries page

console.log('🔗 Testing Gallery Template Integration...');

// Function to test template selection and preview
function testTemplateIntegration() {
  console.log('🧪 Testing template selection and preview functionality...');
  
  // Find the Add Gallery button and click it
  const addGalleryButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Add Gallery')
  );
  
  if (addGalleryButton) {
    console.log('✅ Found Add Gallery button, clicking...');
    addGalleryButton.click();
    
    // Wait for modal to open
    setTimeout(() => {
      // Check if modal is open
      const modal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-75');
      if (modal) {
        console.log('✅ Add Gallery modal opened');
        
        // Test template dropdown
        testTemplateDropdown();
        
        // Test template preview
        testTemplatePreview();
        
        // Test template preview button
        testPreviewButton();
        
      } else {
        console.log('❌ Add Gallery modal not found');
      }
    }, 1000);
  } else {
    console.log('❌ Add Gallery button not found');
  }
}

// Function to test template dropdown
function testTemplateDropdown() {
  console.log('\n📋 Testing Template Dropdown...');
  
  // Find the template dropdown
  const templateDropdown = document.querySelector('select[value*="layout-"]');
  if (templateDropdown) {
    console.log('✅ Template dropdown found');
    
    // Check all options
    const options = Array.from(templateDropdown.querySelectorAll('option'));
    console.log(`📊 Found ${options.length} template options:`);
    
    options.forEach((option, index) => {
      console.log(`   ${index + 1}. ${option.textContent}`);
    });
    
    // Test changing template
    testTemplateChange(templateDropdown);
    
  } else {
    console.log('❌ Template dropdown not found');
  }
}

// Function to test template change
function testTemplateChange(dropdown) {
  console.log('\n🔄 Testing Template Change...');
  
  // Get current value
  const currentValue = dropdown.value;
  console.log(`📌 Current template: ${currentValue}`);
  
  // Change to a different template
  const newTemplate = currentValue === 'layout-3' ? 'layout-6' : 'layout-3';
  dropdown.value = newTemplate;
  
  // Trigger change event
  const event = new Event('change', { bubbles: true });
  dropdown.dispatchEvent(event);
  
  console.log(`✅ Changed template to: ${newTemplate}`);
  
  // Check if preview updates
  setTimeout(() => {
    const preview = document.querySelector('.h-32.border.rounded-lg.overflow-hidden');
    if (preview) {
      console.log('✅ Template preview section found');
      
      // Check if GalleryTemplates component is rendered
      const templateContent = preview.querySelector('[class*="grid"], [class*="flex"]');
      if (templateContent) {
        console.log('✅ GalleryTemplates component rendered');
      } else {
        console.log('❌ GalleryTemplates component not rendered');
      }
    } else {
      console.log('❌ Template preview section not found');
    }
  }, 500);
}

// Function to test template preview
function testTemplatePreview() {
  console.log('\n👁️ Testing Template Preview...');
  
  // Find the template preview section
  const previewSection = document.querySelector('.h-32.border.rounded-lg.overflow-hidden');
  if (previewSection) {
    console.log('✅ Template preview section found');
    
    // Check if it contains the GalleryTemplates component
    const templateContent = previewSection.querySelector('[class*="grid"], [class*="flex"]');
    if (templateContent) {
      console.log('✅ GalleryTemplates component found in preview');
      
      // Count image placeholders
      const placeholders = templateContent.querySelectorAll('[class*="bg-gradient-to-br"]');
      console.log(`📊 Found ${placeholders.length} image placeholders in preview`);
      
    } else {
      console.log('❌ GalleryTemplates component not found in preview');
    }
  } else {
    console.log('❌ Template preview section not found');
  }
}

// Function to test preview button
function testPreviewButton() {
  console.log('\n🔍 Testing Preview Button...');
  
  // Find the preview template button
  const previewButton = Array.from(document.querySelectorAll('button')).find(btn => 
    btn.textContent.includes('Preview Template Layout')
  );
  
  if (previewButton) {
    console.log('✅ Preview Template Layout button found');
    
    // Check if button is enabled (should have gallery title and folder link)
    const isEnabled = !previewButton.disabled;
    console.log(`📊 Button enabled: ${isEnabled}`);
    
    // Test clicking the button
    if (isEnabled) {
      console.log('🖱️ Clicking preview button...');
      previewButton.click();
      
      // Wait for preview modal
      setTimeout(() => {
        const previewModal = document.querySelector('.fixed.inset-0.bg-black.bg-opacity-75');
        if (previewModal) {
          console.log('✅ Preview modal opened');
          
          // Check if CloudGalleryGrid is rendered with template
          const cloudGallery = previewModal.querySelector('[class*="h-96"]');
          if (cloudGallery) {
            console.log('✅ CloudGalleryGrid component found in preview');
            
            // Check if template is applied
            const templateContent = cloudGallery.querySelector('[class*="grid"], [class*="flex"]');
            if (templateContent) {
              console.log('✅ Template layout applied in preview');
            } else {
              console.log('❌ Template layout not applied in preview');
            }
          } else {
            console.log('❌ CloudGalleryGrid component not found in preview');
          }
          
          // Close modal
          const closeButton = previewModal.querySelector('button svg');
          if (closeButton) {
            closeButton.closest('button').click();
            console.log('🔒 Preview modal closed');
          }
        } else {
          console.log('❌ Preview modal not opened');
        }
      }, 1000);
    } else {
      console.log('⚠️ Preview button is disabled - need gallery title and folder link');
    }
  } else {
    console.log('❌ Preview Template Layout button not found');
  }
}

// Function to test all templates
function testAllTemplates() {
  console.log('\n🎨 Testing All Templates...');
  
  const templates = [
    'layout-1', 'layout-2', 'layout-3', 'layout-4', 
    'layout-5', 'layout-6', 'layout-7'
  ];
  
  templates.forEach((template, index) => {
    console.log(`\n📐 Testing ${template}...`);
    
    // Find and change template
    const dropdown = document.querySelector('select[value*="layout-"]');
    if (dropdown) {
      dropdown.value = template;
      const event = new Event('change', { bubbles: true });
      dropdown.dispatchEvent(event);
      
      console.log(`✅ Changed to ${template}`);
      
      // Check preview after a delay
      setTimeout(() => {
        const preview = document.querySelector('.h-32.border.rounded-lg.overflow-hidden');
        if (preview) {
          const templateContent = preview.querySelector('[class*="grid"], [class*="flex"]');
          if (templateContent) {
            console.log(`✅ ${template} preview rendered successfully`);
          } else {
            console.log(`❌ ${template} preview failed to render`);
          }
        }
      }, 500);
    }
  });
}

// Function to verify template saving
function testTemplateSaving() {
  console.log('\n💾 Testing Template Saving...');
  
  // Fill in required fields
  const titleInput = document.querySelector('input[placeholder*="Gallery Title"]') || 
                     document.querySelector('input[value*="Test Gallery"]');
  
  if (titleInput) {
    console.log('✅ Found title input');
    
    // Set a test value
    titleInput.value = 'Template Test Gallery';
    titleInput.dispatchEvent(new Event('input', { bubbles: true }));
    
    // Find and set template
    const dropdown = document.querySelector('select[value*="layout-"]');
    if (dropdown) {
      dropdown.value = 'layout-6'; // Video Center Layout
      dropdown.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('✅ Set template to layout-6');
      
      // Find save button
      const saveButton = Array.from(document.querySelectorAll('button')).find(btn => 
        btn.textContent.includes('Save Gallery')
      );
      
      if (saveButton) {
        console.log('✅ Found Save Gallery button');
        
        // Check if save is enabled
        const isEnabled = !saveButton.disabled;
        console.log(`📊 Save button enabled: ${isEnabled}`);
        
        if (isEnabled) {
          console.log('🖱️ Clicking save button...');
          saveButton.click();
          
          // Check for success message
          setTimeout(() => {
            const successMessage = document.querySelector('.fixed.top-4.right-4.bg-green-500');
            if (successMessage) {
              console.log('✅ Gallery saved successfully with template!');
            } else {
              console.log('❌ Success message not shown');
            }
          }, 1000);
        }
      }
    }
  }
}

// Main test execution
function runTemplateIntegrationTests() {
  console.log('🚀 Starting Gallery Template Integration Tests...');
  console.log('================================================');
  
  // Wait for page to be fully loaded
  setTimeout(() => {
    // Test 1: Template selection and preview
    testTemplateIntegration();
    
    // Test 2: All templates
    setTimeout(() => {
      testAllTemplates();
    }, 3000);
    
    // Test 3: Template saving
    setTimeout(() => {
      testTemplateSaving();
    }, 8000);
    
  }, 1000);
}

// Auto-run the tests
runTemplateIntegrationTests();

console.log('\n📝 Template Integration Test Script loaded successfully!');
console.log('💡 Use testTemplateIntegration() to test basic functionality');
console.log('💡 Use testAllTemplates() to test all 7 templates');
console.log('💡 Use testTemplateSaving() to test saving with templates');
console.log('💡 Use testTemplateDropdown() to test dropdown functionality');
console.log('💡 Use testTemplatePreview() to test preview rendering');
console.log('💡 Use testPreviewButton() to test preview button functionality');












