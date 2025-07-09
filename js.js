        // === GLOBAL VARIABLES ===
        const radio = document.getElementById('radio');
        const radioJingle = document.getElementById('radioJingle');
        const typewriterSound = document.getElementById('typewriterSound');
        const newspaperSound = document.getElementById('newspaperSound');
        const radioStatic = document.getElementById('radioStatic');
        const modal = document.getElementById('modal');
        const modalContent = document.getElementById('modalContent');
        const closeModal = document.getElementById('closeModal');
        const articles = document.querySelectorAll('.article');
        const ads = document.querySelectorAll('.advertisement');
        const ticker = document.getElementById('ticker');
        const nightToggle = document.getElementById('nightToggle');
        const searchInput = document.getElementById('searchInput');
        const searchFeedback = document.getElementById('searchFeedback');
        const allSearchableContent = document.querySelectorAll('.article, .advertisement'); // Combined for search
        const readMoreBtn = document.getElementById('readMoreBtn');
        const funFactBox = document.getElementById('funFact');

        let funFactInterval; // To store the interval ID for fun facts

        // === INITIAL SETUP ===

        // Apply saved night mode preference
        if (localStorage.getItem('nightMode') === 'true') {
            document.body.classList.add('night-mode');
            nightToggle.innerHTML = '<i class="fas fa-sun"></i><span class="tooltip">Toggle Day Mode</span>';
        }

        // Play ticker animation and duplicate content
        function setupTicker() {
            // Duplicate ticker content to ensure seamless loop
            ticker.innerHTML += ticker.innerHTML;
        }
        setupTicker();

        // Update the masthead date to 1948 (fixed for historical accuracy)
        document.getElementById('currentDateLine').textContent = "Saturday, June 12, 1948";

        // Initialize a random fun fact
        const facts = [
            "The first Polaroid camera was sold in 1948.",
            "Cheetos were invented in 1948.",
            "Velcro was patented in 1948.",
            "The first McDonald's opened in 1948.",
            "The LP record (long play) was introduced in 1948."
        ];

        function updateFunFact() {
            const randomFact = facts[Math.floor(Math.random() * facts.length)];
            funFactBox.textContent = "📻 Did you know? " + randomFact;
        }

        // Set interval for fun facts (every 30 seconds)
        function startFunFactInterval() {
            if (funFactInterval) clearInterval(funFactInterval); // Clear existing interval if any
            funFactInterval = setInterval(updateFunFact, 30000);
        }
        startFunFactInterval(); // Start on load


        // === RADIO & AUDIO FUNCTIONALITY ===

        let isPlayingStatic = false;
        radioStatic.volume = 0.3; // Set a default volume for static

        radio.addEventListener('click', () => {
            if (isPlayingStatic) {
                radioStatic.pause();
                radioStatic.currentTime = 0; // Rewind static
                radio.innerHTML = '<i class="fas fa-volume-up"></i><span class="tooltip">Toggle Radio Static</span>';
                radio.style.background = 'var(--coke-red)';
            } else {
                // Pause other sounds before playing static
                radioJingle.pause();
                typewriterSound.pause();
                newspaperSound.pause();
                
                radioStatic.play().catch(e => console.error("Error playing radio static:", e));
                radio.innerHTML = '<i class="fas fa-volume-mute"></i><span class="tooltip">Toggle Radio Static</span>';
                radio.style.background = 'gold';
            }
            isPlayingStatic = !isPlayingStatic;
        });

        // Play radio jingle when ads are opened in modal
        ads.forEach(ad => {
            ad.addEventListener('click', () => {
                openModal(ad.innerHTML, ad.querySelector('.ad-title').textContent, 'ad');
                radioJingle.play().catch(e => console.error("Error playing radio jingle:", e));
                radioStatic.pause(); // Pause static if playing
                isPlayingStatic = false;
                radio.innerHTML = '<i class="fas fa-volume-up"></i><span class="tooltip">Toggle Radio Static</span>';
                radio.style.background = 'var(--coke-red)';
            });
        });

        // Random newspaper crinkle sound
        setInterval(() => {
            if (Math.random() > 0.95 && modal.style.display === 'none' && radioStatic.paused) { // Less frequent and only if no modal or static
                newspaperSound.currentTime = 0;
                newspaperSound.play().catch(e => console.error("Error playing newspaper sound:", e));
            }
        }, 60000); // Check every minute

        // === MODAL FUNCTIONALITY ===

        function openModal(contentHtml, headlineText = "Full Article", type = 'article') {
            modalContent.innerHTML = contentHtml;
            // Add a class to modalContent for specific styling if needed (e.g., hiding drop caps)
            modalContent.classList.add(`modal-${type}`);

            // Remove drop caps from modal content for better readability if they clash
            const dropCaps = modalContent.querySelectorAll('.drop-cap');
            dropCaps.forEach(dc => dc.style.float = 'none'); // Remove float
            dropCaps.forEach(dc => dc.style.fontSize = '1.2em'); // Reduce size to blend in

            // Set modal headline for accessibility
            modal.setAttribute('aria-labelledby', 'modalHeadline');
            const modalH1 = document.createElement('h1');
            modalH1.id = 'modalHeadline';
            modalH1.style.display = 'none'; // Visually hide, but for screen readers
            modalH1.textContent = headlineText;
            modalContent.prepend(modalH1);

            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
            typewriterSound.currentTime = 0;
            typewriterSound.play().catch(e => console.error("Error playing typewriter sound:", e));

            // Set dynamic Read More button link (example: archive.org search for headline)
            if (type === 'article') {
                 readMoreBtn.style.display = 'block'; // Show for articles
                 const searchQuery = encodeURIComponent(headlineText + " 1948 newspaper");
                 readMoreBtn.onclick = () => window.open(`https://archive.org/search?query=${searchQuery}&and[]=mediatype%3A%22texts%22&and[]=date%3A%221948%22`, '_blank');
            } else {
                readMoreBtn.style.display = 'none'; // Hide for ads or other content
            }
        }

        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scrolling
            modalContent.innerHTML = ''; // Clear modal content
            typewriterSound.pause();
            typewriterSound.currentTime = 0;
            radioJingle.pause(); // Stop jingle if playing
            radioJingle.currentTime = 0;
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.style.display === 'flex') {
                closeModal.click();
            }
        });

        // === ARTICLE CLICK HANDLERS ===
        articles.forEach(article => {
            article.querySelector('.article-headline').addEventListener('click', (e) => {
                // Ensure only headline click opens modal
                openModal(article.innerHTML, e.target.textContent, 'article');
            });
             // Add hover sound for entire article too
            article.addEventListener('mouseenter', () => {
                typewriterSound.currentTime = 0;
                typewriterSound.play().catch(e => console.error("Error playing typewriter sound:", e));
            });
            article.addEventListener('mouseleave', () => {
                typewriterSound.pause();
                typewriterSound.currentTime = 0;
            });
        });

        // === NIGHT MODE TOGGLE ===
        nightToggle.addEventListener('click', () => {
            document.body.classList.toggle('night-mode');
            const isNightMode = document.body.classList.contains('night-mode');
            localStorage.setItem('nightMode', isNightMode); // Save preference
            nightToggle.innerHTML = isNightMode 
                ? '<i class="fas fa-sun"></i><span class="tooltip">Toggle Day Mode</span>' 
                : '<i class="fas fa-moon"></i><span class="tooltip">Toggle Night Mode</span>';
        });

        // === SEARCH FUNCTIONALITY ===
        searchInput.addEventListener('input', function() {
            const keyword = this.value.toLowerCase().trim();
            let resultsFound = 0;

            allSearchableContent.forEach(item => {
                const originalHTML = item.dataset.originalHtml || item.innerHTML; // Store original HTML
                item.dataset.originalHtml = originalHTML; // Save it the first time

                let itemText = item.textContent.toLowerCase();
                let itemVisible = false;

                if (keyword === "") {
                    item.style.display = 'block'; // Show all when search is empty
                    item.innerHTML = originalHTML; // Restore original HTML
                    itemVisible = true;
                } else if (itemText.includes(keyword)) {
                    item.style.display = 'block';
                    // Highlight the keyword
                    const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'); // Escape special characters
                    const highlightedHTML = originalHTML.replace(regex, (match) => `<span class="highlight">${match}</span>`);
                    item.innerHTML = highlightedHTML;
                    itemVisible = true;
                } else {
                    item.style.display = 'none';
                }

                if (itemVisible) {
                    resultsFound++;
                }
            });

            if (keyword === "") {
                searchFeedback.textContent = '';
            } else if (resultsFound > 0) {
                searchFeedback.textContent = `Found ${resultsFound} matching articles/ads.`;
            } else {
                searchFeedback.textContent = 'No results found.';
            }
        });

        // === PRINT BUTTON (SIMULATED) ===
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                alert("The Daily Gazette is printing... Please use your browser's print function (Ctrl+P or Cmd+P) for a physical copy!");
                // Optionally: window.print();
            }
        });
