# Studiio Admin Pro

## Provider Setup (Dropbox)

### Step 1: Create Dropbox Scoped App
1. Go to [Dropbox App Console](https://www.dropbox.com/developers/apps)
2. Click "Create app"
3. Choose "Scoped app" → "Full Dropbox" → "No" (for file type access)
4. Name your app (e.g., "Studiio Gallery")
5. Note your App Key and App Secret

### Step 2: Configure Scopes
In your app settings, ensure these scopes are enabled:
- `files.metadata.read` - Read file metadata
- `files.content.read` - Read file content
- `sharing.read` - Read shared link information

### Step 3: Generate Access Token
1. In your app settings, go to "Permissions" tab
2. Click "Submit" to request permission changes
3. Go to "Settings" tab
4. Click "Generate" under "Generated access token"
5. Copy the token and add to your `.env.local`:

```env
DROPBOX_TOKEN=your_access_token_here
```

**Important**: Never expose this token in client-side code. It must remain server-side only.

### Step 4: API Usage
The app will use:
- `sharing/list_shared_link_files` - List files in shared folders
- `files/get_temporary_link` - Generate temporary download URLs

## Provider Setup (Google Drive)

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Google Drive API

### Step 2: Create Service Account
1. Go to "IAM & Admin" → "Service Accounts"
2. Click "Create Service Account"
3. Name it (e.g., "Studiio Gallery Service")
4. Grant "Drive API User" role
5. Create and download the JSON key file

### Step 3: Configure OAuth Client (Optional)
For user authentication in the future:
1. Go to "APIs & Services" → "Credentials"
2. Create "OAuth 2.0 Client ID"
3. Configure authorized redirect URIs

### Step 4: Environment Variables
Add to your `.env.local`:

```env
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_API_KEY=your_api_key_here  # Optional, for public file access
```

### Step 5: API Scopes
The service account will use:
- `https://www.googleapis.com/auth/drive.readonly` - Read-only access to Drive files

### Step 6: Shared Folder Access
**Option A: Public Folders**
- Share folder publicly and use the folder ID from the URL
- No authentication required for public access

**Option B: Service Account Access**
- Share folder with service account email
- Service account authenticates and lists files

### URL Format Examples
- **Dropbox**: `https://www.dropbox.com/scl/fo/abc123/...?dl=0`
- **Google Drive**: `https://drive.google.com/drive/folders/1ABC123...`

## Troubleshooting

### Common Issues
1. **Invalid Link**: Ensure the folder is shared publicly
2. **API Quota Exceeded**: Implement caching (8-15 min TTL)
3. **Authentication Failed**: Check environment variables
4. **Folder Not Found**: Verify sharing permissions

### Rate Limits
- **Dropbox**: 1000 requests per hour
- **Google Drive**: 1000 requests per 100 seconds per user

### Logging
The system logs:
- Provider detection
- API call duration
- Item count returned
- Error details for debugging
