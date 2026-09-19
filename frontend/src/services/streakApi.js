const API_BASE_URL = 'http://localhost:5001/api/daily-streak';

export const getRewards = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE_URL}/rewards`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.reload();
        return;
    }

    if (!response.ok) {
        throw new Error('Failed to fetch rewards');
    }

    return response.json();
};