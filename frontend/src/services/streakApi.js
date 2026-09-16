const API_BASE_URL = 'http://localhost:5001/api/daily-streak';

export const getRewards = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/rewards`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch rewards');
    }

    return response.json();
};