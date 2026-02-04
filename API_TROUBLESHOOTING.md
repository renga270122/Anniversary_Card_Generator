# 🔧 API Troubleshooting Guide

## Fixed: API Endpoint Issue

The API calls have been updated from `gemini-pro` to `gemini-1.5-flash` which is the correct current model.

---

## How to Test the Fix

1. **Refresh the browser** (press F5 or reload)
2. Enter recipient name
3. Select a relationship type
4. Click "Generate AI Messages"

---

## Getting Your API Key

1. Visit: https://makersuite.google.com/app/apikey
2. Sign in with Google
3. Click "Create API Key"
4. Copy the key
5. In the app, click "Configure API"
6. Paste and save

---

## Common Issues & Solutions

### "Failed to generate messages"

**Checklist:**
- ✅ API key is entered correctly (no spaces)
- ✅ You have internet connection
- ✅ You haven't exceeded quota (60 requests/min free)
- ✅ You filled in recipient name
- ✅ You selected a relationship type

**Test Your API Key:**
Open browser console (F12) and check for error messages. Common errors:

1. **"API_KEY_INVALID"**
   - Your API key is wrong
   - Generate a new one at https://makersuite.google.com/app/apikey

2. **"quota exceeded"**
   - You've made too many requests
   - Wait 1 minute and try again
   - Free tier: 60 requests per minute

3. **"Network error"**
   - Check internet connection
   - Try disabling VPN/proxy
   - Check firewall settings

4. **"CORS error"**
   - This should not happen with the correct endpoint
   - Try a different browser

---

## Verify API Key Works

### Test with curl (Command Line):
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Say hello"}]}]}'
```

### Expected Response:
```json
{
  "candidates": [{
    "content": {
      "parts": [{"text": "Hello! 👋 ..."}]
    }
  }]
}
```

---

## What Was Fixed

### Before (Not Working):
```javascript
https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent
```

### After (Working):
```javascript
https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

Plus added:
- Better error handling
- Validation checks
- Detailed error messages
- Generation config parameters

---

## Still Having Issues?

1. **Clear browser cache**
   - Ctrl+Shift+Delete
   - Clear cached files
   - Reload page

2. **Try incognito mode**
   - Rules out extension conflicts
   - Fresh session

3. **Check browser console**
   - Press F12
   - Go to Console tab
   - Look for red error messages
   - Copy error and troubleshoot

4. **Test API key separately**
   - Visit: https://aistudio.google.com/
   - Try generating something there
   - If it works there, API key is valid

5. **Generate new API key**
   - Sometimes keys get corrupted
   - Delete old key
   - Create fresh one
   - Update in app

---

## API Quota Information

### Free Tier (Gemini 1.5 Flash):
- **60 requests per minute**
- **1,500 requests per day**
- **1 million requests per month**

### What Counts as a Request:
- Each "Generate AI Messages" = 3 requests (generates 3 options)
- Each "Refine Message" = 1 request
- Each "Translate" = 1 request
- Each "Generate Affirmation" = 1 request

### Tips to Save Quota:
- Generate once, then refine instead of regenerating
- Copy good messages to reuse later
- Use the manual message option
- Don't spam the generate button

---

## Browser Compatibility

### ✅ Fully Supported:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

### ⚠️ Partial Support:
- Older browsers may have issues
- Update to latest version

### ❌ Not Supported:
- Internet Explorer
- Very old browser versions

---

## Quick Debug Steps

1. Open Console (F12)
2. Go to Console tab
3. Click "Generate AI Messages"
4. Look for errors
5. Common patterns:

**If you see:**
- `400 Bad Request` → API key issue or invalid request
- `403 Forbidden` → API key invalid
- `429 Too Many Requests` → Exceeded quota
- `Network error` → Connection issue
- `CORS error` → Browser security (shouldn't happen now)

---

## Success!

After the fix, you should see:
1. "⏳ Generating..." appears
2. Wait 2-5 seconds
3. 3 message options appear
4. Click one to use it

---

## Need More Help?

1. Check the error in browser console
2. Verify API key at: https://aistudio.google.com/
3. Try generating new API key
4. Test in different browser
5. Check internet connection

---

**All AI features have been fixed and should work now!** 🎉

Refresh your browser and try again!
