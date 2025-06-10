document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generateBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputId = document.getElementById('output-id')?.querySelector('.output-content');
    const outputEn = document.getElementById('output-en')?.querySelector('.output-content');
    const clearBtn = document.getElementById('clearBtn');
    
    // Pastikan elemen yang diperlukan ada
    if (!generateBtn || !copyBtn || !outputId || !outputEn || !clearBtn) {
        console.error('Salah satu elemen penting tidak ditemukan!');
        return;
    }
    
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
    
    // Initialize camera preset functionality
    const cameraPresetSelect = document.getElementById('cameraPreset');
    const visualDetailsTextarea = document.getElementById('visualDetails');
    
    if (cameraPresetSelect && visualDetailsTextarea) {
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
        console.log('Generate button clicked');
        
        // Get all input values
        const sceneTitle = document.getElementById('sceneTitle')?.value.trim() || '';
        const characterDescription = document.getElementById('characterDescription')?.value.trim() || '';
        const voiceDetails = document.getElementById('voiceDetails')?.value.trim() || '';
        const characterActions = document.getElementById('characterActions')?.value.trim() || '';
        const characterExpressions = document.getElementById('characterExpressions')?.value.trim() || '';
        const setting = document.getElementById('setting')?.value.trim() || '';
        const visualDetails = visualDetailsTextarea?.value.trim() || '';
        const mood = document.getElementById('mood')?.value.trim() || '';
        const ambientSound = document.getElementById('ambientSound')?.value.trim() || '';
        const dialog = document.getElementById('dialog')?.value.trim() || '';
        const negativePrompt = document.getElementById('negativePrompt')?.value.trim() || '';
        
        console.log('Input values:', { sceneTitle, characterDescription, voiceDetails });
        
        // Validate required fields
        if (!sceneTitle || !characterDescription || !voiceDetails) {
            const errorMsg = 'Mohon isi setidaknya judul scene, deskripsi karakter, dan detail suara.';
            console.error('Validation failed:', errorMsg);
            
            if (outputId) outputId.textContent = errorMsg;
            if (outputEn) outputEn.textContent = 'Please fill in at least scene title, character description, and voice details.';
            
            // Show the copy button even on error
            if (copyBtn) copyBtn.style.display = 'block';
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
        
        // Update the outputs
        if (outputId) outputId.textContent = promptId;
        if (outputEn) outputEn.textContent = promptId;
        
        // Show the copy button
        if (copyBtn) copyBtn.style.display = 'block';
        
        // Scroll to the output section
        const outputContainer = document.querySelector('.output-container');
        if (outputContainer) {
            outputContainer.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    function copyToClipboard() {
        if (!outputId || !outputEn) return;
        
        // Combine both versions with a separator
        const combinedText = `=== INDONESIA ===\n${outputId.textContent}\n\n=== ENGLISH ===\n${outputEn.textContent}`;
        
        navigator.clipboard.writeText(combinedText).then(() => {
            // Change button style on success
            copyBtn.textContent = 'Tersalin!';
            copyBtn.style.backgroundColor = '#27ae60';
            
            // Revert back after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = 'Salin ke Clipboard';
                copyBtn.style.backgroundColor = '#e74c3c';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            copyBtn.textContent = 'Gagal menyalin';
            copyBtn.style.backgroundColor = '#7f8c8d';
            
            // Revert back after 2 seconds
            setTimeout(() => {
                copyBtn.textContent = 'Salin ke Clipboard';
                copyBtn.style.backgroundColor = '#e74c3c';
            }, 2000);
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
        if (outputId) outputId.textContent = 'Prompt akan muncul di sini...';
        if (outputEn) outputEn.textContent = 'Prompt will appear here...';
        
        // Hide copy button
        if (copyBtn) copyBtn.style.display = 'none';
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
