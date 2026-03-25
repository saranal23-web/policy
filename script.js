document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const welcomeMessage = document.querySelector('.welcome-message');
    const themeToggle = document.getElementById('theme-toggle');
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    const chips = document.querySelectorAll('.chip');
    
    // Bank Selection Logging
    const bankItems = document.querySelectorAll('.bank-list li');
    let currentBank = 'General';
    const bankDetails = {
        'General': 'Ask questions general to any policy framework.',
        'HDFC Bank': 'HDFC ERGO features comprehensive health and auto plans with quick digital claim processing.',
        'ICICI Bank': 'ICICI Lombard typically requires pre-authorization for cashless health claims via their IL TakeCare app.',
        'SBI (State Bank of India)': 'SBI General Insurance offers massive network coverage across India, perfect for rural and urban areas.',
        'Axis Bank': 'Axis Bank partners with Max Life for extensive term insurance policies and investment hybrid covers.'
    };

    bankItems.forEach(item => {
        item.addEventListener('click', () => {
            bankItems.forEach(b => b.classList.remove('active'));
            item.classList.add('active');
            currentBank = item.dataset.bank;
            
            document.getElementById('welcome-title').innerText = `Hello! How can I help you with ${currentBank}?`;
            document.getElementById('bank-details-card').innerHTML = `
                <h3>${currentBank}</h3>
                <p>${bankDetails[currentBank] || ''}</p>
            `;
        });
    });

    // File Upload Handling
    const fileUpload = document.getElementById('file-upload');
    const uploadIndicator = document.getElementById('upload-indicator');
    const uploadFilename = document.getElementById('upload-filename');
    const removeFileBtn = document.getElementById('remove-file-btn');

    fileUpload.addEventListener('change', () => {
        if (fileUpload.files.length > 0) {
            uploadFilename.textContent = fileUpload.files[0].name;
            uploadIndicator.classList.remove('hidden');
            userInput.placeholder = "Ask a question about this document...";
        }
    });

    removeFileBtn.addEventListener('click', () => {
        fileUpload.value = '';
        uploadIndicator.classList.add('hidden');
        userInput.placeholder = "Message or ask about your document...";
    });

    // Theme Logic
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcons(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcons(newTheme);
    });

    function updateThemeIcons(theme) {
        if (theme === 'dark') {
            moonIcon.classList.add('hidden');
            sunIcon.classList.remove('hidden');
        } else {
            moonIcon.classList.remove('hidden');
            sunIcon.classList.add('hidden');
        }
    }

    // Input Handling
    userInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
        if (this.scrollHeight > 200) this.style.overflowY = 'auto';
        else this.style.overflowY = 'hidden';
        sendBtn.disabled = this.value.trim() === '';
    });

    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!sendBtn.disabled) chatForm.dispatchEvent(new Event('submit'));
        }
    });

    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            userInput.value = chip.textContent;
            sendBtn.disabled = false;
            userInput.style.height = 'auto';
            chatForm.dispatchEvent(new Event('submit'));
        });
    });

    // Form Submission utilizing FormData (multipart/form-data)
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const text = userInput.value.trim();
        if (!text) return;

        if (welcomeMessage) welcomeMessage.style.display = 'none';

        addMessage(text, 'user');
        
        userInput.value = '';
        userInput.style.height = 'auto';
        sendBtn.disabled = true;

        const loadingId = addLoading();

        try {
            const formData = new FormData();
            formData.append('question', text);
            formData.append('bank', currentBank);
            
            if (fileUpload.files.length > 0) {
                formData.append('file', fileUpload.files[0]);
            }

            const response = await fetch('/ask', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            
            document.getElementById(loadingId).remove();

            if (response.ok) {
                addMessage(data.answer, 'ai', false);
            } else {
                addMessage(data.detail || 'An error occurred while processing your request.', 'ai', true, true);
            }

        } catch (error) {
            document.getElementById(loadingId).remove();
            addMessage('Network error. Ensure the server is running and try again.', 'ai', true, true);
        }
    });

    function addMessage(content, sender, isWarning = false, isError = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        
        let formattedContent = content;
        if (sender === 'ai' && window.marked) {
            formattedContent = marked.parse(content);
        } else if (sender === 'user') {
            formattedContent = `<p>${escapeHTML(content)}</p>`;
        }

        let bodyClass = 'message-body';
        if (isError) bodyClass += ' error-text';
        if (isWarning) formattedContent = `<em>${formattedContent}</em>`;

        const avatarContent = sender === 'user' ? 
            `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>` : 
            `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;

        msgDiv.innerHTML = `
            <div class="message-content-wrapper">
                <div class="avatar">${avatarContent}</div>
                <div class="${bodyClass}">${formattedContent}</div>
            </div>
        `;

        chatMessages.appendChild(msgDiv);
        scrollToBottom();
    }

    function addLoading() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = `message ai`;
        
        const avatarContent = `<svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" stroke-width="2" fill="none"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>`;

        msgDiv.innerHTML = `
            <div class="message-content-wrapper">
                <div class="avatar">${avatarContent}</div>
                <div class="message-body">
                    <div class="loading-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function scrollToBottom() {
        const wrapper = document.querySelector('.chat-wrapper');
        wrapper.scrollTop = wrapper.scrollHeight;
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
});
