let data = require('./data/data.json');

const fetchData = async () => {
    try {
        const response = await fetch(data);
        if (!response.ok) {
            throw new Error('Data file not found');
        }

    const data = await response.json();
    return data;
    
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}