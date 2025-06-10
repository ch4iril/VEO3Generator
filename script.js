document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputId = document.getElementById('output-id').querySelector('.output-content');
    const outputEn = document.getElementById('output-en').querySelector('.output-content');
    const clearBtn = document.getElementById('clearBtn');
    
    // Generate prompt when the button is clicked
    generateBtn.addEventListener('click', generatePrompt);
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', copyToClipboard);
    
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
        'tracking': 'Gerakan kamera tracking shot dari belakang karakter lalu menyamping dan ke depan, mengikuti langkahnya secara sinematik',
        'custom': ''
    };
    
    // Translation map
    const translationMap = {
        // Section headers
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
        
        // Camera presets
        'Close-up wajah, fokus pada ekspresi, pencahayaan lembut, depth of field dangkal (f/1.8)': 'Close-up face, focus on expression, soft lighting, shallow depth of field (f/1.8)',
        'Medium shot (dada ke atas), pencahayaan natural, depth of field sedang (f/2.8)': 'Medium shot (chest up), natural lighting, medium depth of field (f/2.8)',
        'Full body shot, pencahayaan ruangan, depth of field dalam (f/5.6)': 'Full body shot, room lighting, deep depth of field (f/5.6)',
        'Over shoulder shot, fokus pada subjek di belakang, depth of field sedang (f/2.8)': 'Over shoulder shot, focus on background subject, medium depth of field (f/2.8)',
        'Low angle shot, kamera menghadap ke atas, pencahayaan dramatis': 'Low angle shot, camera facing up, dramatic lighting',
        'High angle shot, kamera menghadap ke bawah, pencahayaan lembut': 'High angle shot, camera facing down, soft lighting',
        'Dutch angle (miring), sudut kamera 30 derajat, pencahayaan kontras': 'Dutch angle (tilted), 30-degree camera angle, contrast lighting',
        'Gerakan kamera tracking shot dari belakang karakter lalu menyamping dan ke depan, mengikuti langkahnya secara sinematik': 'Tracking camera movement from behind the character, then to the side and front, following their steps in a cinematic way',
        'Gaya video/Art style: cinematic realistis, kualitas visual: Resolusi 4K, pencahayaan sinematik, warna yang kaya dan mendalam': 'Video/Art style: cinematic realism, visual quality: 4K Resolution, cinematic lighting, rich and deep colors',
        'Hindari: teks di layar, subtitle, tulisan di video, font, logo, distorsi, artefak, anomali, wajah ganda, anggota badan cacat, tangan tidak normal, orang tambahan, objek mengganggu, kualitas rendah, buram, glitch, suara robotik, suara pecah.': 'Avoid: on-screen text, subtitles, writing in video, fonts, logos, distortion, artifacts, anomalies, double faces, deformed limbs, abnormal hands, extra people, distracting objects, low quality, blurry, glitches, robotic voice, distorted audio.'
    };
    
    // Initialize camera preset functionality
    const cameraPresetSelect = document.getElementById('cameraPreset');
    const visualDetailsTextarea = document.getElementById('visualDetails');
    
    if (cameraPresetSelect) {
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
    }
    
    function generatePrompt() {
        // Get all input values
        const sceneTitle = document.getElementById('sceneTitle').value.trim();
        const characterDescription = document.getElementById('characterDescription').value.trim();
        const voiceDetails = document.getElementById('voiceDetails').value.trim();
        const characterActions = document.getElementById('characterActions').value.trim();
        const characterExpressions = document.getElementById('characterExpressions').value.trim();
        const setting = document.getElementById('setting').value.trim();
        const visualDetails = visualDetailsTextarea ? visualDetailsTextarea.value.trim() : '';
        const mood = document.getElementById('mood').value.trim();
        const ambientSound = document.getElementById('ambientSound').value.trim();
        const dialog = document.getElementById('dialog').value.trim();
        const negativePrompt = document.getElementById('negativePrompt').value.trim();
        
        // Validate required fields
        if (!sceneTitle || !characterDescription || !voiceDetails) {
            outputId.innerHTML = '<p class="error">Mohon isi setidaknya judul scene, deskripsi karakter, dan detail suara.</p>';
            outputEn.innerHTML = '<p class="error">Please fill in at least scene title, character description, and voice details.</p>';
            return;
        }
        
        // Generate the Indonesian prompt
        let promptId = `**${sceneTitle}**\n\n`;
        promptId += `**1. Deskripsi Karakter Inti:**\n${characterDescription}\n\n`;
        promptId += `**2. Detail Suara Karakter:**\n${voiceDetails}\n\n`;
        if (characterActions) promptId += `**3. Aksi Karakter:**\n${characterActions}\n\n`;
        if (characterExpressions) promptId += `**4. Ekspresi Karakter:**\n${characterExpressions}\n\n`;
        if (setting) promptId += `**5. Latar Tempat dan Waktu:**\n${setting}\n\n`;
        if (visualDetails) promptId += `**6. Detail Visual Tambahan (Kamera):**\n${visualDetails}\n\n`;
        if (mood) promptId += `**7. Suasana Keseluruhan:**\n${mood}\n\n`;
        if (ambientSound) promptId += `**8. Suara Lingkungan:**\n${ambientSound}\n\n`;
        if (dialog) promptId += `**9. Dialog Karakter:**\n"${dialog}"\n\n`;
        if (negativePrompt) promptId += `**10. Negative Prompt:**\n${negativePrompt}`;
        
        // Generate the English prompt
        let promptEn = promptId;
        for (const [id, en] of Object.entries(translationMap)) {
            promptEn = promptEn.split(id).join(en);
        }
        
        // Update the outputs
        outputId.textContent = promptId;
        outputEn.textContent = promptEn;
        
        // Show the copy button
        copyBtn.style.display = 'block';
        
        // Scroll to the output section
        document.querySelector('.output-container').scrollIntoView({ behavior: 'smooth' });
    }
    
    function copyToClipboard() {
        // Combine both versions with a separator
        const combinedText = `=== INDONESIA ===\n${outputId.textContent}\n\n=== ENGLISH ===\n${outputEn.textContent}`;
        
        navigator.clipboard.writeText(combinedText).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Tersalin!';
            copyBtn.style.backgroundColor = '#27ae60';
            
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '#2ecc71';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            copyBtn.textContent = 'Gagal menyalin';
            copyBtn.style.backgroundColor = '#e74c3c';
        });
    }
    
    function clearAllFields() {
        // Clear all input fields
        document.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
            input.value = '';
            if (input.tagName === 'TEXTAREA') {
                input.style.height = 'auto';
            }
        });
        
        // Reset camera preset
        if (cameraPresetSelect) {
            cameraPresetSelect.selectedIndex = 0;
        }
        
        // Reset outputs
        outputId.textContent = 'Prompt akan muncul di sini...';
        outputEn.textContent = 'Prompt will appear here...';
        
        // Hide copy button
        copyBtn.style.display = 'none';
        
        // Show feedback
        const originalText = clearBtn.textContent;
        clearBtn.textContent = 'Dihapus!';
        setTimeout(() => {
            clearBtn.textContent = originalText;
        }, 2000);
    }
    
    // Auto-resize textareas
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
    });
});
