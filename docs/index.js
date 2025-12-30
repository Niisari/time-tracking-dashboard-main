const DATA_URL = './data/data.json';

const MENU_SVG = `
<svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.5 0a2.5 2.5 0 1 1 0 5
             2.5 2.5 0 0 1 0-5Zm8 0a2.5
             2.5 0 1 1 0 5 2.5 2.5 0 0
             1 0-5Zm8 0a2.5 2.5 0 1 1
             0 5 2.5 2.5 0 0 1 0-5Z"
          fill="currentColor"/>
</svg>
`;


const getLastTimeFrameLabel = (timeframe) => {
    if (timeframe === 'daily') return 'Yesterday';
    if (timeframe === 'weekly') return 'Last Week';
    return 'Last Month';
};

const createEl = (tag, className, text) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text) el.textContent = text;
    return el;
};

const clearActiveButtons = (buttons) => {
    buttons.forEach(btn => btn.classList.remove('active'));
};

const fetchData = async () => {
    try {
        const response = await fetch(DATA_URL);
        if (!response.ok) {
            throw new Error('Data file not found');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

const displayTimeframe = (data, timeframe) => {
    const timeBody = document.querySelector('.time__body');
    timeBody.innerHTML = '';

    const label = getLastTimeFrameLabel(timeframe);

    data.forEach(({ title, timeframes }) => {
        const section = createEl(
            'section',
            `time__activity time__activity--${title.toLowerCase().replace(/\s+/g, '-')}`
        );

        const info = createEl('div', 'time__activity-info');

        // Row 1
        const row1 = createEl('div', 'time__activity-row-1');
        const heading = createEl('h2', 'time__activity-type', title);

        const hours = createEl(
            'p',
            'time__activity-hours',
            `${timeframes[timeframe].current}hrs`
        );

        row1.append(heading, hours);

        // Row 2
        const row2 = createEl('div', 'time__activity-row-2');

        const menuBtn = createEl('button', 'time__activity-menu');
        menuBtn.setAttribute('aria-label', 'Open activity menu');
        menuBtn.innerHTML = MENU_SVG;

        const previous = createEl(
            'p',
            'time__activity-previous',
            `${label} - ${timeframes[timeframe].previous}hrs`
        );

        row2.append(menuBtn, previous);

        info.append(row1, row2);
        section.appendChild(info);
        timeBody.appendChild(section);
    });
};

const initializeDashboard = async () => {
    const buttons = document.querySelectorAll('.btn__timeframe');
    const data = await fetchData();

    let currentTimeframe = 'daily';

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            const timeframe = button.textContent.toLowerCase();

            if (timeframe === currentTimeframe) return;

            currentTimeframe = timeframe;
            clearActiveButtons(buttons);
            button.classList.add('active');

            displayTimeframe(data, timeframe);
        });
    });

    // Initial render
    buttons[0].classList.add('active');
    displayTimeframe(data, currentTimeframe);
};

initializeDashboard();
