const fs = require('fs');
const path = require('path');

try {
    const envPath = path.join(process.cwd(), '.env');
    console.log(`Reading .env from ${envPath}`);

    // Create .env if it doesn't exist
    if (!fs.existsSync(envPath)) {
        fs.writeFileSync(envPath, '');
    }

    let content = fs.readFileSync(envPath, 'utf8');
    let originalContent = content;

    function updateOrAdd(key, value) {
        const regex = new RegExp(`^${key}=.*$`, 'm');
        if (regex.test(content)) {
            content = content.replace(regex, `${key}=${value}`);
            console.log(`Updated ${key}`);
        } else {
            if (content.length > 0 && !content.endsWith('\n')) {
                content += '\n';
            }
            content += `${key}=${value}\n`;
            console.log(`Added ${key}`);
        }
    }

    updateOrAdd('GOOGLE_API_KEY', 'AIzaSyBZM5A_4-25ozifLBqpvsnb7m745Pwk0v8');
    updateOrAdd('GENAI_PROVIDER', 'google');
    updateOrAdd('GENAI_MODEL', 'gemini-3.0');

    if (content !== originalContent) {
        fs.writeFileSync(envPath, content);
        console.log('.env updated successfully.');
    } else {
        console.log('No changes needed.');
    }

} catch (e) {
    console.error('Error updating .env:', e);
}
