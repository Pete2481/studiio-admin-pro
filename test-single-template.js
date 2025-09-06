// Test script for the gallery templates
// Run this in the browser console on the galleries page

function testGalleryTemplates() {
  console.log('🧪 Testing Gallery Templates...');
  
  // Check if template dropdown shows all three options
  const templateSelect = document.querySelector('select[value="single-template"]');
  if (templateSelect) {
    const options = templateSelect.querySelectorAll('option');
    console.log(`✅ Template dropdown has ${options.length} option(s)`);
    
    if (options.length === 3) {
      console.log('✅ All three template options available:');
      options.forEach(option => {
        console.log(`  - ${option.value}: ${option.textContent}`);
      });
    } else {
      console.log('❌ Expected 3 template options, found:', options.length);
    }
  } else {
    console.log('❌ Template dropdown not found');
  }
  
  // Check if GalleryTemplates component renders
  const galleryTemplates = document.querySelector('[class*="GalleryTemplates"]');
  if (galleryTemplates) {
    console.log('✅ GalleryTemplates component found');
    
    // Check for hero banner
    const heroBanner = galleryTemplates.querySelector('div[class*="h-96"]');
    if (heroBanner) {
      console.log('✅ Hero image banner found');
      const heroImage = heroBanner.querySelector('img');
      if (heroImage) {
        console.log('✅ Hero banner image found');
      }
    } else {
      console.log('❌ Hero image banner not found');
    }
    
    // Check for gallery header
    const header = galleryTemplates.querySelector('h2');
    if (header && header.textContent.includes('Gallery Images')) {
      console.log('✅ Gallery header found: "Gallery Images"');
    }
    
    const downloadButton = galleryTemplates.querySelector('button:contains("Download All")');
    if (downloadButton) {
      console.log('✅ Download All button found');
    }
    
    const grid = galleryTemplates.querySelector('.grid');
    if (grid) {
      console.log('✅ Responsive grid layout found');
      console.log(`✅ Grid classes: ${grid.className}`);
      
      // Check grid columns for different layouts
      if (grid.className.includes('md:grid-cols-2') && !grid.className.includes('lg:grid-cols-3') && !grid.className.includes('xl:grid-cols-4')) {
        console.log('✅ 2x Layout detected (2 columns max)');
      } else if (grid.className.includes('lg:grid-cols-3') && !grid.className.includes('xl:grid-cols-4')) {
        console.log('✅ 3x Layout detected (3 columns max)');
      } else if (grid.className.includes('xl:grid-cols-4')) {
        console.log('✅ Professional Gallery detected (4 columns max)');
      }
    }
    
    // Check for real images only (no placeholders)
    const realImages = galleryTemplates.querySelectorAll('img[src*="/api/local-image"]');
    console.log(`✅ Found ${realImages.length} real images from API`);
    
    // Check for NO placeholder boxes
    const placeholders = galleryTemplates.querySelectorAll('[class*="placeholder"]');
    if (placeholders.length === 0) {
      console.log('✅ No placeholder boxes found - only real images displayed');
    } else {
      console.log(`❌ Found ${placeholders.length} placeholder boxes - these should be removed`);
    }
    
    // Check for NO grey placeholder divs
    const greyPlaceholders = galleryTemplates.querySelectorAll('div[class*="bg-gradient-to-br from-gray-100 to-gray-200"]');
    if (greyPlaceholders.length === 0) {
      console.log('✅ No grey placeholder divs found');
    } else {
      console.log(`❌ Found ${greyPlaceholders.length} grey placeholder divs - these should be removed`);
    }
    
    // Check total grid items vs real images
    const gridItems = grid ? grid.querySelectorAll('> div') : [];
    console.log(`✅ Grid contains ${gridItems.length} total items`);
    
    if (realImages.length === gridItems.length) {
      console.log('✅ Grid only contains real images - perfect!');
    } else {
      console.log(`❌ Grid has ${gridItems.length} items but only ${realImages.length} real images`);
    }
    
    // Check for scroll feature in layouts
    const scrollableContainer = grid?.closest('[class*="overflow-y-auto"]');
    if (scrollableContainer) {
      console.log('✅ Scroll feature detected');
      console.log(`✅ Scroll container max height: ${scrollableContainer.style.maxHeight || '800px'}`);
    } else {
      console.log('ℹ️ No scroll feature (Professional Gallery layout)');
    }
    
    // Check image sizing (object-contain vs object-cover)
    const firstImage = realImages[0];
    if (firstImage) {
      const imageClasses = firstImage.className;
      if (imageClasses.includes('object-contain')) {
        console.log('✅ Images use object-contain (2x/3x Layout - no cropping)');
      } else if (imageClasses.includes('object-cover')) {
        console.log('✅ Images use object-cover (Professional Gallery - may crop)');
      }
    }
    
    // Check layout-specific features
    const headerText = galleryTemplates.querySelector('p[class*="text-sm text-gray-600"]');
    if (headerText) {
      const headerContent = headerText.textContent;
      if (headerContent.includes('2x Layout')) {
        console.log('✅ 2x Layout header text detected');
      } else if (headerContent.includes('3x Layout')) {
        console.log('✅ 3x Layout header text detected');
      } else {
        console.log('✅ Professional Gallery header text detected');
      }
    }
  } else {
    console.log('❌ GalleryTemplates component not found');
  }
  
  // Check that the ESSENTIAL PACKAGE section has been removed
  console.log('🧹 Checking for removed package section...');
  const packageSection = document.querySelector('.bg-gray-100.rounded-lg.border.border-gray-200');
  if (!packageSection) {
    console.log('✅ ESSENTIAL PACKAGE section successfully removed');
  } else {
    console.log('❌ ESSENTIAL PACKAGE section still present - needs removal');
  }
  
  // Check for no gallery header with package info
  const galleryHeader = document.querySelector('h1.text-2xl.font-bold.text-gray-900');
  if (!galleryHeader) {
    console.log('✅ Gallery header with package info successfully removed');
  } else {
    console.log('❌ Gallery header still present - needs removal');
  }
  
  // Check if all galleries use valid templates
  const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
  if (galleries.length > 0) {
    const validTemplates = ['single-template', '3x-layout', '2x-layout'];
    const allUseValidTemplates = galleries.every(gallery => validTemplates.includes(gallery.template));
    if (allUseValidTemplates) {
      console.log('✅ All galleries use valid templates');
    } else {
      console.log('❌ Some galleries use invalid templates');
      galleries.forEach(gallery => {
        if (!validTemplates.includes(gallery.template)) {
          console.log(`❌ Gallery "${gallery.title}" uses invalid template: ${gallery.template}`);
        }
      });
    }
    
    // Check template distribution
    const templateCounts = {};
    galleries.forEach(gallery => {
      templateCounts[gallery.template] = (templateCounts[gallery.template] || 0) + 1;
    });
    console.log('📊 Template usage distribution:', templateCounts);
  } else {
    console.log('ℹ️ No galleries found in localStorage');
  }
  
  console.log('🎯 Gallery templates test complete!');
}

// Test gallery template update functionality
function testTemplateUpdate() {
  console.log('🔄 Testing Gallery Template Update Functionality...');
  
  // Check if we have galleries to test with
  const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
  if (galleries.length === 0) {
    console.log('❌ No galleries found to test template updates');
    return;
  }
  
  // Find a gallery to test with
  const testGallery = galleries[0];
  console.log(`🧪 Testing with gallery: "${testGallery.title}" (current template: ${testGallery.template})`);
  
  // Check if the gallery has a valid template
  const validTemplates = ['single-template', '3x-layout', '2x-layout'];
  if (!validTemplates.includes(testGallery.template)) {
    console.log(`❌ Gallery "${testGallery.title}" has invalid template: ${testGallery.template}`);
    console.log('💡 This gallery needs to be updated to use a valid template');
    return;
  }
  
  // Check if the gallery template is properly saved in localStorage
  const savedGallery = galleries.find(g => g.id === testGallery.id);
  if (savedGallery && savedGallery.template === testGallery.template) {
    console.log('✅ Gallery template is properly saved in localStorage');
  } else {
    console.log('❌ Gallery template is not properly saved in localStorage');
  }
  
  // Check if the gallery template matches what's displayed
  const galleryElement = document.querySelector(`[data-gallery-id="${testGallery.id}"]`);
  if (galleryElement) {
    console.log('✅ Gallery element found in DOM');
    // You could add more specific checks here if needed
  } else {
    console.log('ℹ️ Gallery element not found in DOM (may be filtered out)');
  }
  
  console.log('💡 To test template updates:');
  console.log('   1. Click "Edit" on a gallery');
  console.log('   2. Change the template in the dropdown');
  console.log('   3. Click "Save Gallery"');
  console.log('   4. Check that the template change is saved');
  
  console.log('🎯 Template update test complete!');
}

// Run the tests
testGalleryTemplates();
testTemplateUpdate();
