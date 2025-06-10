document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const output = document.getElementById('output');
    
    // Generate prompt when the button is clicked
    generateBtn.addEventListener('click', generatePrompt);
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', copyToClipboard);
    
    // Translate to English
    translateBtn.addEventListener('click', translateToEnglish);
    
    // Clear all fields
    clearBtn.addEventListener('click', clearAllFields);
    
    // Camera presets mapping
    const cameraPresets = {
        'closeup': 'Close-up wajah, fokus pada ekspresi, pencahayaan lembut, depth of field dangkal (f/1.8)',
        'medium': 'Medium shot (dada ke atas), pencahayaan natural, depth of field sedang (f/2.8)',
        'full': 'Full body shot, pencahayaan ruangan, depth of field dalam (f/5.6)',
        'over-shoulder': 'Over shoulder shot, fokus pada subjek di belakang, depth of field sedang (f/2.8)',
        'low-angle': 'Low angle shot, kamera menghadap ke atas, pencahayaan dramatis',
        'high-angle': 'High angle shot, kamera menghadap ke bawah, pencahayaan lembut',
        'dutch-angle': 'Dutch angle (miring), sudut kamera 30 derajat, pencahayaan kontras',
        'tracking': 'Tracking shot, kamera mengikuti gerakan, fokus otomatis halus',
        'custom': ''
    };

    // Initialize camera preset functionality
    const cameraPresetSelect = document.getElementById('cameraPreset');
    const visualDetailsTextarea = document.getElementById('visualDetails');
    
    cameraPresetSelect.addEventListener('change', function() {
        const preset = this.value;
        if (preset && preset !== 'custom') {
            visualDetailsTextarea.value = cameraPresets[preset];
            // Trigger input event to resize textarea
            const event = new Event('input');
            visualDetailsTextarea.dispatchEvent(event);
        } else if (preset === 'custom') {
            visualDetailsTextarea.value = '';
            visualDetailsTextarea.placeholder = 'Masukkan detail kamera secara manual...';
            visualDetailsTextarea.focus();
        }
    });

    function generatePrompt() {
        // Get all input values
        const sceneTitle = document.getElementById('sceneTitle').value.trim();
        const characterDescription = document.getElementById('characterDescription').value.trim();
        const voiceDetails = document.getElementById('voiceDetails').value.trim();
        const characterActions = document.getElementById('characterActions').value.trim();
        const characterExpressions = document.getElementById('characterExpressions').value.trim();
        const setting = document.getElementById('setting').value.trim();
        const visualDetails = visualDetailsTextarea.value.trim();
        const mood = document.getElementById('mood').value.trim();
        const ambientSound = document.getElementById('ambientSound').value.trim();
        const dialog = document.getElementById('dialog').value.trim();
        const negativePrompt = document.getElementById('negativePrompt').value.trim();
        
        // Validate required fields
        if (!sceneTitle || !characterDescription || !voiceDetails) {
            output.textContent = 'Mohon isi setidaknya judul scene, deskripsi karakter, dan detail suara.';
            return;
        }
        
        // Generate the prompt
        let prompt = `**${sceneTitle}**\n\n`;
        
        prompt += `**1. Deskripsi Karakter Inti:**\n${characterDescription}\n\n`;
        
        prompt += `**2. Detail Suara Karakter:**\n${voiceDetails}\n\n`;
        
        if (characterActions) {
            prompt += `**3. Aksi Karakter:**\n${characterActions}\n\n`;
        }
        
        if (characterExpressions) {
            prompt += `**4. Ekspresi Karakter:**\n${characterExpressions}\n\n`;
        }
        
        if (setting) {
            prompt += `**5. Latar Tempat dan Waktu:**\n${setting}\n\n`;
        }
        
        if (visualDetails) {
            prompt += `**6. Detail Visual Tambahan (Kamera):**\n${visualDetails}\n\n`;
        }
        
        if (mood) {
            prompt += `**7. Suasana Keseluruhan:**\n${mood}\n\n`;
        }
        
        if (ambientSound) {
            prompt += `**8. Suara Lingkungan:**\n${ambientSound}\n\n`;
        }
        
        if (dialog) {
            prompt += `**9. Dialog Karakter:**\n"${dialog}"\n\n`;
        }
        
        if (negativePrompt) {
            prompt += `**10. Negative Prompt:**\n${negativePrompt}`;
        }
        
        // Display the generated prompt
        output.textContent = prompt;
        output.dataset.language = 'id'; // Set language flag
        
        // Show the copy button
        copyBtn.style.display = 'block';
    }
    
    async function translateToEnglish() {
        const currentPrompt = output.textContent.trim();
        if (!currentPrompt || currentPrompt === 'Prompt akan muncul di sini...') {
            output.textContent = 'Tidak ada prompt untuk diterjemahkan. Silakan generate prompt terlebih dahulu.';
            return;
        }
        
        if (output.dataset.language === 'en') {
            output.textContent = 'Prompt sudah dalam bahasa Inggris.';
            return;
        }
        
        try {
            // Show loading state
            const originalText = translateBtn.textContent;
            translateBtn.textContent = 'Menerjemahkan...';
            translateBtn.disabled = true;
            
            // In a real app, you would call a translation API here
            // This is a mock implementation
            const translatedPrompt = await mockTranslateToEnglish(currentPrompt);
            
            output.textContent = translatedPrompt;
            output.dataset.language = 'en';
            
            // Show success message
            translateBtn.textContent = 'Diterjemahkan!';
            setTimeout(() => {
                translateBtn.textContent = originalText;
                translateBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            console.error('Translation error:', error);
            output.textContent = 'Terjadi kesalahan saat menerjemahkan. Silakan coba lagi.';
            translateBtn.textContent = 'Gagal Menerjemahkan';
            setTimeout(() => {
                translateBtn.textContent = 'Translate to English';
                translateBtn.disabled = false;
            }, 2000);
        }
    }
    
    // Mock translation function - in a real app, replace this with an actual API call
    function mockTranslateToEnglish(text) {
        // This is a simple mock - in a real app, use a translation API
        const translations = {
            '**1. Deskripsi Karakter Inti:**': '**1. Character Description:**',
            '**2. Detail Suara Karakter:**': '**2. Voice Details:**',
            '**3. Aksi Karakter:**': '**3. Character Actions:**',
            '**4. Ekspresi Karakter:**': '**4. Character Expressions:**',
            '**5. Latar Tempat dan Waktu:**': '**5. Setting and Time:**',
            '**6. Detail Visual Tambahan (Kamera):**': '**6. Additional Visual Details (Camera):**',
            '**7. Suasana Keseluruhan:**': '**7. Overall Mood:**',
            '**8. Suara Lingkungan:**': '**8. Ambient Sound:**',
            '**9. Dialog Karakter:**': '**9. Character Dialogue:**',
            '**10. Negative Prompt:**': '**10. Negative Prompt:**',
            'Tidak ada prompt untuk diterjemahkan. Silakan generate prompt terlebih dahulu.': 'No prompt to translate. Please generate a prompt first.',
            'Prompt sudah dalam bahasa Inggris.': 'Prompt is already in English.'
        };
        
        let translated = text;
        for (const [id, en] of Object.entries(translations)) {
            translated = translated.replace(new RegExp(id, 'g'), en);
        }
        return translated;
    }
    
    function clearAllFields() {
        // Clear all input fields
        document.querySelectorAll('input[type="text"], textarea').forEach(input => {
            input.value = '';
            // Reset textarea height
            if (input.tagName === 'TEXTAREA') {
                input.style.height = 'auto';
            }
        });
        
        // Clear output
        output.textContent = 'Prompt akan muncul di sini...';
        delete output.dataset.language;
        
        // Hide copy button
        copyBtn.style.display = 'none';
        
        // Show feedback
        const originalText = clearBtn.textContent;
        clearBtn.textContent = 'Cleared!';
        setTimeout(() => {
            clearBtn.textContent = originalText;
        }, 2000);
    }
    
    function copyToClipboard() {
        // Select the output text
        const range = document.createRange();
        range.selectNode(output);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        // Copy the text
        try {
            const successful = document.execCommand('copy');
            const message = successful ? 'Prompt berhasil disalin!' : 'Gagal menyalin prompt';
            
            // Show feedback
            const originalText = copyBtn.textContent;
            copyBtn.textContent = message;
            copyBtn.style.backgroundColor = successful ? '#27ae60' : '#e74c3c';
            
            // Revert button after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '#2ecc71';
            }, 2000);
            
        } catch (err) {
            console.error('Gagal menyalin teks: ', err);
        }
        
        // Clear the selection
        window.getSelection().removeAllRanges();
    }
    
    // Hide copy button initially
    copyBtn.style.display = 'none';
});

// Add auto-resize for textareas
const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });
});
