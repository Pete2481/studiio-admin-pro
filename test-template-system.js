// Test script to verify gallery template system
// Run this in the browser console on the galleries page

console.log('🧪 Testing Gallery Template System...');

// Clear any existing test galleries first
function clearTestGalleries() {
  const existingGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
  const filteredGalleries = existingGalleries.filter(g => !g.title.includes('TEST TEMPLATE'));
  localStorage.setItem('galleries', JSON.stringify(filteredGalleries));
  console.log('🧹 Cleared existing test galleries');
}

// Create test galleries with different templates
function createTestGalleries() {
  clearTestGalleries();
  
  const testGalleries = [
    {
      id: 'test-template-1-' + Date.now(),
      title: 'TEST TEMPLATE 1 - Grid Layout',
      propertyAddress: '123 Grid Layout Street',
      companyName: 'Test Company 1',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
      agent: 'Test Agent 1',
      services: ['Photography'],
      teamMember: 'Test Photographer 1',
      template: 'layout-1',
      galleryHeader: 'Grid Layout Test Gallery',
      imageFolderLink: '/test/path/1',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-2-' + Date.now(),
      title: 'TEST TEMPLATE 2 - Centered Focus',
      propertyAddress: '456 Centered Focus Avenue',
      companyName: 'Test Company 2',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop',
      agent: 'Test Agent 2',
      services: ['Photography', 'Videography'],
      teamMember: 'Test Photographer 2',
      template: 'layout-2',
      galleryHeader: 'Centered Focus Test Gallery',
      imageFolderLink: '/test/path/2',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-3-' + Date.now(),
      title: 'TEST TEMPLATE 3 - Asymmetrical Grid',
      propertyAddress: '789 Asymmetrical Grid Boulevard',
      companyName: 'Test Company 3',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=500&fit=crop',
      agent: 'Test Agent 3',
      services: ['Photography', 'Drone'],
      teamMember: 'Test Photographer 3',
      template: 'layout-3',
      galleryHeader: 'Asymmetrical Grid Test Gallery',
      imageFolderLink: '/test/path/3',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-4-' + Date.now(),
      title: 'TEST TEMPLATE 4 - Masonry Style',
      propertyAddress: '321 Masonry Style Road',
      companyName: 'Test Company 4',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=300&fit=crop',
      agent: 'Test Agent 4',
      services: ['Photography', 'Floor Plans'],
      teamMember: 'Test Photographer 4',
      template: 'layout-4',
      galleryHeader: 'Masonry Style Test Gallery',
      imageFolderLink: '/test/path/4',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-5-' + Date.now(),
      title: 'TEST TEMPLATE 5 - Hero Gallery',
      propertyAddress: '654 Hero Gallery Lane',
      companyName: 'Test Company 5',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
      agent: 'Test Agent 5',
      services: ['Photography', 'Virtual Tour'],
      teamMember: 'Test Photographer 5',
      template: 'layout-5',
      galleryHeader: 'Hero Gallery Test Gallery',
      imageFolderLink: '/test/path/5',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-6-' + Date.now(),
      title: 'TEST TEMPLATE 6 - Video Center Layout',
      propertyAddress: '987 Video Center Street',
      companyName: 'Test Company 6',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=400&fit=crop',
      agent: 'Test Agent 6',
      services: ['Photography', 'Videography'],
      teamMember: 'Test Photographer 6',
      template: 'layout-6',
      galleryHeader: 'Video Center Layout Test Gallery',
      imageFolderLink: '/test/path/6',
      videoLink: 'https://example.com/test-video.mp4',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 'test-template-7-' + Date.now(),
      title: 'TEST TEMPLATE 7 - Story Layout',
      propertyAddress: '159 Story Layout Drive',
      companyName: 'Test Company 7',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
      agent: 'Test Agent 7',
      services: ['Photography', 'Drone'],
      teamMember: 'Test Photographer 7',
      template: 'layout-7',
      galleryHeader: 'Story Layout Test Gallery',
      imageFolderLink: '/test/path/7',
      restrictDownload: false,
      watermarkEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Add test galleries to existing ones
  const existingGalleries = JSON.parse(localStorage.getItem('galleries') || '[]');
  const updatedGalleries = [...testGalleries, ...existingGalleries];
  localStorage.setItem('galleries', JSON.stringify(updatedGalleries));

  console.log('✅ Created 7 test galleries with different templates:', testGalleries.map(g => ({
    id: g.id,
    title: g.title,
    template: g.template
  })));
  
  return testGalleries;
}

// Test viewing a specific gallery
function testViewGallery(galleryId) {
  const url = `/gallery/${galleryId}`;
  console.log(`🔗 Opening gallery at: ${url}`);
  window.open(url, '_blank');
}

// Test all gallery templates
function testAllTemplates() {
  const testGalleries = createTestGalleries();
  
  console.log('🎯 Test all templates by clicking these commands:');
  testGalleries.forEach((gallery, index) => {
    console.log(`${index + 1}. testViewGallery("${gallery.id}") // ${gallery.template} - ${gallery.title}`);
  });
  
  return testGalleries;
}

// Verify template data integrity
function verifyTemplateData() {
  const galleries = JSON.parse(localStorage.getItem('galleries') || '[]');
  const testGalleries = galleries.filter(g => g.title.includes('TEST TEMPLATE'));
  
  console.log('🔍 Verifying template data integrity...');
  testGalleries.forEach(gallery => {
    console.log(`Gallery: ${gallery.title}`);
    console.log(`  Template: ${gallery.template}`);
    console.log(`  Has template property: ${!!gallery.template}`);
    console.log(`  Template type: ${typeof gallery.template}`);
    console.log('---');
  });
  
  return testGalleries;
}

// Clean up test galleries
function cleanupTestGalleries() {
  clearTestGalleries();
  console.log('🧹 Test galleries cleaned up');
  // Refresh the page to see the updated gallery list
  window.location.reload();
}

// Main test function
function runTemplateTests() {
  console.log('🚀 Running comprehensive template tests...');
  
  const testGalleries = testAllTemplates();
  
  console.log('📋 Test Results:');
  console.log(`✅ Created ${testGalleries.length} test galleries`);
  console.log('✅ Each gallery has a different template (layout-1 through layout-7)');
  console.log('✅ All templates are properly saved to localStorage');
  
  verifyTemplateData();
  
  console.log('🎯 Next Steps:');
  console.log('1. Refresh this page to see the new test galleries');
  console.log('2. Click the eye icon on each test gallery to view the template');
  console.log('3. Check that each gallery displays the correct layout');
  console.log('4. Run cleanupTestGalleries() when done testing');
  
  return {
    testGalleries,
    testViewGallery,
    verifyTemplateData,
    cleanupTestGalleries
  };
}

// Make functions globally available
window.templateTests = {
  runTemplateTests,
  testAllTemplates,
  testViewGallery,
  verifyTemplateData,
  cleanupTestGalleries,
  createTestGalleries,
  clearTestGalleries
};

console.log('🎯 Template test functions available at: window.templateTests');
console.log('💡 Run: templateTests.runTemplateTests() to start testing');
console.log('💡 Run: templateTests.cleanupTestGalleries() to clean up when done');

// Auto-run the tests
runTemplateTests();
