const fs = require('fs');
const path = require('path');

// Pages that need Sidebar component
const pagesToFix = [
  'app/services/page.tsx',
  'app/photographers/page.tsx', 
  'app/editors/page.tsx',
  'app/reports/page.tsx',
  'app/requests/page.tsx',
  'app/newsletter/page.tsx',
  'app/settings/page.tsx',
  'app/clients/agents/page.tsx',
  'app/dashboard/page.tsx'
];

pagesToFix.forEach(pagePath => {
  const fullPath = path.join(__dirname, pagePath);
  
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Check if Sidebar import already exists
    if (!content.includes('import Sidebar from "@/components/Sidebar"')) {
      // Add Sidebar import after PageLayout import
      content = content.replace(
        /import PageLayout from "@\/components\/PageLayout";/,
        'import PageLayout from "@/components/PageLayout";\nimport Sidebar from "@/components/Sidebar";'
      );
      
      // Update return statement to include Sidebar
      content = content.replace(
        /return \(\s*<PageLayout/,
        'return (\n    <>\n      <Sidebar />\n      <PageLayout'
      );
      
      // Close the fragment at the end
      content = content.replace(
        /\s*<\/PageLayout>\s*\);\s*}/,
        '\n      </PageLayout>\n    </>\n  );\n}'
      );
      
      fs.writeFileSync(fullPath, content);
      console.log(`✅ Fixed sidebar for: ${pagePath}`);
    } else {
      console.log(`⏭️  Sidebar already exists in: ${pagePath}`);
    }
  } else {
    console.log(`❌ File not found: ${pagePath}`);
  }
});

console.log('🎉 Sidebar fix complete!');







