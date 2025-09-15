// Test Masonry Layout for Layout-6
// Run this in the browser console to test the new masonry layout

console.log('🧱 Testing Masonry Layout for Layout-6...');

// Function to test the new masonry layout
function testMasonryLayout() {
  console.log('🔍 Testing masonry layout structure...');
  
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
        
        // Test masonry layout preview
        testMasonryPreview();
        
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
    
    // Change to layout-6
    templateDropdown.value = 'layout-6';
    const event = new Event('change', { bubbles: true });
    templateDropdown.dispatchEvent(event);
    
    console.log('✅ Changed template to layout-6');
    
    // Check if preview updates
    setTimeout(() => {
      const preview = document.querySelector('.h-32.border.rounded-lg.overflow-hidden');
      if (preview) {
        console.log('✅ Template preview section found');
        
        // Check if GalleryTemplates component is rendered
        const templateContent = preview.querySelector('[class*="grid"]');
        if (templateContent) {
          console.log('✅ GalleryTemplates component rendered');
          
          // Check if it's using the new 6-column grid
          const gridClasses = templateContent.className;
          if (gridClasses.includes('grid-cols-6')) {
            console.log('✅ Using new 6-column masonry grid');
          } else {
            console.log('❌ Not using 6-column grid');
          }
          
          // Count image placeholders
          const placeholders = templateContent.querySelectorAll('[class*="bg-gradient-to-br"]');
          console.log(`📊 Found ${placeholders.length} image placeholders in preview`);
          
          // Check for video placeholder
          const videoPlaceholder = templateContent.querySelector('[class*="border-dashed"]');
          if (videoPlaceholder) {
            console.log('✅ Video placeholder found');
            
            // Check if it spans 2 columns and 2 rows
            if (videoPlaceholder.className.includes('col-span-2') && videoPlaceholder.className.includes('row-span-2')) {
              console.log('✅ Video placeholder spans 2x2 grid space');
            } else {
              console.log('❌ Video placeholder doesn\'t span 2x2');
            }
          } else {
            console.log('❌ Video placeholder not found');
          }
          
        } else {
          console.log('❌ GalleryTemplates component not rendered');
        }
      } else {
        console.log('❌ Template preview section not found');
      }
    }, 500);
    
  } else {
    console.log('❌ Template dropdown not found');
  }
}

// Function to test masonry preview
function testMasonryPreview() {
  console.log('\n👁️ Testing Masonry Preview...');
  
  // Find the template preview section
  const previewSection = document.querySelector('.h-32.border.rounded-lg.overflow-hidden');
  if (previewSection) {
    console.log('✅ Template preview section found');
    
    // Check if it contains the GalleryTemplates component
    const templateContent = previewSection.querySelector('[class*="grid"]');
    if (templateContent) {
      console.log('✅ GalleryTemplates component found in preview');
      
      // Check grid structure
      const gridClasses = templateContent.className;
      console.log(`📐 Grid classes: ${gridClasses}`);
      
      // Check for 6-column layout
      if (gridClasses.includes('grid-cols-6')) {
        console.log('✅ 6-column masonry grid detected');
        
        // Count total grid items
        const gridItems = templateContent.querySelectorAll('> div');
        console.log(`📊 Total grid items: ${gridItems.length}`);
        
        // Check for video placeholder
        const videoPlaceholder = templateContent.querySelector('[class*="border-dashed"]');
        if (videoPlaceholder) {
          console.log('✅ Video placeholder found in masonry layout');
          
          // Check video placeholder size
          const videoClasses = videoPlaceholder.className;
          if (videoClasses.includes('col-span-2') && videoClasses.includes('row-span-2')) {
            console.log('✅ Video placeholder correctly sized (2x2)');
          } else {
            console.log('❌ Video placeholder incorrectly sized');
          }
        } else {
          console.log('❌ Video placeholder not found in masonry layout');
        }
        
      } else {
        console.log('❌ Not using 6-column masonry grid');
      }
      
    } else {
      console.log('❌ GalleryTemplates component not found in preview');
    }
  } else {
    console.log('❌ Template preview section not found');
  }
}

// Function to verify masonry layout in settings
function testSettingsMasonry() {
  console.log('\n⚙️ Testing Settings Page Masonry Layout...');
  
  // Navigate to settings page
  const settingsLink = Array.from(document.querySelectorAll('a')).find(link => 
    link.textContent.includes('Settings') || link.href.includes('settings')
  );
  
  if (settingsLink) {
    console.log('✅ Found settings link, navigating...');
    settingsLink.click();
    
    // Wait for page load
    setTimeout(() => {
      // Look for gallery layouts section
      const galleryLayoutsSection = document.querySelector('[class*="Gallery Layouts"]') || 
                                   document.querySelector('h2:contains("Gallery Layouts")');
      
      if (galleryLayoutsSection) {
        console.log('✅ Gallery Layouts section found');
        
        // Look for layout-6 preview
        const layout6Preview = document.querySelector('[class*="grid-cols-6"]');
        if (layout6Preview) {
          console.log('✅ Layout-6 masonry preview found in settings');
          
          // Check grid structure
          const gridClasses = layout6Preview.className;
          if (gridClasses.includes('grid-cols-6')) {
            console.log('✅ Settings page using 6-column masonry grid');
          } else {
            console.log('❌ Settings page not using 6-column grid');
          }
          
        } else {
          console.log('❌ Layout-6 masonry preview not found in settings');
        }
        
      } else {
        console.log('❌ Gallery Layouts section not found');
      }
    }, 2000);
    
  } else {
    console.log('❌ Settings link not found');
  }
}

// Main test execution
function runMasonryTests() {
  console.log('🚀 Starting Masonry Layout Tests...');
  console.log('====================================');
  
  // Test 1: Basic masonry layout
  testMasonryLayout();
  
  // Test 2: Settings page masonry
  setTimeout(() => {
    testSettingsMasonry();
  }, 5000);
  
}

// Auto-run the tests
runMasonryTests();

console.log('\n📝 Masonry Layout Test Script loaded successfully!');
console.log('💡 Use testMasonryLayout() to test basic masonry functionality');
console.log('💡 Use testTemplateDropdown() to test template selection');
console.log('💡 Use testMasonryPreview() to test preview rendering');
console.log('💡 Use testSettingsMasonry() to test settings page masonry');












